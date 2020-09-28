import * as ol from 'openlayers';
import { VsLayer } from './vs-layer';
import { VsLayerOptions } from './vs-layer-options';
import { VsLayerVectorOptions } from './vs-layer-vector-options';
import { environment } from 'src/environments/environment';

export class VsLayerVector extends VsLayer {
  // Estilo de la capa vectorial
  public style: ol.style.Style | ol.StyleFunction;


  // Sobreescribe el tipo del padre
  public olInstance: ol.layer.Vector;

  constructor(options: VsLayerVectorOptions) {
    super(options as VsLayerOptions);
    this.sourceType = 'Vector';
    if (options.hasOwnProperty('opt_options')) {
      // Consigue los metadatos de la capa
      this.style = options.opt_options.style;
    }
    if (!(this.olInstance instanceof ol.layer.Vector)) {
      this._initNewVectorVsLayer();
    }

  }


  private _initNewVectorVsLayer() {

    const style = this._initVectorStyles();
    this.olInstance = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
    });

  }

  protected _initVectorStyles() {
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: environment.colors.secondary + environment.colors.transparency.high,
      }),
      stroke: new ol.style.Stroke({
        color: environment.colors.primary,
        width: 3,
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: environment.colors.primary,
        }),
      }),
    });
  }

}
