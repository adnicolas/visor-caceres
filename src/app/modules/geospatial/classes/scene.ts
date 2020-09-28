import { SceneOptions } from './scene-options';


/**
 * Clase padre de las escenas. Contiene los distintos atributos de una escena. Clase abstracta, sólo se puden instanciar las clases hijas.
 *
 * @export
 * @abstract
 * @class Scene
 */
export abstract class Scene {
         id?: string;
         timestamp?: number; // timestamp
         cloudCover?: number; // porcentaje de 0-100%
         sunElevation?: number; // ángulo de elevación del sol sobre el horizonte
         thumbnail?: string; // URL de la imágen
         satelliteName?: string; // Nombre del sensor/satéltie
         geometryWKT?: string; // Geometría en WKT
         type?: string; // Tipo de scena (SENTINEL, GDBX...)

         constructor(options: SceneOptions) {}
       }
