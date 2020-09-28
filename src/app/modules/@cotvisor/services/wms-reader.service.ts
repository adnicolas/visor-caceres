/*
servicio que recibe una url de un servidor WMS en el constructor y guarda las capas disponibles.
Uso de https://stackoverflow.com/questions/42838285/angular2-convert-xml-to-json
*/
import { Injectable } from '@angular/core';
import * as ol from 'openlayers';
import * as xml2js from 'xml2js';

import { ParentService } from './parent.service';
import { HttpProxyService } from './http-proxy.service';
import { environment } from 'src/environments/environment';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsMetadata } from '@cotvisor/models/vs-metadata';
import { VsLayerStyle } from '@cotvisor/models/vs-layer-style';
import { VsLayerStyleLegend } from '@cotvisor/models/vs-layer-style-legend';
import { VsAttributionType } from '@cotvisor/models/format/shared/vs-attribution-type';

/**
 * Servicio de obtención de datos de servidores WMS
 *
 * @return {[type]} [description]
 */
@Injectable({
  providedIn: 'root'
})
export class WmsReaderService extends ParentService {
  private _capabilitiesLoaded: boolean;
  private _DEFAULT_VERSION = '1.3.0';
  constructor(private httpProxy: HttpProxyService) {
    super();
  }

  /**
   *  Método que realiza una petición GetCapabilities y obtiene todas las caracteristicas de un servidor WMS
   * @param {string} wmsUrl URL del servidor
   * @return {Promise<object>} Promesa que se resolverá con los datos devueltos del servidor
   */
  public getWMSCapabilitiesAsync(wmsUrl: string, version?: string): Promise<object> {
    if (!version) { version = this._DEFAULT_VERSION; }
    const option = wmsUrl.indexOf('?') > -1 ? wmsUrl.split('?')[1] ? '&' : '' : '?';
    const wmsUrlGetCapabilities: string = wmsUrl + option + 'request=GetCapabilities&version=' + version + '&service=WMS';
    this._capabilitiesLoaded = false;
    return new Promise((resolve, reject) => {
      this.httpProxy.get(wmsUrlGetCapabilities, {
        responseType: 'text',
      }).toPromise()
        .then((capabilities) => {
          try {
            xml2js.parseString(capabilities, { explicitArray: false, normalizeTags: true, tagNameProcessors: [this._removeXMLTags], attrNameProcessors: [this._attrNameProcessors], ignoreAttrs: false, mergeAttrs: true }, (err, result) => {
              if (!err) {
                const CAPABILITITES = result.wms_capabilities || result.wmt_ms_capabilities;
                if (CAPABILITITES) {
                  this._capabilitiesLoaded = true;
                  resolve(CAPABILITITES);
                } else {
                  reject('No se ha podido cargar el servidor WMS');
                }
              } else {
                reject('No se ha podido cargar el servidor WMS');
              }
            });
          } catch (error) {
            reject(error);
          }
        },
          (error) => {
            reject(error);
          });
    });
  }

  /**
   * [getWMSServicedescription description]
   * @return {[type]} [description]
   */
  public getWMSServiceDescriptionFromCapabilities(capabilities): string {
    if (this._capabilitiesLoaded) {
      return capabilities.service.abstract;
    } else {
      console.error('no se han cargado las features -> getWMSServiceDescriptionFromCapabilities() ');
    }
  }

  /**
   * [getWMSServicedescription description]
   * @return {[type]} [description]
   */
  public getWMSTitleFromCapabilities(capabilities): string {
    if (this._capabilitiesLoaded) {
      return capabilities.service.title;
    } else {
      console.error('no se han cargado las features -> getWMSTitleFromCapabilities() ');
    }
  }

  /**
   * [getAllLayersLoaded description]
   * @return {any[]} [description]
   */
  public getWMSLayersFromCapabilities(capabilities, wmsUrl, filterLayers): VsLayerWMS[] {
    let layersArray: VsLayerWMS[];
    if (this._capabilitiesLoaded) {
      const rootVsLayer = this.getWMSLayersRootTreeFromCapabilities(capabilities, wmsUrl, filterLayers);
      layersArray = this.getRecursiveLayersArray(rootVsLayer);
      return layersArray;
    } else {
      console.error('no se han cargado las features -> getWMSLayersFromCapabilities() ');
    }
  }

