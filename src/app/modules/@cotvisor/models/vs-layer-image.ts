
import * as ol from 'openlayers';
import { VsLayer } from './vs-layer';
import { VsLayerOptions } from './vs-layer-options';



/**
 * Clase para construir capas de tipo imagen estática
 *
 * @author Centro de Observación y Teledetección Espacial, S.L.U.
 * @export
 * @class VsLayerImage
 * @extends {VsLayer}
 */
export class VsLayerImage extends VsLayer {


  // Sobreescribe el tipo del padre
  public olInstance: ol.layer.Image;


  /**
   * Crea una instancia de VsLayerImage.
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {VsLayerOptions} options
   * @memberof VsLayerImage
   */
  constructor(options: VsLayerOptions) {
    super(options as VsLayerOptions);
    this.sourceType = 'Image';

    if (!this.olInstance) {
      // Inicializa la instancia
      this.initImageVsLayer();
    }
  }

  /**
   * Inicializa la capa WMS a partir de las opciones del objeto
   */
  private initImageVsLayer() {
    const layerSource = new ol.source.ImageStatic({
      url: this.img,
      imageExtent: this.extent,
      projection: this.projection,
    });

    layerSource.on('imageloadstart', () => {
      this.addLoading();
    });

    layerSource.on('imageloadend', () => {
      this.addLoaded();
    });
    layerSource.on('imageloaderror', () => {
      this.addLoadedError();
    });

    this.olInstance = new ol.layer.Image({
      source: layerSource,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
    });

  }

}
