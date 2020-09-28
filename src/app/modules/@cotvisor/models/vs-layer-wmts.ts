import * as ol from 'openlayers';
import { VsLayer } from './vs-layer';
import { VsLayerService } from './vs-layer-service';
import { VsLayerStyle } from './vs-layer-style';
import { VsLayerWMTSOptions } from './vs-layer-wmts-options';
import { VsLayerOptions } from './vs-layer-options';

export class VsLayerWMTS extends VsLayer {

  // service
  public service: VsLayerService;

  public matrixSet: string;
  public format: string;
  public requestEncoding: string;
  public tileGrid: ol.tilegrid.WMTS;
  public dimensions: any;
  public crossOrigin: string;
  // Estilo de capa activo
  public activeStyle: VsLayerStyle;
  // Estilos disponibles para la capa WMS
  public availableStyles: VsLayerStyle[];
  // format de capa activo
  public availableFormats: string[];

  public version = '1.0.0';

  constructor(options: VsLayerWMTSOptions) {
    super(options as VsLayerOptions);
    this.sourceType = 'WMTS';
    this.service = options.service;
    // Recoge los parámetros opcionales propios de una capa WMS
    if (options.hasOwnProperty('opt_options')) {
      // Consigue los estilos y asocia el primero como activo por defecto
      if (options.opt_options.hasOwnProperty('styles') && options.opt_options.styles.length > 0) {
        this.availableStyles = options.opt_options.styles;
        this.activeStyle = this.availableStyles[0];
      }
      if (options.opt_options.hasOwnProperty('selectedStyle') && this.availableStyles.length) {
        if (options.opt_options.selectedStyle) {
          this.setActiveStyleByName(options.opt_options.selectedStyle);
        }
      }
      if (options.opt_options.hasOwnProperty('crossOrigin')) {
        if (options.opt_options.crossOrigin) {
          this.crossOrigin = options.opt_options.crossOrigin;
        }
      }
      this.format = options.opt_options.format || 'image/png';
      this.matrixSet = options.opt_options.matrixSet;
      this.requestEncoding = options.opt_options.requestEncoding;
      this.tileGrid = options.opt_options.tileGrid;
      this.dimensions = options.opt_options.dimensions;
    }
    if (!(this.olInstance instanceof ol.layer.Tile)) {
      // Inicializa la instancia
      this._initNewWMTSVsLayer();
    }
  }

  /**
   * Establece el estilo activo en la capa a partir del nombre
   */
  public setActiveStyleByName(name: string) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.availableStyles.length; i++) {
      if (this.availableStyles[i].name === name) {
        this.activeStyle = this.availableStyles[i];
      }
    }
  }

  /**
   * Establece el estilo en el capa de OL
   */
  public setStyle(activeStyle: VsLayerStyle) {
    this.activeStyle = activeStyle;
    this._setStyleToOlLayer(activeStyle);
  }

  private _initNewWMTSVsLayer() {

    const layerSource = new ol.source.WMTS(({
      url: this.service.url,
      matrixSet: this.matrixSet,
      format: this.format,
      layer: this.name,
      tileGrid: this.tileGrid,
      projection: this.projection,
      style: this.activeStyle ? this.activeStyle.name : 'default',
      wrapX: false,
      crossOrigin: this.crossOrigin
    }));

    layerSource.on('tileloadstart', () => {
      this.addLoading();
    });

    layerSource.on('tileloadend', () => {
      this.addLoaded();
    });
    layerSource.on('tileloaderror', () => {
      this.addLoadedError();
    });

    const tileGrid = layerSource.getTileGrid();

    this.olInstance = new ol.layer.Tile({
      source: layerSource,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
      minResolution: tileGrid.getResolution(tileGrid.getMaxZoom()),
      maxResolution: tileGrid.getResolution(tileGrid.getMinZoom()),
    });

  }

  /**
   * Establece el estilo en el capa de OL
   * @return {[type]} [description]
   */
  private _setStyleToOlLayer(style: VsLayerStyle) {
    const layerSource = new ol.source.WMTS(({
      url: this.service.url,
      matrixSet: this.matrixSet,
      format: this.format,
      layer: this.name,
      tileGrid: this.tileGrid,
      projection: this.projection,
      style: style.name,
      wrapX: false,
    }));
    this.olInstance.setSource(layerSource);
  }

}
