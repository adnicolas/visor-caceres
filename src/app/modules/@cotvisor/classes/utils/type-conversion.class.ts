import * as ol from 'openlayers';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsAttributionType } from '@cotvisor/models/format/shared/vs-attribution-type';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsLayerWFS } from '@cotvisor/models/vs-layer-wfs';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsLayerStyle } from '@cotvisor/models/vs-layer-style';
import { VsLayerStyleLegend } from '@cotvisor/models/vs-layer-style-legend';
import { VsMetadata } from '@cotvisor/models/vs-metadata';
import { LayerModel, StyleModel, MetadataModel } from '@cotvisor-admin/models';
/**
 * Clase estática de conversión de tipos entre la BBDD y el visor
 *
 * @export
 * @class TypeConversion
 */
export class TypeConversion {

  /**
   * Convierte el modelo de capa de la BBDD al del visor
   *
   * @param {LayerModel} layer
   * @returns {VsLayer}
   * @memberof TypeConversionService
   */
  public static createVsLayerFromLayerModel(layer: LayerModel): VsLayer {
    // Si la capa tiene servicio (es externa)
    let vsLayer: VsLayer;
    let extent: ol.Extent;
    if (layer.bboxMinX && layer.bboxMinY && layer.bboxMaxX && layer.bboxMaxY) {
      extent = [layer.bboxMinX, layer.bboxMinY, layer.bboxMaxX, layer.bboxMaxY];
    }
    if (layer.service) {
      if (layer.service.type === 'WMS') {
        const attribution = new VsAttributionType();
        attribution.onlineResource = layer.attributionLink;
        attribution.title = layer.attribution;
        vsLayer = new VsLayerWMS({
          id: layer.id,
          name: layer.name,
          title: layer.title,
          projection: layer.projection,
          service: {
            id: layer.service.id,
            url: layer.service.url,
            description: layer.service.description,
            title: layer.service.title,
            type: layer.service.type,
          },
          opt_options: {
            opacity: layer.opacity,
            visible: layer.visible,
            queryable: layer.queryable,
            extent,
            img: layer.img,
            order: layer.order,
            styles: this.getVsStylesFromLayerModel(layer),
            formats: this.getVsFormatsFromLayerModel(layer),
            languages: this.getVsLanguagesFromLayerModel(layer),
            selectedStyle: layer.selectedStyle,
            selectedFormat: layer.selectedFormat,
            selectedLanguage: layer.selectedLanguage,
            attributions: attribution,
            metadatas: this.getVsMetadataFromLayerModel(layer),
            minScaleDenominator: layer.minScale,
            maxScaleDenominator: layer.maxScale,
            // crossOrigin: 'Anonymous'
          },
        });
      }
      if (layer.service.type === 'WFS') {
        vsLayer = new VsLayerWFS({
          id: layer.id,
          name: layer.name,
          title: layer.title,
          projection: layer.projection,
          format: layer.selectedFormat,
          service: {
            id: layer.service.id,
            url: layer.service.url,
            description: layer.service.description,
            title: layer.service.title,
            type: layer.service.type,
          },
          opt_options: {
            opacity: layer.opacity,
            visible: layer.visible,
            queryable: layer.queryable,
            extent,
            img: layer.img,
            order: layer.order,
            // Falta style
          },
        });
      }
      if (layer.service.type === 'WMTS') {
        // Convierto a tilegrid de openlayers
        const tileGridData = JSON.parse(layer.WMTS_tileGrid);
        const matrixIds = tileGridData.matrixIds;
        const resolutions = tileGridData.resolutions;
        const tileSizes = tileGridData.tileSizes;
        const origins = tileGridData.origins;
        const tileGrid = new ol.tilegrid.WMTS(
          {
            matrixIds,
            resolutions,
            origins,
            tileSizes,
          });

        vsLayer = new VsLayerWMTS({
          id: layer.id,
          name: layer.name,
          title: layer.title,
          projection: layer.projection,
          service: {
            id: layer.service.id,
            url: layer.service.url,
            description: layer.service.description,
            title: layer.service.title,
            type: layer.service.type,
          },
          opt_options: {
            opacity: layer.opacity,
            visible: layer.visible,
            queryable: layer.queryable,
            extent,
            img: layer.img,
            order: layer.order,
            styles: this.getVsStylesFromLayerModel(layer),
            selectedStyle: layer.selectedStyle,
            dimensions: JSON.parse(layer.WMTS_dimensions),
            requestEncoding: layer.WMTS_requestEncoding,
            matrixSet: layer.WMTS_matrixSet,
            format: layer.formats,
            tileGrid,
          },
        });
      }
    } else {
      vsLayer = new VsLayerVector({
        id: layer.id,
        name: layer.name,
        title: layer.title,
        projection: layer.projection,
        opt_options: {
          opacity: layer.opacity,
          visible: layer.visible,
          queryable: layer.queryable,
          extent,
          img: layer.img,
          order: layer.order,
          // Falta style, aunque se reconstruirá del formato en texto que insertemos en userContent
        },
      });
      const features = new ol.format.KML({
        extractStyles: true,
      }).readFeatures(layer.userContent, {
        featureProjection: layer.projection,
        dataProjection: 'EPSG:4326',
      });
      if (features.length) {
        const source = new ol.source.Vector({ features });
        vsLayer.olInstance.setSource(source);
      }

    }
    return vsLayer;
  }

