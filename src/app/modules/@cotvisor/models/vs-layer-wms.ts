
import * as ol from 'openlayers';
import { Observable, Subject } from 'rxjs';
import { VsLayerStyle } from './vs-layer-style';
import { VsAttributionType } from './format/shared/vs-attribution-type';
import { VsLayer } from './vs-layer';
import { VsMetadata } from './vs-metadata';
import { VsLayerService } from './vs-layer-service';
import { VsLayerWMSOptions } from './vs-layer-wms-options';
import { VsLayerOptions } from './vs-layer-options';
import { environment } from 'src/environments/environment';


/**
 * Clase para construir capas de servicios WMS
 *
 * @export
 * @class VsLayerWMS
 * @extends {VsLayer}
 */
export class VsLayerWMS extends VsLayer {

  // Estilo de capa activo
  public activeStyle: VsLayerStyle;
  // Formato de capa activo
  public activeFormat: string = 'image/png';
  // Idioma de capa activo
  public activeLanguage: string;
  // Atribuciones
  public attributions: VsAttributionType;
  // Metadatos de la capa
  public metadatas: VsMetadata[];
  // service
  public service: VsLayerService;
  // Estilos disponibles para la capa WMS
  public availableStyles: VsLayerStyle[];
  // Si se carga como tileada
  public tiled: boolean;
  // formatos dispobibles
  public availableFormats: string[];
  // idiomass dispobibles
  public availableLanguages: string[];
  public version = '1.3.0';
  public minScaleDenominator: number;
  public maxScaleDenominator: number;
  public activeStyle$: Observable<VsLayerStyle>;
  public activeFormat$: Observable<string>;
  public activeLanguage$: Observable<string>;
  private _observableActiveStyleSource = new Subject<VsLayerStyle>();
  private _observableActiveFormatSource = new Subject<string>();
  private _observableActiveLanguageSource = new Subject<string>();
  public crossOrigin: string;

  /**
   * Crea una instancia de VsLayerWMS.
   * @param {VsLayerWMSOptions} options
   * @memberof VsLayerWMS
   */
  constructor(options: VsLayerWMSOptions) {
    super(options as VsLayerOptions);
    this.sourceType = 'WMS';
    this.availableStyles = [];
    this.availableFormats = [];
    this.availableLanguages = [];
    this.metadatas = [];
    this.attributions = new VsAttributionType();
    this.service = options.service;

    // Recoge los parámetros opcionales propios de una capa WMS
    if (options.hasOwnProperty('opt_options')) {
      // Consigue los idiomas
      if (options.opt_options.hasOwnProperty('languages') && options.opt_options.languages) {
        this.availableLanguages = options.opt_options.languages;
        this.activeLanguage = this.availableLanguages[0];
      }
      if (options.opt_options.hasOwnProperty('selectedLanguage') && this.availableLanguages.length) {
        if (options.opt_options.selectedLanguage) {
          this.setActiveLanguageByName(options.opt_options.selectedLanguage);
        }
      }
      // Consigue los formatos
      if (options.opt_options.hasOwnProperty('formats') && options.opt_options.formats) {
        this.availableFormats = options.opt_options.formats;
        if (!this.activeFormat.includes('image/png')) {
          this.activeFormat = this.availableFormats[0];
        }
      }
      if (options.opt_options.hasOwnProperty('selectedFormat') && this.availableFormats.length) {
        if (options.opt_options.selectedFormat) {
          this.setActiveFormatByName(options.opt_options.selectedFormat);
        }
      }
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
      if (options.opt_options.hasOwnProperty('minScaleDenominator') && options.opt_options.minScaleDenominator) {
        this.minScaleDenominator = options.opt_options.minScaleDenominator;
      }
      if (options.opt_options.hasOwnProperty('maxScaleDenominator') && options.opt_options.maxScaleDenominator) {
        this.maxScaleDenominator = options.opt_options.maxScaleDenominator;
      }
      if (options.opt_options.hasOwnProperty('crossOrigin') && options.opt_options.crossOrigin) {
        this.crossOrigin = options.opt_options.crossOrigin;
      }
      // Consigue el atributo tiled
      this.tiled = options.opt_options.hasOwnProperty('tiled') ? options.opt_options.tiled : environment.tiled_default;
      // Consigue las atribuciones de la capa
      this.attributions = options.opt_options.hasOwnProperty('attributions') ?
        options.opt_options.attributions : new VsAttributionType();
      // Consigue los metadatos de la capa
      this.metadatas = options.opt_options.hasOwnProperty('metadatas') ? options.opt_options.metadatas : [];
    }

    this.activeStyle$ = this._observableActiveStyleSource.asObservable();
    this.activeFormat$ = this._observableActiveFormatSource.asObservable();
    this.activeLanguage$ = this._observableActiveLanguageSource.asObservable();

    if (!(this.olInstance instanceof ol.layer.Image || this.olInstance instanceof ol.layer.Tile)) {
      // Inicializa la instancia
      this._initWMSVsLayer();
    }
    // this.setOpacity(options.hasOwnProperty('opacity') ? options.opacity : 100);
    // this.setVisible(options.hasOwnProperty('visible') ? options.visible : true);

  }

  /**
   * Inicializa la capa WMS a partir de las opciones del objeto
   */
  private _initWMSVsLayer() {

    for (const NO_TILED_SERVERS_DOMAINS of environment.no_tiled_servers_domains) {
      if (this.service.url.indexOf(NO_TILED_SERVERS_DOMAINS) > 0) {
        this.tiled = false;
        break;
      }
    }

    if (!this.tiled) {
      this.createImageLayer();
    } else {
      this.createTileLayer();
    }
  }

