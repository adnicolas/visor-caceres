
/**
 * Interfaz para la definición de los atributos disponibles en una capa extándar
 *
 * @export
 * @interface VsLayerOptions
 */
export interface VsLayerOptions {
  id?: number;
  name: string;
  title: string;
  projection: string;
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
    // Orden de la capa dentro de la carpeta
    order?: number;
    // CrossOrigin
    crossOrigin?: string;
  };
}
