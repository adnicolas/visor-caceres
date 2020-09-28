import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlParamsService {

  private params: any;

  constructor() {
  }
  /**
   * [getParams description]
   * @return {any} [description]
   */
  public getParams(): any {
    return this.params;
  }

  /**
   * devuelve el parametro  o null si no existe
   *
   * @param {string} param
   * @returns {*}
   * @memberof UrlParamsService
   */
  public getParam(param: string): any {
    try {
      return this.params[param];
    } catch (error) {
      return null;

    }

  }

  public getParamFromURL(url: string, param: string): any {
    try {
      const expression = param + '=([^&]+)';
      const rx = new RegExp(expression, 'i');
      return rx.exec(url)[1];
    } catch (error) {
      return null;
    }
  }

  /**
   * [setParamsfromURL description]
   * @param  {string} url [description]
   * @return {[type]}     [description]
   */
  public setParamsfromURL(url: string) {
    try {
      const paramsText: string = JSON.parse('{}');

      let urlparam = window.location.hash;
      // eliminamos la interrogacion ya que si no se va a añadir al nombre del primer parametro
      while (urlparam.indexOf('?') !== -1) {
        urlparam = urlparam.substring(urlparam.indexOf('?') + 1, urlparam.length);
      }
      const params = new URLSearchParams(urlparam);


      // creamos un objeto para todos los parametros
      params.forEach((v, k) => {
        paramsText[k] = v[0];
      });

      this.params = paramsText;

    } catch (e) {
      console.error('Parametros de url mal formados');
      this.params = {};
    }

  }

  /**
   * Establece los parametros a partir de una cadena de cofiguracion que contiene los parámeotros
   * El objetivo de este método es obtener los parámetros en IONIC
   * @param  {string} url [description]
   * @return {[type]}     [description]
   */
  public setParamsfromConfigString(configString: string) {
    try {
      this.params = {};

      // creamos un objeto para todos los parametros
      configString.split(',').forEach((configParam) => {
        const paramValue = configParam.split('=');
        if (paramValue) { this.params[paramValue[0]] = paramValue[1]; }
      });

    } catch (e) {
      console.error('Cadena de parametros mal formada');
      this.params = {};
    }

  }

  /**
   * Añade parámetro
   *
   * @param {string} key
   * @param {*} value
   * @memberof UrlParamsService
   */
  public addParam(key: string, value: any) {
    this.params[key] = value;
  }

}
