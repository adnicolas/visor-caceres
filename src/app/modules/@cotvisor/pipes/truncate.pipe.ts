import { Pipe, PipeTransform } from '@angular/core';
/**
 * Pipe que trunca un texto al tamaño recibido:
 * Si no se recibe parámetro se trunca a 10 caracteres
 * Si se recibe parámetro y la cadena es de menor tamaño se devuelve completa
 * Si la cadena tiene mas caracteres que los recibidos como parámetros se trunca y se añaden 3 puntos al final
 *
 * @example {{descripcion|truncate : 23}} - trunca la cadena recibida a 23 caracteres
 *
 * @param  {'truncate'}} {name [description]
 * @return {[type]}            [description]
 */
@Pipe({
  name: 'truncate',
})
/**
 * Transforma el string recibido como value a el tamaño recibido como argumento
 * @param  {string} value Cadena a truncar
 * @param  {string} arg   Longitud de truncado
 * @return {string}       Cadena truncada
 */
export class TruncatePipe implements PipeTransform {
  public transform(value: string, arg: string): string {
    let limit: number;

    if (!value) { return; }

    if (arg) {
      limit = parseInt(arg, 10);
    } else {
      limit = 10;
    }
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
