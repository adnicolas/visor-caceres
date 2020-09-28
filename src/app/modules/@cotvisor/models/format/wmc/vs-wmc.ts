import * as ol from 'openlayers';
import { VsWMCGeneralType } from './vs-wmc-general-type';
import { VsWMCLayerType } from './vs-wmc-layer-type';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';
import { VsWmcStyleType } from './vs-wmc-style-type';
import { VsWMCServerType } from './vs-wmc-server-type';
import { VsUrlType } from '@cotvisor/models/format/shared/vs-url-type';
import { VsLayer } from '@cotvisor/models/vs-layer';

/**
 * Objeto Contexto global de WMC
 * @return {[type]} [description]
 */
export class VsWMC {

  public general: VsWMCGeneralType;
  public layerList: {
    layer: VsWMCLayerType[]
  };

  constructor() {
    this.general = new VsWMCGeneralType();
    this.layerList = {
      layer: []
    };
  }

  /**
   * [setFromVsMap description]
   *
   * @todo Guardar el zoom como extension del mapa
   *
   * Especificar el tipo de servicio de la capa 'OGC:XXX'
   * queryable ??
   *
   * Verificar el booleano hidden
   * @param  {VsMap} vsMap [description]
   * @return {any}         [description]
   */
  setFromVsMap(vsMap: VsMap): boolean {

    try {
      const mapView = vsMap.getView();
      this.general.title = vsMap.title;

      // vista del mapa
      // mapView.getZoom
      this.general.boundingBox.$SRS = mapView.getProjection().getCode();
      const extent = mapView.calculateExtent(vsMap.getSize());
      this.general.boundingBox.$minx = extent[0].toString();
      this.general.boundingBox.$miny = extent[1].toString();
      this.general.boundingBox.$maxx = extent[2].toString();
      this.general.boundingBox.$maxy = extent[3].toString();
      // ancho en pixels del mapa
      this.general.window.$width = vsMap.getSize()[0];
      this.general.window.$height = vsMap.getSize()[1];

      // CAPAS

      for (const vsLayer of vsMap.activeLayers) {
        if (vsLayer instanceof VsLayerWMS || vsLayer instanceof VsLayerWMTS) {
          const vsWmcLayer: VsWMCLayerType = new VsWMCLayerType();

          vsWmcLayer.$hidden = !vsLayer.getVisible();
          vsWmcLayer.dataUrl = vsLayer.service.url;
          if (vsLayer.olInstance.getSource() instanceof ol.source.WMTS) {
            vsWmcLayer.name = vsLayer.olInstance.getSource().getLayer();
          } else {
            vsWmcLayer.name = vsLayer.name;
          }

          vsWmcLayer.$queryable = vsLayer.queryable;
          // server
          vsWmcLayer.server.onlineResource['$xlink:href'] = vsLayer.service.url;

          vsWmcLayer.server.$service = this._getServerType(vsLayer);
          vsWmcLayer.server.$version = '';
          vsWmcLayer.server.$title = vsLayer.title;
          if (vsLayer instanceof VsLayerWMS) {
            // lista de estilos
            for (const style of vsLayer.getAvailableStyles()) {
              const vsWmcStyleType: VsWmcStyleType = new VsWmcStyleType();
              vsWmcStyleType.name = style.name;
              vsWmcStyleType.title = style.title;
              if (style.legendURL && style.legendURL.length > 0) {
                vsWmcStyleType.legendURL.onlineResource['$xlink:href'] = style.legendURL[0].onlineResource;
                vsWmcStyleType.legendURL.onlineResource['$xlink:type'] = style.legendURL[0].format;

                // vsWmcStyleType.legendURL.onlineResource.xlink
              }
              vsWmcLayer.styleList.style.push(vsWmcStyleType);
            }
          }
          vsWmcLayer.title = vsLayer.title;
          vsWmcLayer.window.$width = this.general.window.$width;
          vsWmcLayer.window.$height = this.general.window.$height;
          // Jerarquía de la capa a la extension nodePath, hay que pasar el array a string sepado por comas
          vsWmcLayer.extension.nodePath = vsLayer.nodePath.toString();
          vsWmcLayer.extension.opacity = vsLayer.getOpacity();

          this.layerList.layer.push(vsWmcLayer);
        }
      }
      return true;
    } catch (error) {
      console.error('Error en la carga de Contexto WMC: ' + error);
      throw (error);

    }

  }

