
import * as ol from 'openlayers';
import 'rxjs/add/operator/map';
import * as xml2js from 'xml2js';
import { Injectable } from '@angular/core';
import { ParentService } from './parent.service';
import { HttpProxyService } from './http-proxy.service';
import { VsLayerWFS } from '@cotvisor/models/vs-layer-wfs';
import { environment } from 'src/environments/environment';
import { ToastService } from '@theme/services/toast.service';

/**
 * Servicio de obtención de datos de servidores WFS
 *
 * @return {[type]} [description]
 */
@Injectable({
  providedIn: 'root'
})
export class WfsReaderService extends ParentService {
  private _DEFAULT_VERSION: string = '1.1.0';

  constructor(private httpProxyService: HttpProxyService, private toastService: ToastService) {
    super();
  }

  /**
   * Obtiene todas las caracteristicas de un servidor WFS
   * @param  {string}          wfsUrl URL del servidor
   *  @return {Promise<object>}        Promesa que se resolverá con los datos devueltos del servidor
   */
  public getWFSCapabilitiesAsync(wfsUrl: string, wfsVersion?: string): Promise<any> {
    const version = wfsVersion ? wfsVersion : this._DEFAULT_VERSION;
    const option = wfsUrl.indexOf('?') > -1 ? (wfsUrl.split('?')[1] ? '&' : '') : '?';
    const wfsCapabilities = wfsUrl + option + 'request=GetCapabilities&version=' + version + '&service=WFS';

    return new Promise((resolve, reject) => {
      this.httpProxyService
        .get(wfsCapabilities, { responseType: 'text' })
        .toPromise()
        .then(
          (capabilities) => {
            try {
              xml2js.parseString(
                capabilities,
                {
                  explicitArray: false,
                  normalizeTags: true,
                  tagNameProcessors: [this._removeXMLTags],
                  attrNameProcessors: [this._attrNameProcessors],
                  ignoreAttrs: false,
                },
                (err, result) => {
                  if (!err) {
                    const CAPABILITITES = result.wfs_capabilities;
                    if (CAPABILITITES) {
                      resolve(CAPABILITITES);
                    } else {
                      reject('No se ha podido cargar el servidor WFS');
                    }
                  } else {
                    reject('No se ha podido cargar el servidor WFS');
                  }
                },
              );
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  /**
   * Obtiene todas las caracteristicas de un servidor WFS
   * @param  {string}          wfsUrl URL del servidor
   *  @return {Promise<object>}        Promesa que se resolverá con los datos devueltos del servidor
   */
  public getWFSDescribeFeatureTypeAsync(wfsUrl: string, layerName?: string, wfsVersion?: string): Promise<object> {
    const version = wfsVersion ? wfsVersion : this._DEFAULT_VERSION;

    // Nos quedamos con la url sin parámetros
    let wfsFeatureType = wfsUrl.split('?')[0] + '?request=DescribeFeatureType&version=' + version + '&service=WFS';
    wfsFeatureType += layerName ? '&typeName=' + layerName : '';
    return new Promise((resolve, reject) => {
      this.httpProxyService
        .get(wfsFeatureType, { responseType: 'text' })
        .toPromise()
        .then(
          (featureTypes) => {
            try {
              xml2js.parseString(
                featureTypes,
                {
                  explicitArray: false,
                  normalizeTags: true,
                  tagNameProcessors: [this._removeXMLTags],
                  attrNameProcessors: [this._attrNameProcessors],
                  ignoreAttrs: false,
                },
                (err, result) => {
                  if (!err) {
                    const fTypes = result.schema;
                    if (fTypes) {
                      resolve(fTypes);
                    } else {
                      reject('No se ha podido cargar el servidor WFS');
                    }
                  } else {
                    reject('No se ha podido cargar el servidor WFS');
                  }
                },
              );
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  /**
   * [getWFSServicedescription description]
   * @return {[type]} [description]
   */
  public getWFSServiceDescriptionFromCapabilities(capabilities: any): string {
    if (capabilities) {
      return capabilities.serviceidentification.abstract;
    } else {
      console.error('no se han cargado las features -> getWFSServiceDescriptionFromCapabilities() ');
    }
  }

  /**
   * [getWFSServicedescription description]
   * @return {[type]} [description]
   */
  public getWFSTitleFromCapabilities(capabilities: any): string {
    if (capabilities) {
      return capabilities.serviceidentification.title;
    } else {
      console.error('no se han cargado las features -> getWFSTitleFromCapabilities() ');
    }
  }

  /**
   * Recupera el nodo raiz del arbol de capas del WFS
   * @return {VsLayerWFS} retorna la capa raiz de la estructura de capas del servidor WFS
   */

  public getWFSLayersFromCapabilities(capabilities, wfsUrl: string, filterLayers?: string[], wfsVersion?: string): VsLayerWFS[] {
    const layerList: VsLayerWFS[] = [];
    // const version = wfsVersion ? wfsVersion : this._DEFAULT_VERSION;
    if (capabilities) {
      // si existen capas
      // Las añado a un array vacio por si acaso lo que viene no es un array y es un único elemento
      const featureList = [].concat(capabilities.featuretypelist.featuretype);
      for (const featuretype of featureList) {
        if (!filterLayers || filterLayers.indexOf(featuretype.name) > -1) {

          const vsLayerWFS = this.initNewVsLayer(wfsUrl, capabilities, featuretype);

          if (vsLayerWFS) {
            layerList.push(vsLayerWFS);
          }

        }
      }
      return layerList;
    } else {
      console.error('no se han cargado las features -> getWFSLayersFromCapabilities() ');
    }
  }

  /**
   *
   * Inicializa un objeto VsLayerWFS desde los datos de capa leídos del capabilities
   * usa el servicio y puede ser modificado por otra llamada
   * @private
   * @param {string} url
   * @param {*} capabilities Capabilitites
   * @param {*} layerCapabilities Capa recibida en el capabilitites
   * @returns {VsLayerWFS}  Capa inicializada cpon una instancia de la capo OL
   *
   * @memberOf WfsReaderService
   */
  public initNewVsLayer(url: string, capabilities: any, layerCapabilities: any): VsLayerWFS {

    let extent: ol.Extent;
    const projection = this._getProjection(layerCapabilities);
    if (!projection) {
      this.toastService.showWarning({ summary: 'EPSG no compatibles', detail: `No se han encontrado proyecciones compatibles para la capa ${layerCapabilities.name}` });
      return null;
    }

    if (layerCapabilities.hasOwnProperty('wgs84boundingbox')) {
      const lowercorner = layerCapabilities.wgs84boundingbox.lowercorner.split(' ').map((key) => parseFloat(key));
      const uppercorner = layerCapabilities.wgs84boundingbox.uppercorner.split(' ').map((key) => parseFloat(key));
      extent = ol.proj.transformExtent([lowercorner[0], lowercorner[1], uppercorner[0], uppercorner[1]], 'EPSG:4326', projection);
    }
    const format = this._getFormat(capabilities, layerCapabilities);

    const newVsLayerVector = new VsLayerWFS({
      name: typeof layerCapabilities.name === 'string' ? layerCapabilities.name : layerCapabilities.name._,
      title: layerCapabilities.title,
      projection,
      format,
      service: {
        url,
        description: this.getWFSServiceDescriptionFromCapabilities(capabilities),
        title: this.getWFSTitleFromCapabilities(capabilities),
        type: 'WFS',
      },
      opt_options: {
        queryable: true,
        extent,
        // Falta style
      },
    });
    return newVsLayerVector;
  }

  private _removeXMLTags(name: string): string {
    name = name.replace('wfs:', '');
    name = name.replace('ows:', '');
    name = name.replace('xsd:', '');
    return name;
  }

  private _attrNameProcessors(name: string): string {
    name = name.replace('xmlns:', '');
    name = name.replace('xlink:', '');
    return name;
  }

  private _getFormat(capabilities, layerCapabilities): string {
    let format: string = 'GML3'; // GML3 por defecto si no viene nada
    let outputFormats = [];
    if (layerCapabilities && layerCapabilities.hasOwnProperty('outputformats')) {
      outputFormats = Array.isArray(layerCapabilities.outputformats.format)
        ? [...layerCapabilities.outputformats.format]
        : [layerCapabilities.outputformats.format];
    } else if (capabilities) {
      const getFeature = capabilities.operationsmetadata.operation.find((operation) => operation.$.name === 'GetFeature');
      const outputFormat = getFeature.parameter.find((parameter) => parameter.$.name === 'outputFormat');
      outputFormats = Array.isArray(outputFormat.value) ? [...outputFormat.value] : [outputFormat.value];
    }
    for (const outputFormat of outputFormats) {
      if (outputFormat.includes('json')) {
        format = 'application/json';
        break;
      }
      if (outputFormat.includes('gml/3.1.1')) {
        format = 'GML3';
      }
      if (outputFormat.includes('gml/2.1.2')) {
        format = 'GML2';
      }
    }
    return format;
  }

  private _getProjection(layerCapabilities): string {
    let projection;
    if (layerCapabilities) {
      let othersrs;
      let defaultsrs;
      // Diferencio si viene como crs o srs
      if (layerCapabilities.hasOwnProperty('defaultcrs')) {
        // Recojo todas las proyecciones en un array
        defaultsrs = layerCapabilities.defaultcrs;
        othersrs = layerCapabilities.othercrs
          ? Array.isArray(layerCapabilities.othercrs)
            ? [...layerCapabilities.othercrs]
            : [layerCapabilities.othercrs]
          : [];
      } else {
        // Recojo todas las proyecciones en un array
        defaultsrs = layerCapabilities.defaultsrs;
        othersrs = layerCapabilities.othersrs
          ? Array.isArray(layerCapabilities.othersrs)
            ? [...layerCapabilities.othersrs]
            : [layerCapabilities.othersrs]
          : [];
      }

      const capabilitiesProjections = [defaultsrs, ...othersrs].map((srs) => {
        srs = srs.replace('urn:ogc:def:crs:', '');
        srs = srs.replace('urn:x-ogc:def:crs:', '');
        return srs.replace('EPSG::', 'EPSG:');
      });
      // Busco que tenga la proyección por defecto para las capas, si no es así busco una válida entre las definidas en el enviroment
      projection = capabilitiesProjections.find((crs) => crs === environment.map_view.default_projection);
      if (typeof projection === 'undefined') {
        for (const proj of environment.all_app_projections) {
          projection = capabilitiesProjections.find((crs) => crs === proj.code);
          if (typeof projection !== 'undefined') {
            break;
          }
        }
      }
    }
    return projection;
  }
}
