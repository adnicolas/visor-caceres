import { VsLayerOptions } from './vs-layer-options';
import { VsLayerService } from './vs-layer-service';
import { VsLayerStyle } from './vs-layer-style';

export interface VsLayerWMTSOptions extends VsLayerOptions {
  service: VsLayerService;
  opt_options?: {
    // Estilos disponibles del capabilities
    styles?: VsLayerStyle[];
    // Estilo seleccionado
    selectedStyle?: string;
    // Opacidad de la capa
    opacity?: number;
    // Visibilidad de la capa
    visible?: boolean;
    // Comprobar si es una capa base
    isBaseLayer?: boolean;
    // comprobar si es una capa puesta por encima de todas sin mostrarse en la toc
    isTopLayer?: boolean;
    // instancia de OL de la capa
    olInstance?: any;
    // Imagen de la capa en Data64
    img?: string;
    // Extent de la capa
    extent?: ol.Extent;
    // Si la capa es consultable
    queryable?: boolean;
    // Formato de la imagen WMTS
    format?: string;
    // Orden de la capa dentro de la carpeta
    order?: number;
    // MatrixSet de la capa WMTS
    matrixSet?: string;
    // Encoding de la capa WMTS
    requestEncoding?: string;
    // Tilegrid
    tileGrid?: ol.tilegrid.WMTS;
    // Dimensiones
    dimensions?: any;
    // Formatos de la capa (png, jpg etc)
    formats?: any[];
    // selected format
    selectedFormat?: string;
    crossOrigin?: string;
  };
}
