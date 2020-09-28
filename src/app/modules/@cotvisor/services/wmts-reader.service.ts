/*

servicio que recibe una url de un servidor WMTS en el constructor y guarda las capas disponibles.
Uso de https://stackoverflow.com/questions/42838285/angular2-convert-xml-to-json

*/

import { Injectable } from '@angular/core';

import * as ol from 'openlayers';
import { ParentService } from './parent.service';
import { HttpProxyService } from './http-proxy.service';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';
import { VsLayerStyle } from '@cotvisor/models/vs-layer-style';
import { VsLayerStyleLegend } from '@cotvisor/models/vs-layer-style-legend';
import { environment } from 'src/environments/environment';
/**
 * Servicio de obtención de datos de servidores WMTS
 *
 * @return {[type]} [description]
 */
@Injectable({
  providedIn: 'root'
})
export class WmtsReaderService extends ParentService {
  private _DEFAULT_VERSION: string = '1.0.0';

  constructor(private httpProxyService: HttpProxyService) {
    super();
  }

  /**
   * Obtiene todas las caracteristicas del un servidor WMTS description]
   * @param  {string}          wmtsUrl URL del servidor
   *  @return {Promise<object>}        Promesa que se resolverá con los datos devueltos del servidor
   */
  public getWMTSCapabilitiesAsync(wmtsUrl: string, version?: string): Promise<object> {
    // let parserWMTS = new ol.format.capabilitiesabilities();
    if (!version) {
      version = this._DEFAULT_VERSION;
    }
    // Nos quedamos con la url sin parámetros
    const option = wmtsUrl.indexOf('?') > -1 ? (wmtsUrl.split('?')[1] ? '&' : '') : '?';
    const wmtsUrlGetCapabilities: string = wmtsUrl + option + 'request=GetCapabilities&version=' + version + '&service=WMTS';

    const parser = new ol.format.WMTSCapabilities();
    return new Promise((resolve, reject) => {
      this.httpProxyService
        .get(wmtsUrlGetCapabilities, { responseType: 'text' })
        .toPromise()
        .then(
          (capabilities) => {
            try {
              const parseCapabilities = parser.read(capabilities);
              resolve(parseCapabilities);
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(error);
          },
        );
    });
    /* return new Promise((resolve, reject) => {
      this.httpProxyService.get(wmtsUrl_GetCapabilities, { responseType: "text" }).toPromise()
        .then((capabilities) => {
          try {
            //this._capabilities = parserWMTS.read(capabilities.text());
            xml2js.parseString(capabilities, { explicitArray: false, normalizeTags: true, tagNameProcessors: [this._removeXMLTags], ignoreAttrs: true }, (err, result) => {
              if (!err) {

                this._capabilities = result.capabilities;
                this._capabilitiesLoaded = true;
                if (this._capabilities) {
                  resolve(this._capabilities);
                } else {
                  reject('No se ha podido cargar el servidor WMTS');
                }
              } else {
                reject('No se ha podido cargar el servidor WMTS');
              }
            });
          } catch (error) {
            this._capabilities = null;
            reject(error);
          }

        },
          (error) => {
            this._capabilities = null;
            reject(error)
          })
    }); */
  }
  /**
   * [getWMTSServicedescription description]
   * @return {[type]} [description]
   */
  public getWMTSServiceDescriptionFromCapabilities(capabilities: any): string {
    return capabilities.ServiceIdentification.Abstract;
  }

  /**
   * [getWMTSServicedescription description]
   * @return {[type]} [description]
   */
  public getWMTSTitleFromCapabilities(capabilities: any): string {
    return capabilities.ServiceIdentification.Title;
  }

  /**
   * Recupera las capas WMTS
   * @return {VsLayer} retorna la capa raiz de la estructura de capas del servidor WMS
   */
  public getWMTSLayersFromCapabilities(capabilities: any, wmtsUrl: string, filterByName?: string[]): VsLayerWMTS[] {
    const layerList: VsLayerWMTS[] = [];
    filterByName = filterByName ? filterByName : [];
    // si existen capas
    // Las añado a un array vacio por si acaso lo que viene no es un array y es un único elemento
    const featureList = [].concat(capabilities.Contents.Layer);
    for (const featuretype of featureList) {
      if (filterByName.length && filterByName.indexOf(featuretype.Identifier) === -1) {
        continue;
      }
      try {
        const options = this._getoptionsFromCapabilities(capabilities, featuretype.Identifier);
        // concatenamos con un array vacio para convertir el objeto en array
        featuretype.format = [].concat(featuretype.Format);
        // array cuando sólo llega un estilo
        const stylesCapabilities = [].concat(featuretype.Style);
        const styles = [];
        for (const style of stylesCapabilities) {
          styles.push(this._getStyleFromCapabilities(style));
        }
        const topVsLayer: VsLayerWMTS = new VsLayerWMTS({
          name: featuretype.Identifier,
          title: featuretype.Title,
          projection: options.projection,
          service: {
            url: wmtsUrl,
            description: this.getWMTSServiceDescriptionFromCapabilities(capabilities),
            title: this.getWMTSTitleFromCapabilities(capabilities),
            type: 'WMTS',
          },
          opt_options: {
            queryable: true,
            styles,
            format: options.format,
            selectedStyle: options.style,
            dimensions: options.dimensions,
            tileGrid: options.tileGrid,
            requestEncoding: options.requestEncoding,
            matrixSet: options.matrixSet,
            // crossOrigin: 'Anonymous'
          },
        });
        layerList.push(topVsLayer);
      } catch (error) {
        console.error(error.message);
      }
    }
    return layerList;
  }

  /**
   * Convierte el estilo leido del capabilities en el estilo de vslayer
   *
   * @private
   * @param {*} styleFromCapabilities
   * @returns
   * @memberof WmtsReaderService
   */
  private _getStyleFromCapabilities(styleFromCapabilities: any) {
    const localVsStyle: VsLayerStyle = new VsLayerStyle();
    localVsStyle.name = styleFromCapabilities.Identifier;
    localVsStyle.title = styleFromCapabilities.Title || styleFromCapabilities.Identifier;
    if (styleFromCapabilities.LegendURL) {
      const styles = [].concat(styleFromCapabilities.LegendURL);
      for (const legendFromCapabilitites of styles) {
        const localVsLegend: VsLayerStyleLegend = new VsLayerStyleLegend();
        localVsLegend.format = legendFromCapabilitites.format;
        localVsLegend.onlineResource = legendFromCapabilitites.href;
        localVsLegend.width = legendFromCapabilitites.width;
        localVsLegend.height = legendFromCapabilitites.height;
        localVsStyle.legendURL.push(localVsLegend);
      }
    }
    return localVsStyle;
  }

  /**
   * Función para extraer los parámetros que conforman el source de la capa WMTS
   *
   * @private
   * @param {*} capabilities
   * @param {*} layerName
   * @returns {*}
   * @memberof WmtsReaderService
   */
  private _getoptionsFromCapabilities(
    capabilities: any,
    layerName: string,
  ): {
    urls: string[];
    layer: string;
    matrixSet: string;
    format: string;
    projection: string;
    requestEncoding: string;
    tileGrid: ol.tilegrid.WMTS;
    style: string;
    dimensions: any;
    wrapX: boolean;
  } {
    const layers = capabilities.Contents.Layer;
    const l = layers.find((layer) => {
      return layer.Identifier === layerName;
    });
    if (l === null) {
      return null;
    }
    const tileMatrixSets = capabilities.Contents.TileMatrixSet;
    let idx;
    let matrixSet;
    let matrixLimits;
    // Compruebo
    if (l.TileMatrixSetLink.length > 1) {
      // Busco en qué indice se encuentra el matrixsetlink con la proyección por defecto
      idx = this.getTileMatrixSetLink(l.TileMatrixSetLink, tileMatrixSets, environment.map_view.default_projection);
      if (idx < 0) {
        // Si no se encuentra, busco la primera matrixsetlink que cumpla con la lista de proyecciones habilitadas
        for (const proj of environment.all_app_projections) {
          idx = this.getTileMatrixSetLink(l.TileMatrixSetLink, tileMatrixSets, proj.code);
          if (idx >= 0) {
            break;
          }
        }
        // Si no hay ninguna lanzo un error
        if (idx < 0) {
          throw { message: 'No existe matrix que soporte una de las proyecciones habilitadas' };
        }
      }
    } else {
      idx = 0;
    }
    matrixSet /** @type {string} */ = l.TileMatrixSetLink[idx].TileMatrixSet;
    matrixLimits /** @type {Array.<Object>} */ = l.TileMatrixSetLink[idx].TileMatrixSetLimits;

    let format = /** @type {string} */ (l.Format[0]);
    idx = l.Style.findIndex((elt) => {
      return elt.isDefault;
    });
    if (idx < 0) {
      idx = 0;
    }
    const style = /** @type {string} */ (l.Style[idx].Identifier);

    const dimensions = {};
    if ('Dimension' in l) {
      l.Dimension.forEach((elt) => {
        const key = elt.Identifier;
        let value = elt.Default;
        if (value === undefined) {
          value = elt.Value[0];
        }
        dimensions[key] = value;
      });
    }

    const matrixSets = capabilities.Contents.TileMatrixSet;
    const matrixSetObj = matrixSets.find((elt) => {
      return elt.Identifier === matrixSet;
    });

    let projection;
    const code = matrixSetObj.SupportedCRS;
    if (code) {
      projection = ol.proj.get(code.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || ol.proj.get(code);
    }

    const wgs84BoundingBox = l.WGS84BoundingBox;
    let extent: any;
    let wrapX: any;
    if (wgs84BoundingBox !== undefined) {
      const wgs84ProjectionExtent = ol.proj.get('EPSG:4326').getExtent();
      wrapX = wgs84BoundingBox[0] === wgs84ProjectionExtent[0] && wgs84BoundingBox[2] === wgs84ProjectionExtent[2];
      extent = ol.proj.transformExtent(wgs84BoundingBox, 'EPSG:4326', projection);
      const projectionExtent = projection.getExtent();
      if (projectionExtent) {
        // If possible, do a sanity check on the extent - it should never be
        // bigger than the validity extent of the projection of a matrix set.
        if (!ol.extent.containsExtent(projectionExtent, extent)) {
          extent = undefined;
        }
      }
    }
    // @ts-ignore
    const tileGrid = ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet(matrixSetObj, extent, matrixLimits);

    /** @type {!Array.<string>} */
    const urls = [];
    let requestEncoding;

    if ('OperationsMetadata' in capabilities && 'GetTile' in capabilities.OperationsMetadata) {
      const gets = capabilities.OperationsMetadata.GetTile.DCP.HTTP.Get;

      for (let i = 0, ii = gets.length; i < ii; ++i) {
        if (gets[i].Constraint) {
          const constraint = gets[i].Constraint.find((element) => {
            return element.name === 'GetEncoding';
          });
          const encodings = constraint.AllowedValues.Value;
          requestEncoding = encodings[0];
          if (requestEncoding === 'KVP') {
            if (encodings.includes('KVP')) {
              urls.push(/** @type {string} */(gets[i].href));
            }
          } else {
            break;
          }
        } else if (gets[i].href) {
          requestEncoding = 'KVP';
          urls.push(/** @type {string} */(gets[i].href));
        }
      }
    }
    if (urls.length === 0) {
      requestEncoding = 'REST';
      l.ResourceURL.forEach((element) => {
        if (element.resourceType === 'tile') {
          format = element.format;
          urls.push(/** @type {string} */(element.template));
        }
      });
    }

    return {
      urls,
      layer: layerName,
      matrixSet,
      format,
      projection: projection.getCode(),
      requestEncoding,
      tileGrid,
      style,
      dimensions,
      wrapX,
    };
  }

  private getTileMatrixSetLink(tileMatrixSetLinkArray: any[], tileMatrixSets: any[], projection): number {
    return tileMatrixSetLinkArray.findIndex((tileMatrixSetLink) => {
      const tileMatrixSet = tileMatrixSets.find(
        (searchedTileMatrixSet) => {
          return searchedTileMatrixSet.Identifier === tileMatrixSetLink.TileMatrixSet;
        });
      const supportedCRS = tileMatrixSet.SupportedCRS;
      const proj1 = ol.proj.get(supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || ol.proj.get(supportedCRS);
      const proj2 = ol.proj.get(projection);
      if (proj1 && proj2) {
        return ol.proj.equivalent(proj1, proj2);
      } else {
        return supportedCRS === projection;
      }
    });
  }
}
