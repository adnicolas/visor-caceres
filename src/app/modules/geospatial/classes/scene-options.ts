/**
 * Interfaz para la definición de los atributos disponibles en una escena
 * @export
 * @interface SceneOptions
 */
export interface SceneOptions {
  id?: string;
  timestamp?: number; // timestamp
  cloudCover?: number; // porcentaje de 0-100%
  sunElevation?: number; // ángulo de elevación del sol sobre el horizonte
  thumbnail?: string; // URL de la imágen
  satelliteName?: string; // Nombre del sensor/satéltie
  geometryWKT?: string; // Geometría en WKT
  type?: string; // Tipo de scena (SENTINEL, GDBX...)
}