  /**
   * [getExpecificLayer description]
   * @return {any[]} [description]
   */
  public getWMSLayerFromCapabilities(capabilities, wmsUrl, layerName): VsLayerWMS {
    if (this._capabilitiesLoaded) {
      const selectedProjection = this._getProjection(capabilities);
      let layer;
      if (typeof selectedProjection !== 'undefined') {
        const capabilitiesLayer = this._getCapabilitiesLayer(capabilities, layerName);
        if (capabilitiesLayer) {
          layer = this.getRecursiveLayersTree(capabilities, wmsUrl, capabilitiesLayer, [], selectedProjection, 0, null);
        }
      } else {
        console.error('El servicio no tiene ningún CRS compatible con la lista de proyecciones disponibles');
      }
      return layer;
    } else {
      console.error('no se han cargado las features -> getWMSLayersFromCapabilities() ');
    }
  }

  /**
   * Recupera el nodo raiz del arbol de capas del WMS
   * @return {VsLayer} retorna la capa raiz de la estructura de capas del servidor WMS
   */
  public getWMSLayersRootTreeFromCapabilities(capabilities, url: string, filterLayers?: string[]): VsLayerWMS {
    if (this._capabilitiesLoaded) {
      const selectedProjection = this._getProjection(capabilities);

      if (typeof selectedProjection !== 'undefined') {
        // si existen capas

        // recuperar capas de forma recursiva
        return this.getRecursiveLayersTree(capabilities,
          url, capabilities.capability.layer, [], selectedProjection, 0, filterLayers);

      } else {
        console.error('El servicio no tiene ningún CRS compatible con la lista de proyecciones disponibles');
      }
    } else {
      console.error('no se han cargado las features -> getWMSLayersFromCapabilities() ');
    }
  }

  /**
   * A partir del nodo raiz retorna un array con las capas de los nodos finales
   * @param {any} layer [description]
   * @param {number} level [description]
   * @return {VsLayer} [description]
   */
  private getRecursiveLayersArray(rootVsLayer: VsLayerWMS): VsLayerWMS[] {
    let layersArray: VsLayerWMS[] = [];
    if (rootVsLayer.subLayers.length) {
      // retornamos el nodo procesado con sus nodos hijos
      for (const subVsLayer of rootVsLayer.subLayers) {
        layersArray = layersArray.concat(this.getRecursiveLayersArray(subVsLayer as VsLayerWMS));
      }
      return layersArray;
    } else {
      // Si no tenemos subcapas, añadimos el nodo al array de capas
      layersArray.push(rootVsLayer);
      return layersArray;
    }
  }

