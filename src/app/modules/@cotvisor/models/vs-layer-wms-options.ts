import { VsLayerOptions } from './vs-layer-options';
import { VsLayerService } from './vs-layer-service';
import { VsLayerStyle } from './vs-layer-style';
import { VsMetadata } from './vs-metadata';
import { VsAttributionType } from './format/shared/vs-attribution-type';

/**
 * Interfaz para la definición de los atributos disponibles en una capa de un servicio WMS
 *
 * @export
 * @interface VsLayerWMSOptions
 * @extends {VsLayerOptions}
 */
export interface VsLayerWMSOptions extends VsLayerOptions {
  service: VsLayerService;
  opt_options?: {
    // Estilos disponibles del capabilities
    styles?: VsLayerStyle[];
    // Estilo seleccionado
    selectedStyle?: string;
    // Atribuciones de la capa
    attributions?: VsAttributionType;
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
    // Metadatos de la capa
    metadatas?: VsMetadata[];
    // Orden de la capa dentro de la carpeta
    order?: number;
    // Cargar tileadas
    tiled?: boolean;
    // Formatos de la capa (png, jpg etc)
    formats?: any[];
    // selected format
    selectedFormat?: string;
    // Formatos de la capa (png, jpg etc)
    languages?: any[];
    // selected format
    selectedLanguage?: string;
    // Escalas mínima y máximas
    minScaleDenominator?: number;
    maxScaleDenominator?: number;
    crossOrigin?: string;
  };
}
