import * as shp from 'shpjs';
import * as JSZip from 'jszip';
import * as ol from 'openlayers';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { ErrorVisor } from '@cotvisor/classes/error-visor.class';
import { Subscriber } from 'rxjs';

export class FileGeomData {
  features: any[];
  src: string;
  type: string;

}

export class FileGeomReader {

  private file: File;
  private accept = environment.file_formats;
  private localLayerDataProjectionCode = '4326';
  private featureProyection: string;


  constructor(file: File) {
    this.file = file;
  }



  public read(): Observable<FileGeomData> {

    return new Observable(
      (observer: Subscriber<FileGeomData>) => {


        const fileReader: FileReader = new FileReader();

        // tslint:disable-next-line:no-bitwise
        const fileExt = this.file.name.slice((this.file.name.lastIndexOf('.') - 1 >>> 0) + 2);

        if (!this.accept.includes(fileExt)) observer.error('LOCAL_LAYER_LOADER.FORMAT_ERROR');

        if (fileExt === 'zip' || fileExt === 'kmz') {
          fileReader.readAsArrayBuffer(this.file);
        } else if (fileExt === 'gml' ||
          fileExt === 'xml' ||
          fileExt === 'gpx' ||
          fileExt === 'kml' ||
          fileExt === 'json' ||
          fileExt === 'geojson') {
          fileReader.readAsText(this.file);
        }

        // TODO validar usor de featureProyection
        fileReader.onloadend = (e) => {

          try {
            let features: ol.Feature[] = [];
            let fileGeomData = new FileGeomData();
            fileGeomData.type = fileExt;
            switch (fileExt) {
              case 'zip':
                // Por si se trata de un conjunto de shapes, recojo el geojson en un array y junto las features
                const geojsonArray = [].concat(shp.parseZip(fileReader.result));
                // las capas leídas a traves de shp.parseZip llegan todas en EPSG:4326
                const shpLibraryDefaultsrc = '4326';

                for (const geojson of geojsonArray) {
                  const localFeatures = new ol.format.GeoJSON().readFeatures(geojson, {
                    featureProjection: shpLibraryDefaultsrc,
                    dataProjection: shpLibraryDefaultsrc,
                  });
                  if (localFeatures) {
                    features = features.concat(localFeatures);
                  }
                }

                fileGeomData.features = features;
                fileGeomData.src = shpLibraryDefaultsrc;
                observer.next(fileGeomData);
                break;
              case 'kmz':
                const zip = new JSZip(fileReader.result);
                const files = zip.file(/.+/);
                files.forEach((kmzFile) => {
                  // tslint:disable-next-line:no-bitwise
                  if (kmzFile.name.slice((kmzFile.name.lastIndexOf('.') - 1 >>> 0) + 2) === 'kml') {
                    features = [...this.readKML(kmzFile.asText())];
                  }
                });

                fileGeomData.features = features;
                fileGeomData.src = this.featureProyection;
                observer.next(fileGeomData);
                break;
              case 'gml' || 'xml':
                features = new ol.format.GML().readFeatures(fileReader.result, {
                  featureProjection: this.featureProyection,
                  dataProjection: this.localLayerDataProjectionCode,
                });

                fileGeomData.features = features;
                fileGeomData.src = this.featureProyection;
                observer.next(fileGeomData);
                break;
              case 'kml':
                features = this.readKML(fileReader.result);
                fileGeomData.features = features;
                fileGeomData.src = this.featureProyection;
                observer.next(fileGeomData);
                break;
              case 'json' || 'geojson':
                features = new ol.format.GeoJSON({
                  featureProjection: this.featureProyection,
                  defaultDataProjection: this.localLayerDataProjectionCode,
                }).readFeatures(fileReader.result);
                fileGeomData.features = features;
                fileGeomData.src = this.featureProyection;
                observer.next(fileGeomData);
                break;
              case 'gpx':

                features = new ol.format.GPX().readFeatures(fileReader.result, {
                  featureProjection: this.featureProyection,
                  dataProjection: null,
                });
                fileGeomData.features = features;
                fileGeomData.src = this.featureProyection;
                observer.next(fileGeomData);
                break;
              default:
                fileGeomData = null;
                observer.error('LOCAL_LAYER_LOADER.LOAD_ERROR');
            }
          } catch (error) {
            throw new ErrorVisor('FileGeomReader', 'LOCAL_LAYER_LOADER.LOAD_ERROR');

          }
        };
      }
    );
  }



  /**
   * metodo que genera una capa KML
   *
   * @private
   * @param {*} kml
   * @param {string} fileName
   * @returns
   * @memberof LocalLayerLoaderComponent
   */
  private readKML(kml: any) {
    const features = new ol.format.KML({
      extractStyles: true,
    }).readFeatures(kml, {
      featureProjection: this.featureProyection,
      dataProjection: this.localLayerDataProjectionCode,
    });
    return features;
  }
}
