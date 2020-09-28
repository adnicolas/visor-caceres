
import * as ol from 'openlayers';
import { VsLayer } from './vs-layer';
import { VsLayerOptions } from './vs-layer-options';

/**
 * Clase para construir capas OSM
 *
 * @export
 * @class VsLayerOSM
 * @extends {VsLayer}
 */
export class VsLayerOSM extends VsLayer {

  /**
   * Crea una instancia de VsLayerOSM.
   * @param {VsLayerOptions} options
   * @memberof VsLayerWFS
   */
  constructor(options: VsLayerOptions) {
    super(options);

    this.sourceType = 'OSM';
    // Inicializa la instancia
    this._initOSMVsLayer();
  }

  /**
   * Inicializa la capa OSM a partir de las opciones del objeto
   */
  private _initOSMVsLayer() {
    const layerSource = new ol.source.OSM();

    this.olInstance = new ol.layer.Tile({
      source: layerSource,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
    });

  }
}