  /**
   * Obtiene de forma recursiva el arbol de capas desde la consulta de GetCapabilities
   * @param {any} layer Capa padre del resultado de Capabilities de la que obtener hijas
   * @return {VsLayer} Devuelve un objeto de la clase VsLayer con las capas hijas cargadas en subVsLayers
   * @param {number} level nivel de profuncdidad
   * @return {VsLayer} [description]
   */
  private getRecursiveLayersTree(capabilities: any, url: string, layerCapabilities: any, nodePath: string[], selectedProjection, level?: number, filterLayers?: string[]): VsLayerWMS {
    if (typeof level === 'undefined') { level = 0; }
    let stylesCapabilities = [];
    const styles = [];
    let formats = [];
    let languages;
    const metadatas = [];
    let extent;
    let img;
    let queryable;
    let attributions;
    let minScaleDenominator = 0;
    let maxScaleDenominator = Infinity;

    if (layerCapabilities.hasOwnProperty('style')) {
      stylesCapabilities = Array.isArray(layerCapabilities.style) ? layerCapabilities.style : [layerCapabilities.style];
    }
    // Se insertan los estilos
    for (const style of stylesCapabilities) {
      styles.push(this._getStyleFromCapabilities(style));
    }
    // Recojo el extent de la capa
    if (layerCapabilities.hasOwnProperty('ex_geographicboundingbox')) {

      const exGeographicboundingbox = Object.keys(layerCapabilities.ex_geographicboundingbox).map(
        (key) => parseFloat(layerCapabilities.ex_geographicboundingbox[key]));

      extent = [exGeographicboundingbox[0], exGeographicboundingbox[2],
      exGeographicboundingbox[1], exGeographicboundingbox[3]];

    } else if (layerCapabilities.hasOwnProperty('latlonboundingbox')) {

      extent = Object.keys(layerCapabilities.latlonboundingbox).map(
        (key) => parseFloat(layerCapabilities.latlonboundingbox[key]));

    }
    if (extent) {
      extent = ol.proj.transformExtent(extent, 'EPSG:4326', selectedProjection);

      // Construyo la url que se usara como imagen de presvisualizacion de la capa
      img = url + (url.indexOf('?') > -1 ? '&' : '?') + 'service=WMS&request=GetMap' +
        '&layers=' + layerCapabilities.name +
        '&bbox=' + extent.join(',') +
        '&width=40&height=40&crs=' + selectedProjection +
        '&srs=' + selectedProjection + '&format=image/png&version=' + this._DEFAULT_VERSION;

    }
    if (layerCapabilities.hasOwnProperty('queryable')) {
      queryable = (layerCapabilities.queryable === '1');
    }

    // Se insertan los metadatos
    if (layerCapabilities.hasOwnProperty('metadataurl')) {
      const metadataArray = [].concat(layerCapabilities.metadataurl);
      for (const metadata of metadataArray) {
        metadatas.push(new VsMetadata(metadata.onlineresource.href, metadata.format, metadata.type));
      }
    }
    // Se insertan las escalas mínimas para version 1.3.0
    if (layerCapabilities.hasOwnProperty('minscaledenominator')) {
      minScaleDenominator = parseFloat(layerCapabilities.minscaledenominator);
    }
    // Se insertan las escalas máximas para version 1.3.0
    if (layerCapabilities.hasOwnProperty('maxscaledenominator')) {
      maxScaleDenominator = parseFloat(layerCapabilities.maxscaledenominator);
    }
    /* // Se insertan las escalas para versión 1.1.1
    if (layerCapabilities.hasOwnProperty("scalehint")) {
      if (layerCapabilities.scalehint.hasOwnProperty("max")) {
        minScaleDenominator = parseFloat(layerCapabilities.scalehint.max);
      }
      if (layerCapabilities.scalehint.hasOwnProperty("min")) {
        minScaleDenominator = parseFloat(layerCapabilities.scalehint.min);
      }
    } */
    // formatos
    formats = this._getlayerFormats(capabilities);
    // idiomas
    languages = this._getLayerLanguages(capabilities);
    // Se consiguen los atributos
    attributions = this._getLayerAttributions(layerCapabilities);

    const vsLayer = new VsLayerWMS(
      {
        // @ts-ignore
        name: layerCapabilities.name, // TODO comprobar
        title: layerCapabilities.title,
        projection: selectedProjection,
        service: {
          url,
          type: 'WMS',
          title: this.getWMSTitleFromCapabilities(capabilities),
          description: this.getWMSServiceDescriptionFromCapabilities(capabilities),
        },
        opt_options: {
          styles,
          metadatas,
          extent,
          img,
          queryable,
          attributions,
          formats,
          languages: languages.languages,
          selectedLanguage: languages.defaultLanguage,
          minScaleDenominator,
          maxScaleDenominator,
          // crossOrigin: 'Anonymous'
        },
      });

    vsLayer.level = level;

    // si hay subcapas llamamos de forma recursiva pasando los nodos de las subcapas
    if (layerCapabilities.hasOwnProperty('layer')) {
      // Procesamos y añadimos las subcapas al nodo de forma recursiva
      if (nodePath.length > 0) { vsLayer.nodePath = vsLayer.nodePath.concat(nodePath); }
      vsLayer.nodePath.push(layerCapabilities.Title);
      const subLayers = Array.isArray(layerCapabilities.layer) ? layerCapabilities.layer : [layerCapabilities.layer];
      // let nodoPadre=topVsLayer.nodePath.slice(0);
      for (const subLayer of subLayers) {
        // Si es una capa padre continuo, sino compruebo que sea una capa dentro de las permitidas
        if (subLayer.hasOwnProperty('layer') || !filterLayers || filterLayers.indexOf(subLayer.name) > -1) {
          const returnedLayer = this.getRecursiveLayersTree(capabilities, url, subLayer, vsLayer.nodePath,
            selectedProjection, level + 1, filterLayers);
          // Compruebo que la capa padre tenga alguna capa, sino significa que el
          // filtro no ha permitido insertar ninguna de sus hijas
          if ((subLayer.hasOwnProperty('layer') && returnedLayer.subLayers.length) ||
            (!subLayer.hasOwnProperty('layer'))) {
            vsLayer.addSubLayer(returnedLayer);
          }
        }
      }
      // retornamos el nodo procesado con sus nodos hijos
      return vsLayer;
    } else {
      // Si no tenemos subcapas, creamos e inicializamos el nodo y lo retornamos
      vsLayer.nodePath = nodePath.slice(0);
      return vsLayer;
    }
  }

  private _getStyleFromCapabilities(styleFromCapabilities: any) {

    const localVsStyle: VsLayerStyle = new VsLayerStyle();
    localVsStyle.name = styleFromCapabilities.name;
    localVsStyle.title = styleFromCapabilities.title;
    localVsStyle.abstract = styleFromCapabilities.abstract;
    if (styleFromCapabilities.legendurl) {
      const legends = [].concat(styleFromCapabilities.legendurl);
      for (const legendFromCapabilitites of legends) {
        const localVsLegend: VsLayerStyleLegend = new VsLayerStyleLegend();
        localVsLegend.format = legendFromCapabilitites.format;
        localVsLegend.onlineResource = legendFromCapabilitites.onlineresource.href;
        localVsLegend.width = legendFromCapabilitites.width;
        localVsLegend.height = legendFromCapabilitites.height;
        localVsStyle.legendURL.push(localVsLegend);
      }
    }
    return localVsStyle;
  }

