import { VsLayerOptions } from './vs-layer-options';

/**
 * Interfaz para la definición de los atributos disponibles en una capa de un servicio WFS
 *
 * @export
 * @interface VsLayerWFSOptions
 * @extends {VsLayerOptions}
 */
export interface VsLayerVectorOptions extends VsLayerOptions {
    opt_options?: {
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
        // Estilo de la capa vectorial
        style?: ol.style.Style | ol.StyleFunction;
        // Orden de la capa dentro de la carpeta
        order?: number;
    };
}
