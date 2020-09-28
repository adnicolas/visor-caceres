import { VsLayerService } from './vs-layer-service';
import { VsLayerVectorOptions } from './vs-layer-vector-options';

/**
 * Interfaz para la definición de los atributos disponibles en una capa de un servicio WFS
 *
 * @export
 * @interface VsLayerWFSOptions
 * @extends {VsLayerVectorOptions}
 */
export interface VsLayerWFSOptions extends VsLayerVectorOptions {
    service: VsLayerService;
    format: string;
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
        // mostrar las estiquetas despejadas
        declutter?: boolean;
        // Nombre de la geometría
        geometryName?: string;
        // Nombre del uri del espacio de trabajo
        featureNS?: string;
        // Atributos de cada feature
        attributes?: Array<{ name: string; required: boolean; type: string }>;
    };
    // filtro
    cql_filter?: string;
}
