import { FileGeomReader } from './file-geom-reader.class';
import { PublisherFeatureModel } from '@cotvisor-admin/modules/layers/layers-file-publisher/publisher-feature.model';
import { Utilities } from './utilities.class';
import { PublisherLayerModel } from '@cotvisor-admin/modules/layers/layers-file-publisher/publisher-layer.model';
import { Observable } from 'rxjs/Observable';
import * as ol from 'openlayers';

export class LayerFilePublisherModeler {

  public filesAcepted = ' application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip';
  private fileGeomReader: FileGeomReader;

  /**
   * Lee el archivo y devuelve la capa conforme al modelo necesario para publicar
   *
   * @param {File} geomFile
   * @param {string} layerName
   * @returns {Observable<PublisherLayerModel>}
   *
   * @memberOf LayerFilePublisherModeler
   */
  read(geomFile: File, layerTitle: string): Observable<PublisherLayerModel> {

    return new Observable(observer => {

      this.fileGeomReader = new FileGeomReader(geomFile);

      const publisherLayerModel = new PublisherLayerModel();

      this.fileGeomReader.read()
        .subscribe(
          fileFeatures => {
            publisherLayerModel.features = this.mapFileFeatures(fileFeatures.features);
            publisherLayerModel.types = this.getFeatureTypes(publisherLayerModel.features[0].properties);
            publisherLayerModel.title = layerTitle;
            publisherLayerModel.crs = fileFeatures.src;
            observer.next(publisherLayerModel);
            observer.complete();
          },
          error => {
            observer.error(error);
            observer.complete();
          }
        );
    });

  }

  /**
   * Mapea las features leídas del archivo a las features del tipo PublisherFeatureModel
   * necesarias para publicar
   *
   * @private
   * @param {ol.Feature[]} filefeatures
   * @returns {PublisherFeatureModel[]}
   *
   * @memberOf LayersFilePublisherComponent
   */
  private mapFileFeatures(filefeatures: ol.Feature[]): PublisherFeatureModel[] {

    const features = [];

    filefeatures.forEach(fileFeature => {
      const newFeature = new PublisherFeatureModel();
      newFeature.geometry = new ol.format.GeoJSON().writeGeometry(fileFeature.getGeometry());
      const featureProperties = fileFeature.getProperties();
      for (const prop in featureProperties) {
        if (prop !== 'geometry') newFeature.properties[prop] = featureProperties[prop];
      }
      features.push(newFeature);

    });

    return features;
  }

  /**
   * Obtiene los tipos de las propiedades de las features a partir de la recibida
   *
   * @param {*} property
   * @returns {{ [k: string]: any; }}
   *
   * @memberOf LayersFilePublisherComponent
   */
  private getFeatureTypes(property: any): {
    [k: string]: any;
  } {

    const types: {
      [k: string]: any;
    } = {};
    // tslint:disable-next-line:forin
    for (const prop in property) {
      types[prop] = this.getPropertyType(property[prop]);
    }
    return types;

  }

  private getPropertyType(property: any): string {
    switch (typeof property) {

      case 'string':
        if (Utilities.isSQLDate(property)) return 'date';
        else return typeof property;
        break;

      default:
        return typeof property;
        break;
    }

  }

}