  /**
   * Mapea el objeto vsWMC a partir de un objeto wmc convertido desde un xml WMC con xml2js
   * @param  {any}     wmcObject [description]
   * @return {boolean}           true si el mapeo es correcto
   */
  setFromWMCObject(wmcObject: any): boolean {

    try {
      this.general.title = wmcObject.viewcontext.general.title;
      this.general.window.$height = wmcObject.viewcontext.general.window.$.height;
      this.general.window.$width = wmcObject.viewcontext.general.window.$.width;
      this.general.boundingBox.$SRS = wmcObject.viewcontext.general.boundingbox.$.SRS;
      this.general.boundingBox.$minx = wmcObject.viewcontext.general.boundingbox.$.minx;
      this.general.boundingBox.$miny = wmcObject.viewcontext.general.boundingbox.$.miny;
      this.general.boundingBox.$maxx = wmcObject.viewcontext.general.boundingbox.$.maxx;
      this.general.boundingBox.$maxy = wmcObject.viewcontext.general.boundingbox.$.maxy;

      // si no hay capas salimos
      if (!wmcObject.viewcontext.hasOwnProperty('layerlist')) {
        return true;
      } else if (!Array.isArray(wmcObject.viewcontext.layerlist.layer)) {   // si solo hay una capa, llega como objeto, lo pasamos a array
        const tmpLayer = wmcObject.viewcontext.layerlist.layer;
        wmcObject.viewcontext.layerlist.layer = [tmpLayer];
      }
      // procesamos la capas
      for (const layer of wmcObject.viewcontext.layerlist.layer) {
        const vsWMCLayer = new VsWMCLayerType();
        vsWMCLayer.title = layer.title;
        vsWMCLayer.name = layer.name;
        vsWMCLayer.$queryable = (layer.$.queryable === 1) || (layer.$.queryable.toString().toLowerCase() === 'true');
        vsWMCLayer.$hidden = (layer.$.hidden === 1) || (layer.$.hidden.toString().toLowerCase() === 'true');
        vsWMCLayer.dataUrl = layer.dataurl;

        vsWMCLayer.server = new VsWMCServerType();
        vsWMCLayer.server.$service = layer.server.$.service;
        vsWMCLayer.server.$version = layer.server.$.version;
        vsWMCLayer.server.onlineResource['$xlink:href'] = layer.server.onlineresource.$['xlink:href'];
        vsWMCLayer.server.onlineResource['$xlink:type'] = layer.server.onlineresource.$['xlink:type'];
        vsWMCLayer.server.onlineResource['$xmlns:xlink'] = layer.server.onlineresource.$['xmlns:xlink'];

        // si solo hay un estilo, llega como objeto, lo pasamos a array
        if (!Array.isArray(layer.stylelist.style)) {
          const tmpLayerStyle = layer.stylelist.style;
          layer.stylelist.style = [tmpLayerStyle];
        }
        for (const style of layer.stylelist.style) {
          const vsWMCStyle = new VsWmcStyleType();
          vsWMCStyle.name = style.name;
          vsWMCStyle.title = style.title;
          vsWMCStyle.legendURL = new VsUrlType();
          if (style.hasOwnProperty('legendurl')) {
            vsWMCStyle.legendURL.format = style.legendurl.format;
            vsWMCStyle.legendURL.onlineResource['$xlink:href'] = style.legendurl.onlineresource.$['xlink:href'];
            vsWMCStyle.legendURL.onlineResource['$xlink:type'] = style.legendurl.onlineresource.$['xlink:type'];
            vsWMCStyle.legendURL.onlineResource['$xmlns:xlink'] = style.legendurl.onlineresource.$['xmlns:xlink'];
          }
          vsWMCLayer.styleList.style.push(vsWMCStyle);
        }

        if (layer.hasOwnProperty('extension')) {
          // tslint:disable-next-line:forin
          for (const propiedad in layer.extension) {
            vsWMCLayer.extension[propiedad] = layer.extension[propiedad];
          }
        }
        this.layerList.layer.push(vsWMCLayer);
      }

      return true;
    } catch (e) {
      // console.log('Error al mapear el WMC leído: ' + e.message);
      throw (e);
    }
  }

  private _getServerType(vsLayer: VsLayer): string {

    if (vsLayer.olInstance.getSource() instanceof ol.source.WMTS) { return 'OGC:WMTS'; }
    // tslint:disable-next-line:one-line
    else if (vsLayer.olInstance.getSource() instanceof ol.source.TileWMS) { return 'OGC:WMS'; }
    // tslint:disable-next-line:one-line
    else if (vsLayer.olInstance.getSource() instanceof ol.source.Vector) { return 'OGC:WFS'; }

  }

}
