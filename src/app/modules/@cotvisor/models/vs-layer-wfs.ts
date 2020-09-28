

import * as ol from 'openlayers';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { VsLayer } from './vs-layer';
import { VsLayerOptions } from './vs-layer-options';
import { VsLayerService } from './vs-layer-service';
import { VsLayerWFSOptions } from './vs-layer-wfs-options';

/**
 * Clase para construir capas de servicios WFS
 *
 * @export
 * @class VsLayerWMS
 * @extends {VsLayer}
 */
export class VsLayerWFS extends VsLayer {

  // service
  public service: VsLayerService;

  public format: string;
  // Estilo de la capa vectorial
  public style: ol.style.Style | ol.StyleFunction;
  public attributes: Array<{ name: string; required: boolean; type: string }> = [];
  public geometryName: string = '';
  public geometryType: ol.geom.GeometryType;
  public featureNS: string = '';
  public workSpace: string = '';
  public cqlFilter: string;

  public version = '1.1.0';

  /**
   * Crea una instancia de VsLayerWMS.
   * @param {VsLayerWFSOptions} options
   * @memberof VsLayerWFS
   */
  constructor(options: VsLayerWFSOptions) {
    super(options as VsLayerOptions);

    this.sourceType = 'WFS';
    this.service = options.service;
    this.format = options.format;
    // cql_filter debe venir codificado para evitar errores ej:`%22codmun%22%20IN(1458,1258)`,
    if (options.cql_filter) { this.cqlFilter = options.cql_filter; }

    // this.setOpacity(options.hasOwnProperty('opacity') ? options.opacity : 100);
    // this.setVisible(options.hasOwnProperty('visible') ? options.visible : true);
    if (options.hasOwnProperty('opt_options')) {
      // Consigue los metadatos de la capa
      this.style = options.opt_options.style;
      this.featureNS = options.opt_options.featureNS ? options.opt_options.featureNS : '';
      this.geometryName = options.opt_options.geometryName ? options.opt_options.geometryName : '';
      this.attributes = options.opt_options.attributes ? options.opt_options.attributes : [];
    }
    // Inicializa la instancia
    this._initWFSVsLayer(options);

    // if (!(this.olInstance instanceof ol.layer.Vector)) {
    //   this._initWFSVsLayer();
    // }
  }

  /**
   * Inicializa la capa WFS a partir de las opciones del objeto
   * Los parametros del fitrl y bbox son incompatibles por lo que:
   * + Si llega con un filtro CQL se genera la url y la carga con estrategia ALL
   * + Si si no llega filtro se genera mediante funcion para obtener la url con bbox y la estrategia BBOX
   */
  private _initWFSVsLayer(options: VsLayerWFSOptions) {

    const format = this.getOlFormat();
    const hasFilter = this.cqlFilter;
    const option = this.service.url.indexOf('?') > -1 ? this.service.url.split('?')[1] ? '&' : '' : '?';
    const layerSource = new ol.source.Vector(({
      format,
      loader: (extent, resolution, projection) => {
        this.loading = true;
        const proj = projection.getCode();
        const reprojectedExtent = ol.proj.transformExtent(
          extent,
          projection,
          this.projection,
        );
        let getFeatureUrl = this.service.url +
          option +
          'request=GetFeature&version=' +
          this.version +
          '&service=WFS' +
          '&typename=' +
          this.name +
          '&outputFormat=' +
          this.format +
          '&srsname=' +
          this.projection;

        getFeatureUrl += (hasFilter) ? '&cql_filter=' + this.cqlFilter :
          ('&bbox=' + reprojectedExtent.join(',') + ',' + this.projection);

        const url = Utilities.proxyfyURL(getFeatureUrl);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        const onError = () => {
          // @ts-ignore
          layerSource.removeLoadedExtent(extent);
          this.loading = false;
        };
        xhr.onerror = onError;
        xhr.onload = () => {
          if (xhr.status === 200) {
            this.loading = false;
            const response = xhr.responseText;
            layerSource.addFeatures(
              format.readFeatures(response, {
                dataProjection: this.projection,
                featureProjection: proj,
              }),
            );
          } else {
            onError();
          }
        };
        xhr.send();
      },
      strategy: hasFilter ? ol.loadingstrategy.all : ol.loadingstrategy.bbox,
    }));

    // definimos la instancia de la capa OL a cargar a partir del objeto source
    let decluter = false;
    // tslint:disable-next-line:no-string-literal
    if (options.opt_options['declutter']) decluter = true;
    this.olInstance = new ol.layer.Vector({
      source: layerSource,
      style: this.style,
      visible: this.getVisible(),
      opacity: this.getOpacity() / 100,
      declutter: decluter
    });

  }
  /*   private buildSourceURL(option: string): string | ol.FeatureUrlFunction {
      if (this.cqlFilter) {
        return Utilities.proxyfyURL(this.service.url + option +
          'request=GetFeature&version=' + this.version +
          '&service=WFS' +
          '&typename=' + this.name +
          '&outputFormat=' + this.format +
          '&srsname=' + this.projection +
          '&cql_filter=' + this.cqlFilter);
      } else {
        return (extent) => {
          const url = Utilities.proxyfyURL(this.service.url + option +
            'request=GetFeature&version=' + this.version +
            '&service=WFS' +
            '&typename=' + this.name +
            '&outputFormat=' + this.format +
            '&srsname=' + this.projection +
            '&bbox=' + extent.join(',') + ',' + this.projection);
          return url;
        };
      }
    }
   */
  private getOlFormat() {
    switch (this.format) {
      case 'GML2': {
        return new ol.format.WFS({
          gmlFormat: new ol.format.GML2(),
        });
      }
      case 'application/json': {
        // @ts-ignore
        return new ol.format.GeoJSON({ extractGeometryName: true });
      }
      default: {
        return new ol.format.WFS({ gmlFormat: new ol.format.GML3() });
      }
    }
  }
}