  public getAvailableStyles() {
    return this.availableStyles;
  }
  public getActiveStyle() {
    return this.activeStyle;
  }

  public getAvailableFormats() {
    return this.availableFormats;
  }
  public getActiveFormat() {
    return this.activeFormat;
  }

  public getAvailableLanguages() {
    return this.availableLanguages;
  }
  public getActiveLanguage() {
    return this.activeLanguage;
  }
  public setMinResolution(resolution: number) {
    this.olInstance.setMinResolution(resolution);
  }

  public setMaxResolution(resolution: number) {
    this.olInstance.setMaxResolution(resolution);
  }
  public getLegend(): string {
    if (this.availableStyles.length > 0) {
      if (this.activeStyle.hasOwnProperty('legendURL') && this.activeStyle.legendURL.length) {
        return this.activeStyle.legendURL[0].onlineResource;
      }
      return '';
    } else {
      return '';
    }
  }

  public loadMetadata(): void {
    // window.open(this.metadataLink, '_blank');
  }

  /**
   *  Establece el array de estilos disponibles
   *
   * @param {VsLayerStyle[]} availableStyles
   * @memberof VsLayerWMS
   */
  public setAvailableStyles(availableStyles: VsLayerStyle[]) {
    this.availableStyles = availableStyles;
    if (availableStyles.length > 0) {
      this.activeStyle = this.availableStyles[0];
    } else { this.activeStyle = null; }
  }

  /**
   * Establece el estilo activo en la capa a partir del nombre
   */
  public setActiveFormatByName(name: string) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.availableFormats.length; i++) {
      if (this.availableFormats[i] === name) {
        this.activeFormat = this.availableFormats[i];
      }
    }
  }

  /**
   * Establece el idioma activo en la capa a partir del nombre
   */
  public setActiveLanguageByName(name: string) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.availableLanguages.length; i++) {
      if (this.availableLanguages[i] === name) {
        this.activeLanguage = this.availableLanguages[i];
      }
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
    if (activeStyle) {
      this.activeStyle = activeStyle;
      this._setStyleToOlLayer(activeStyle);
      this._observableActiveStyleSource.next(activeStyle);
    }
  }
  /**
   * Establece el formato en el capa de OL
   */
  public setFormat(activeFormat) {
    if (activeFormat) {
      this.activeFormat = activeFormat;
      this._setFormatToOlLayer(activeFormat);
      this._observableActiveFormatSource.next(activeFormat);
    }
  }

  /**
   * Establece el idioma en el capa de OL
   */
  public setLanguage(activeLanguage) {
    if (activeLanguage) {
      this.activeLanguage = activeLanguage;
      this._setLanguageToOlLayer(activeLanguage);
      this._observableActiveLanguageSource.next(activeLanguage);
    }
  }

  /**
   * Convierte la capa actual en una tileada solo si no es ya tileada
   *
   * @memberof VsLayerWMS
   */
  public changeToTiled() {
    this.tiled = true;
    this.createTileLayer();
    this.setZIndex(this.zIndex);
  }

  /**
   * Convierte la capa actual en una de imagen solo si está tileada
   *
   * @memberof VsLayerWMS
   */
  public changeToUntiled() {
    this.tiled = false;
    this.createImageLayer();
    this.setZIndex(this.zIndex);
  }

  /**
   * Establece el estilo en el capa de OL
   * @return {[type]} [description]
   */
  private _setStyleToOlLayer(style: VsLayerStyle) {
    this.olInstance.getSource().updateParams({ STYLES: style.name });
  }

  /**
   * Establece el formato en el capa de OL
   * @return {[type]} [description]
   */
  private _setFormatToOlLayer(format) {
    this.olInstance.getSource().updateParams({ FORMAT: format });
  }

  /**
   * Establece el idioma en el capa de OL
   * @return {[type]} [description]
   */
  private _setLanguageToOlLayer(language) {
    this.olInstance.getSource().updateParams({ LANGUAGE: language });
    // update layer title
  }

  /**
   * Crea una imagen de tipo teselado
   *
   * @private
   * @memberof VsLayerWMS
   */
  private createTileLayer() {
    const layerSource = new ol.source.TileWMS(({
      url: this.service.url,
      // parámetro para impedir errores CORS al convertir el mapa en Data para imprimir
      // si no se envía, provoca error en la carga de teselas desde OL
      crossOrigin: this.crossOrigin,
      params: {
        LAYERS: this.name,
        TILED: this.tiled,
        SRS: this.projection,
        VERSION: this.version,
        CONTINUOUSWORLD: true,
        STYLES: this.activeStyle ? this.activeStyle.name : '',
        FORMAT: this.activeFormat,
        LANGUAGE: this.activeLanguage ? this.activeLanguage : '',
      },
      projection: this.projection,
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

    // definimos la instancia de la capa OL a cargar a partir del objeto source
    this.olInstance = new ol.layer.Tile({
      source: layerSource,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
    });
  }

  /**
   * Crea una capa de tipo imagen, sin teselas
   *
   * @private
   * @memberof VsLayerWMS
   */
  private createImageLayer() {
    const layerSource = new ol.source.ImageWMS({
      crossOrigin: this.crossOrigin,
      url: this.service.url,
      params: {
        LAYERS: this.name,
        TILED: this.tiled,
        SRS: this.projection,
        VERSION: this.version,
        CONTINUOUSWORLD: true,
        STYLES: this.activeStyle ? this.activeStyle.name : '',
        FORMAT: this.activeFormat,
        LANGUAGE: this.activeLanguage ? this.activeLanguage : '',
      },
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
