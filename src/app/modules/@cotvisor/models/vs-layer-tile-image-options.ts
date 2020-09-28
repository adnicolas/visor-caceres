import { VsLayerOptions } from './vs-layer-options';
import { VsLayerService } from './vs-layer-service';

/**
 * Interfaz para la definición de los atributos disponibles en una capa de un servicio Tile Image
 *
 * @export
 * @interface VsLayerTileImageOptions
 * @extends {VsLayerOptions}
 */
export interface VsLayerTileImageOptions extends VsLayerOptions {
    service: VsLayerService;
}
