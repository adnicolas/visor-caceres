
import * as ol from 'openlayers';
import { VsLayer } from './vs-layer';
import { VsLayerService } from './vs-layer-service';
import { VsLayerTileImageOptions } from './vs-layer-tile-image-options';
import { VsLayerOptions } from './vs-layer-options';

/**
 * Clase para construir capas de servicios TileImage
 *
 * @export
 * @class VsLayerTileImage
 * @extends {VsLayer}
 */
export class VsLayerTileImage extends VsLayer {

  public service: VsLayerService;
  private crossOrigin: string;

  /**
   * Crea una instancia de VsLayerTileImage.
   * @param {VsLayerTileImageOptions} options
   * @memberof VsLayerWFS
   */
  constructor(options: VsLayerTileImageOptions) {
    super(options as VsLayerOptions);

    this.sourceType = 'TileImage';
    this.service = options.service;
    this.crossOrigin = options.opt_options.crossOrigin ? options.opt_options.crossOrigin : '';
    // Inicializa la instancia
    this._initTileImageVsLayer();
  }

  /**
   * Inicializa la capa TileImage a partir de las opciones del objeto
   */
  private _initTileImageVsLayer() {


    const layerOptions = {
      url: this.service.url,
      projection: this.projection,
      crossOrigin: null
    };
    if (this.crossOrigin) layerOptions.crossOrigin = this.crossOrigin;

    const layerSource = new ol.source.TileImage(layerOptions);

    this.olInstance = new ol.layer.Tile({
      source: layerSource,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
    });

  }
}
