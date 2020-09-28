import { Injectable } from '@angular/core';

class CacheElement {
  public component: string;
  public service: string;
  public type: string;
  public json: any;
  constructor(component: string, service: string, type: string, json: any) {
    this.component = component;
    this.service = service;
    this.type = type;
    this.json = json;
  }
}

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para cachear los json obtenidos en otros servicios, de forma que no haya que pedirlo remotamente
 * @return {[type]} [description]
 */
export class JsonCacheService {

  public cache: CacheElement[];

  constructor() {
    this.cache = [];
  }

  /**
   * Añade un elemento a la caché de jsons
   * @param {string} component componente del que viene
   * @param {string} service   servicio que lo solicita
   * @param {string} type      tipo de servicio
   * @param {any}    json      json con los datos a cachear
   */
  public addToCache(component: string, service: string, type: string, json: any): void {
    this.cache.push(new CacheElement(component, service, type, json));
  }

  /**
   * Devuelve un json si existe dentro de la caché o false en caso contrario
   * @param  {string} component componente del que viene
   * @param  {string} service   servicio que lo solicita
   * @param  {string} type       tipo de servicio
   * @return {any}              json con los datos
   */
  public getFromCache(component: string, service: string, type: string): any {
    for (const el of this.cache) {
      if (el.component === component && el.type === type && el.service === service) {
        return el.json;
      }
    }
    return false;
  }

}