  /**
   * Convierte el modelo de capa del visor al de la BBDD
   *
   * @param {VsLayer} vsLayer
   * @returns {LayerModel}
   * @memberof TypeConversionService
   */
  public static createLayerModelFromVsLayer(vsLayer: VsLayer): LayerModel {
    // Si la capa tiene servicio (es externa)
    // TODO falta por concretar campos en la transformación del modelo de BBDD al visor
    let layer: LayerModel;

    layer = {
      id: vsLayer.id,
      service: null,
      name: vsLayer.name,
      title: vsLayer.title,
      description: '',
      attribution: null,
      attributionLink: null,
      languages: '',
      queryable: vsLayer.queryable,
      minScale: null,
      maxScale: null,
      visible: vsLayer.getVisible(),
      opacity: vsLayer.getOpacity(),
      order: vsLayer.order,
      // proyección de la capa
      projection: vsLayer.projection,
      // bbox en la proyección de la capa
      bboxMaxX: vsLayer.extent ? vsLayer.extent[2] : null,
      bboxMaxY: vsLayer.extent ? vsLayer.extent[3] : null,
      bboxMinX: vsLayer.extent ? vsLayer.extent[0] : null,
      bboxMinY: vsLayer.extent ? vsLayer.extent[1] : null,
      // imagen codificada en base64
      img: vsLayer.img,
      styles: [], // Falta styles
      formats: null,
      metadatas: [],
      category: null,
      favorite: null,
      revised: false,
      stampCreation: null,
      stampRevision: null,
      tags: [],
      userContent: null,
      userOwner: null,
      userIdRevision: null,
      validated: null,
      selectedStyle: null,
      selectedFormat: null,
      selectedLanguage: null,
      WMTS_matrixSet: null,
      WMTS_requestEncoding: null,
      WMTS_tileGrid: null,
      WMTS_dimensions: null,
      dimensions: null,
    };
    if (vsLayer instanceof VsLayerWMS || vsLayer instanceof VsLayerWMTS || vsLayer instanceof VsLayerWMS) {
      layer.service = {
        id: vsLayer.service.id,
        category: null,
        validated: null,
        revised: null,
        userIdRevision: null,
        stampRevision: null,
        url: vsLayer.service.url,
        name: vsLayer.service.type,
        title: vsLayer.service.title,
        description: vsLayer.service.description,
        type: vsLayer.service.type,
      };
      if (vsLayer instanceof VsLayerWMS) {
        layer.attribution = vsLayer.attributions.title;
        layer.attributionLink = vsLayer.attributions.onlineResource;
        layer.metadatas = this.getMetadataModelFromVsLayer(vsLayer);
        // Carga de estilos
        layer.styles = this.getStylesModelFromVsLayer(vsLayer);
        layer.formats = this.getFormatsFromVsLayer(vsLayer);
        layer.languages = this.getLanguagesFromVsLayer(vsLayer);
        layer.minScale = vsLayer.minScaleDenominator;
        layer.maxScale = vsLayer.maxScaleDenominator;
      }
      if (vsLayer instanceof VsLayerWMTS) {
        // Carga de estilos
        layer.styles = this.getStylesModelFromVsLayer(vsLayer);
        // Atributos propios de WMTS
        layer.WMTS_dimensions = JSON.stringify(vsLayer.dimensions);
        layer.WMTS_requestEncoding = vsLayer.requestEncoding;
        layer.WMTS_matrixSet = vsLayer.matrixSet;
        layer.formats = vsLayer.format;
        // Formateamos el tilegrid para luego poder reconstruirlo
        const resolutions = vsLayer.tileGrid.getResolutions();
        const matrixIds = vsLayer.tileGrid.getMatrixIds();
        const origins = [];
        const tileSizes = [];
        for (let i = 0; i < resolutions.length; i++) {
          origins[i] = vsLayer.tileGrid.getOrigin(i);
          tileSizes[i] = vsLayer.tileGrid.getTileSize(i);
        }
        const tileGrid = {
          resolutions,
          matrixIds,
          origins,
          tileSizes,
        };
        layer.WMTS_tileGrid = JSON.stringify(tileGrid);
      }
      if (vsLayer instanceof VsLayerWFS) {
        // layer.formats = vsLayer.formats;
      }
    } else if (vsLayer instanceof VsLayerVector) {
      // layer.userContent =
    }
    return layer;
  }