  /**
   * Devuelve el objeto attribution de la capa desde el capabilities
   * @return {string} [description]
   */
  private _getLayerAttributions(capabilitiesLayer: any): VsAttributionType {
    if (capabilitiesLayer.hasOwnProperty('attribution')) {
      const attribution = new VsAttributionType();
      attribution.logoURL = capabilitiesLayer.attribution.logourl;
      attribution.onlineResource = capabilitiesLayer.attribution.onlineresource ?
        capabilitiesLayer.attribution.onlineresource.href : null;
      attribution.title = capabilitiesLayer.attribution.title;
      return attribution;
    } else { return new VsAttributionType(); }
  }

  private _getlayerFormats(capabilities) {
    const formats = capabilities.capability.request.getmap.format;
    if (formats) {
      if (Array.isArray(formats)) {
        return formats;
      } else {
        return [formats];
      }
    }
  }

  private _getLayerLanguages(capabilities): {
    languages: string[],
    defaultLanguage: string,
  } {
    try {
      const languages = capabilities.capability.vendorspecificcapabilities['inspire_vs:extendedcapabilities']['inspire_common:supportedlanguages'];
      if (languages) {
        const langStrings = [];
        let defaultLanguage = '';
        for (const key in languages) {
          // skip loop if the property is from prototype
          if (!languages.hasOwnProperty(key)) { continue; }

          const obj = languages[key];
          for (const prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) { continue; }
            if (prop === 'inspire_common:defaultlanguage') {
              defaultLanguage = obj[prop];
            }
            langStrings.push(obj['inspire_common:language']);
          }
        }
        return {
          languages: langStrings,
          defaultLanguage,
        };
      }
    } catch (err) {
      return {
        languages: [],
        defaultLanguage: null,
      };
    }
  }

  /**
   *  Recupera las capabilities de la capa con el mismo nombre que el pasado por parámetro
   *
   * @private
   * @param {*} capabilities
   * @param {*} layerName
   * @returns
   * @memberof WmsReaderService
   */
  private _getCapabilitiesLayer(capabilities, layerName) {
    if (capabilities.capability.hasOwnProperty('layer')) {
      return this._getLayerFromLayers(capabilities.capability.layer, layerName);
    }
  }

  /**
   * Recupera la capa con el nombre solicitado o devuelve null
   *
   * @private
   * @param {*} layers
   * @param {*} layerName
   * @memberof WmsReaderService
   */
  private _getLayerFromLayers(layers: any, layerName: string) {
    let layer;
    layers = Array.isArray(layers) ? layers : [layers];
    for (const l of layers) {
      if (l.name === layerName) {
        layer = l;
        break;
      } else if (l.hasOwnProperty('layer')) {
        layer = this._getLayerFromLayers(l.layer, layerName);
      }
    }
    return layer;
  }

  private _getProjection(capabilities): string {
    // Recojo una proyección válida
    if (this._capabilitiesLoaded && capabilities.capability.hasOwnProperty('layer')) {
      const capabilitiesProjections = capabilities.capability.layer.hasOwnProperty('crs') ?
        capabilities.capability.layer.crs : capabilities.capability.layer.srs;
      // Busco que tenga la proyección por defecto para las capas, si no es así busco una válida
      let projection = capabilitiesProjections.find((crs) =>
        crs === environment.map_view.default_projection);
      if (typeof projection === 'undefined') {
        for (const proj of environment.all_app_projections) {
          projection = capabilitiesProjections.find((crs) => crs === proj.code);
          if (typeof projection !== 'undefined') {
            break;
          }
        }
      }
      return projection;
    }
  }

  /**
   * Función necesaria porque no todos los wms cumplen el mismo etiquetado
   *
   * @private
   * @param {string} name
   * @returns {string}
   * @memberof WmsReaderService
   */
  private _removeXMLTags(name: string): string {
    name = name.replace('wms:', '');
    name = name.replace('ows:', '');
    name = name.replace('xsd:', '');
    return name;
  }

  /**
   * Función necesaria porque no todos los wms cumplen los mismos atributos
   *
   * @private
   * @param {string} name
   * @returns {string}
   * @memberof WmsReaderService
   */
  private _attrNameProcessors(name: string): string {
    name = name.replace('xlink:', '');
    name = name.replace('xmlns:', '');
    return name;
  }
}
