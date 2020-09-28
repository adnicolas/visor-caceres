import { Component, OnInit } from '@angular/core';
import * as JSZip from 'jszip';
import * as ol from 'openlayers';
import { ToastService } from '@theme/services/toast.service';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import * as shp from 'shpjs';

/**
 * Componente para cargar capas locales y anadirlas al mapa
 *
 * @export
 * @class LocalLayerLoaderComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'cot-local-layer-loader',
  templateUrl: './local-layer-loader.component.html',
  styleUrls: ['./local-layer-loader.component.scss']
})
export class LocalLayerLoaderComponent extends ParentComponent implements OnInit {

  constructor(private mapService: VsMapService, private toast: ToastService) {
    super();
    this.accept = environment.file_formats;
    this.centerLayer = true;
    this.localLayerDataProjection = 'EPSG:4326'; // falla con environment.map_view.default_projection
  }
  public file: File;
  public layerName: string;
  public modal: any;
  public accept: string;
  public centerLayer: boolean;
  public chooseLabel: string;
  public uploadLabel: string;
  public cancelLabel: string;
  private localLayerDataProjection: string;

  ngOnInit() {
    this.useLiterals(['LOCAL_LAYER_LOADER.NO_GEOMETRIES', 'LOCAL_LAYER_LOADER.LOAD_ERROR', 'LOCAL_LAYER_LOADER.LAYER_ADDED']);
  }

  /**
   * cargar capa a partir del archivo subido
   *
   * @memberof LocalLayerLoaderComponent
   */
  public loadLayer(): void {
    // Consigo la extensión del fichero
    // tslint:disable-next-line:no-bitwise
    const fileExt = this.file.name.slice((this.file.name.lastIndexOf('.') - 1 >>> 0) + 2);
    const fileReader: FileReader = new FileReader();

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

    fileReader.onloadend = (e) => {
      try {
        let features: ol.Feature[] = [];
        let vsLayer: VsLayer;
        if (fileExt === 'zip') {
          // Por si se trata de un conjunto de shapes, recojo el geojson en un array y junto las features
          const geojsonArray = [].concat(shp.parseZip(fileReader.result));
          for (const geojson of geojsonArray) {
            const localFeatures = new ol.format.GeoJSON().readFeatures(geojson, {
              featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
              dataProjection: this.localLayerDataProjection,
            });
            if (localFeatures) {
              if (geojsonArray.length > 1) {
                vsLayer = this.newVSLayer(localFeatures,
                  this.layerName + '_' + localFeatures[0].getGeometry().getType());
              } else {
                vsLayer = this.newVSLayer(localFeatures, this.layerName);
              }
              this.addLayerToMap(vsLayer);
              features = features.concat(localFeatures);
            }
          }
        } else if (fileExt === 'kmz') {
          const zip = new JSZip(fileReader.result);
          const files = zip.file(/.+/);
          files.forEach((kmzFile) => {
            // tslint:disable-next-line:no-bitwise
            if (kmzFile.name.slice((kmzFile.name.lastIndexOf('.') - 1 >>> 0) + 2) === 'kml') {
              features = [...this.loadKML(kmzFile.asText(), this.layerName + '-' + kmzFile.name.replace(/\.[^/.]+$/, ''))];
            }
          });
        } else if (fileExt === 'gml' || fileExt === 'xml') {
          features = new ol.format.GML().readFeatures(fileReader.result, {
            featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
            dataProjection: this.localLayerDataProjection,
          });
          if (features.length) {
            vsLayer = this.newVSLayer(features, this.layerName);
            this.addLayerToMap(vsLayer);
          }
        } else if (fileExt === 'kml') {
          features = this.loadKML(fileReader.result, this.layerName);
        } else if (fileExt === 'json' || fileExt === 'geojson') {
          features = new ol.format.GeoJSON({
            featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
            defaultDataProjection: this.localLayerDataProjection,
          }).readFeatures(fileReader.result);
          if (features.length) {
            vsLayer = this.newVSLayer(features, this.layerName);
            this.addLayerToMap(vsLayer);
          }
        } else if (fileExt === 'gpx') {
          features = new ol.format.GPX().readFeatures(fileReader.result, {
            featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
            dataProjection: null,
          });
          if (features.length) {
            vsLayer = this.newVSLayer(features, this.layerName);
            this.addLayerToMap(vsLayer);
          }
        } else {
          this.toast.showError({
            summary: 'Error',
            detail: this.componentLiterals['LOCAL_LAYER_LOADER.LOAD_ERROR']
          }
          );
          // this.loader.closeLoading();
          return;
        }
        if (!features.length) {
          this.toast.showWarning({
            summary: 'Error',
            detail: this.componentLiterals['LOCAL_LAYER_LOADER.NO_GEOMETRIES']
          });
        } else {
          // Si queremos que el mapa se centre sobre la nueva capa/s añadida/s
          if (this.centerLayer) {
            const extent = new ol.source.Vector({ features }).getExtent();
            this.mapService.getActiveMap().getView().fit(extent, { duration: 500 });
          }
        }
        // this.loader.closeLoading();
      } catch (error) {
        this.toast.showWarning({
          summary: 'Error',
          detail: this.componentLiterals['LOCAL_LAYER_LOADER.LOAD_ERROR']
        });
        // this.loader.closeLoading();
      }
    };
  }


  /**
   * metodo que inicializa y retorna una capa vector
   *
   * @private
   * @param {ol.Feature[]} features
   * @param {string} name
   * @returns
   * @memberof LocalLayerLoaderComponent
   */
  private newVSLayer(features: ol.Feature[], name: string) {
    const source = new ol.source.Vector({ features });
    const newVsLayer = new VsLayerVector({
      name,
      title: name,
      projection: this.mapService.getActiveMap().getView().getProjection().getCode(),
      opt_options: {
        extent: source.getExtent(),
      },
    });
    newVsLayer.olInstance.setSource(source);
    return newVsLayer;
  }


  /**
   * agregar capa al mapa
   *
   * @private
   * @param {VsLayer} vsLayer
   * @memberof LocalLayerLoaderComponent
   */
  private addLayerToMap(vsLayer: VsLayer) {
    try {
      this.mapService.addVsLayer(vsLayer);
      this.toast.showSuccess({
        summary: 'Capa añadida',
        detail: this.componentLiterals['LOCAL_LAYER_LOADER.LAYER_ADDED']
      });
    } catch {
      this.toast.showWarning({
        summary: 'Error',
        detail: this.componentLiterals['LOCAL_LAYER_LOADER.LOAD_ERROR']
      });
    }
  }


  /**
   * metodo que se ejecuta cuando el usuario cambia su seleccion de archivo
   *
   * @param {File} file
   * @memberof LocalLayerLoaderComponent
   */
  public changeFile(file: File): void { // tslint:disable-line
    this.file = file;
    if (file) {
      if (file.size > environment.file_sizes.zip_max_size) {
        this.toast.showWarning({
          summary: 'Error',
          detail: this.componentLiterals['LOCAL_LAYER_LOADER.LIMIT_REACHED'] +
            Math.round(environment.file_sizes.zip_max_size / 1048576) + ' MB'
        }
        );
        this.file = null;
      } else {
        // Elimino la extensión y la pongo como nombre de capa
        this.layerName = file.name.replace(/\.[^/.]+$/, '');
      }
    } else {
      this.layerName = '';
    }
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
  private loadKML(kml: any, fileName: string) {
    const features = new ol.format.KML({
      extractStyles: true,
    }).readFeatures(kml, {
      featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
      dataProjection: this.localLayerDataProjection,
    });
    if (features.length) {
      const vsLayer = this.newVSLayer(features, fileName);
      this.addLayerToMap(vsLayer);
    }
    return features;
  }

}
