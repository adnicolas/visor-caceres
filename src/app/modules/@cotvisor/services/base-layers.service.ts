import { Injectable } from '@angular/core';
import { ParentService } from './parent.service';
import { environment } from 'src/environments/environment';
import { WmsReaderService } from './wms-reader.service';
import { VsBaseLayerOptions } from '@cotvisor/models/vs-base-layer-options';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsLayerService } from '@cotvisor/models/vs-layer-service';
import { VsLayerOSM } from '@cotvisor/models/vs-layer-osm';
import { VsLayerTileImage } from '@cotvisor/models/vs-layer-tile-image';
import { WmtsReaderService } from './wmts-reader.service';

/**
 * Servicio que devuelve las capas base .
 * Obtiene el json con las opciones para crear las capas base del endpoint configurado
 */
@Injectable({
  providedIn: 'root'
})
export class BaseLayersService extends ParentService {

  private baseLayersConfig: Array<VsBaseLayerOptions>;
  constructor(
    private wmtsReaderService: WmtsReaderService,
    private wmsReaderService: WmsReaderService,
    // private toastService: ToastService,
  ) {
    super();
    this.baseLayersConfig = environment.base_layers;
  }

  public getBaseLayers(): Promise<VsLayer[]> {
    return new Promise((resolve, reject) => {
      let baseLayers: VsLayer[] = [];
      const promises: Array<Promise<VsLayer>> = [];
      for (const baseLayerConfig of this.baseLayersConfig) {
        promises.push(this.createBaseLayer(baseLayerConfig));
      }
      Promise.all(promises).then((values) => {
        baseLayers = values;
        resolve(baseLayers);
      });

    });
  }
  private createBaseLayer(baseLayerOptions: VsBaseLayerOptions): Promise<VsLayer> {

    // Recojo la configuración opcional
    let url = '';
    let layer = '';
    let crossOrigin = '';

    let projection = environment.map_view.default_projection;
    let service: VsLayerService;
    if (baseLayerOptions.options) {
      url = baseLayerOptions.options.url || '';
      layer = baseLayerOptions.options.layer || '';
      projection = baseLayerOptions.options.projection || environment.map_view.default_projection;
      crossOrigin = baseLayerOptions.options.crossOrigin || null; // por ahora esta opción solo es recogida por las VsLayerTileImage
    }
    if (url) {
      service = { url, title: '', description: '', type: baseLayerOptions.type };
    }
    switch (baseLayerOptions.type) {
      case 'osm': {
        return new Promise<VsLayer>((resolve, reject) => {
          resolve(new VsLayerOSM({
            name: baseLayerOptions.title,
            projection,
            title: baseLayerOptions.title,
            id: baseLayerOptions.id,
            opt_options: {
              isBaseLayer: true,
              visible: baseLayerOptions.active,
              img: baseLayerOptions.imgUrl,
            },
          }));
        });
      }
      case 'tileImage': {
        return new Promise<VsLayer>((resolve, reject) => {
          resolve(new VsLayerTileImage({
            name: baseLayerOptions.title,
            projection,
            title: baseLayerOptions.title,
            service,
            id: baseLayerOptions.id,
            opt_options: {
              isBaseLayer: true,
              visible: baseLayerOptions.active,
              img: baseLayerOptions.imgUrl,
              crossOrigin
            },
          }));
        });
      }
      case 'wms': {
        return new Promise<VsLayer>((resolve, reject) => {
          this.wmsReaderService.getWMSCapabilitiesAsync(url).then(
            (capabilities) => {
              const vsLayerWMS = this.wmsReaderService.getWMSLayerFromCapabilities(capabilities, url, layer);
              vsLayerWMS.id = baseLayerOptions.id;
              vsLayerWMS.isBaseLayer = true;
              vsLayerWMS.img = baseLayerOptions.imgUrl,
                vsLayerWMS.setVisible(baseLayerOptions.active);
              resolve(vsLayerWMS);
            },
            (err) => {
              reject(err);
              throw Error('base-layer.service: ' + err.message);
            },
          )
            .catch((err) => {
              reject(err);
              throw Error('base-layer.service: ' + err.message);
            });
        });
      }
      case 'wmts': {
        return new Promise<VsLayer>((resolve, reject) => {
          this.wmtsReaderService.getWMTSCapabilitiesAsync(url).then((capabilities) => {
            const vsLayerWMTS = this.wmtsReaderService.getWMTSLayersFromCapabilities(capabilities, url, [layer])[0];
            vsLayerWMTS.id = baseLayerOptions.id;
            vsLayerWMTS.isBaseLayer = true;
            vsLayerWMTS.img = baseLayerOptions.imgUrl,
              vsLayerWMTS.setVisible(baseLayerOptions.active);
            resolve(vsLayerWMTS);
          },
            (err) => {
              reject(err);
              throw Error('base-layer.service: ' + err.message);
            },
          )
            .catch((err) => {
              reject(err);
              throw Error('base-layer.service: ' + err.message);
            });
        });
      }
      default: {
        return null;
        // No se puede cargar la capa porque no está registrado el tipo
      }
    }
  }

}