  public static getFormatsFromVsLayer(vsLayer: VsLayerWMS) {
    if (vsLayer.availableFormats) {
      if (vsLayer.availableFormats.length > 0) {
        return vsLayer.availableFormats.join(',');
      } else {
        return null;
      }
    }
  }

  public static getVsFormatsFromLayerModel(layer: LayerModel) {
    if (layer.formats) {
      return layer.formats.split(',');
    } else {
      layer.formats = 'image/png';
      return [layer.formats];
    }
  }

  public static getLanguagesFromVsLayer(vsLayer: VsLayerWMS) {
    if (vsLayer.availableLanguages) {
      if (vsLayer.availableLanguages.length > 0) {
        return vsLayer.availableLanguages.join(',');
      } else {
        return null;
      }
    }
  }

  public static getVsLanguagesFromLayerModel(layer: LayerModel) {
    if (layer.languages) {
      return layer.languages.split(',');
    } else {
      return [];
    }
  }

  /**
   * Obtiene los estilos VsLayerStyle desde un LayerModel de un mapa de usuario
   *
   * @private
   * @param {LayerModel} layer
   * @returns {VsLayerStyle[]}
   * @memberof VsMapService
   */
  public static getVsStylesFromLayerModel(layer: LayerModel): VsLayerStyle[] {

    const vsLayerStyles: VsLayerStyle[] = [];
    layer.styles.forEach((style) => {
      const vsStyle = new VsLayerStyle();
      vsStyle.id = style.id;
      vsStyle.name = style.name;
      vsStyle.title = style.title;
      if (style.legendUrl) {
        const legend = new VsLayerStyleLegend();
        legend.format = style.legendFormat;
        legend.onlineResource = style.legendUrl;
        legend.height = style.legendHeight;
        legend.width = style.legendWidth;
        vsStyle.legendURL.push(legend);
      }
      vsLayerStyles.push(vsStyle);
    });
    return vsLayerStyles;
  }

  /**
   * Obtiene los estilos StyleModel desde un VsLayer
   *
   * @static
   * @param {LayerModel} layer
   * @returns {VsLayerStyle[]}
   * @memberof TypeConversion
   */
  public static getStylesModelFromVsLayer(vsLayer: VsLayerWMS | VsLayerWMTS): StyleModel[] {

    const styles: StyleModel[] = [];
    vsLayer.availableStyles.forEach((vsStyle) => {
      const style = new StyleModel();
      style.id = vsStyle.id;
      style.name = vsStyle.name;
      style.title = vsStyle.title;
      // TODO soportar multiples leyendas
      if (vsStyle.legendURL.length) {
        style.legendFormat = vsStyle.legendURL[0].format;
        style.legendUrl = vsStyle.legendURL[0].onlineResource;
        style.legendHeight = vsStyle.legendURL[0].height;
        style.legendWidth = vsStyle.legendURL[0].width;
      }
      styles.push(style);
    });
    return styles;
  }

  /**
   * Obtiene los metadatos VsMetadata desde un LayerModel de un mapa de usuario
   *
   * @private
   * @param {LayerModel} layer
   * @returns {VsLayerStyle[]}
   * @memberof VsMapService
   */
  public static getVsMetadataFromLayerModel(layer: LayerModel): VsMetadata[] {

    const vsLayerMetadatas: VsMetadata[] = [];
    layer.metadatas.forEach((metadata) => {
      const vsMetadata = new VsMetadata(metadata.url, metadata.format, metadata.type);
      vsMetadata.id = metadata.id;
      vsLayerMetadatas.push(vsMetadata);
    });
    return vsLayerMetadatas;
  }

  /**
   * Obtiene los metadatos MetadataModel desde un VsLayer
   *
   * @static
   * @param {(VsLayerWMS)} vsLayer
   * @returns {StyleModel[]}
   * @memberof TypeConversion
   */
  public static getMetadataModelFromVsLayer(vsLayer: VsLayerWMS): MetadataModel[] {

    const metadatas: MetadataModel[] = [];
    vsLayer.metadatas.forEach((vsMetadata) => {
      const metadata = new MetadataModel();
      metadata.format = vsMetadata.format;
      metadata.type = vsMetadata.type;
      metadata.url = vsMetadata.url;
      metadata.id = vsMetadata.id;
      metadatas.push(metadata);
    });
    return metadatas;
  }
}
