import { Injectable } from '@angular/core';
import { JsonCacheService } from './json-cache.service';
import { UrlParamsService } from './url-params.service';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que obtiene la configuración de un componente
 * @param  {Http}             privatehttp             Servicio para obtener el json de configuracion
 * @return {[type]}                                   [description]
 */
export class ConfigModuleService {

  public urlParams: any;
  private urlPrefix: string;
  private urlSuffix: string;
  private type: string;

  constructor(private httpClient: HttpClient, private urlParamsService: UrlParamsService, private cacheService: JsonCacheService) {
    this.urlParams = this.urlParamsService.getParams();

  }

  /**
   * Obtiene la configuración del módulo desde  JSON
   * @param  {string} className Npombre de la clase del componente
   * @return {object}           Objeto Json con la configuracion recibida
   * @todo Sustituir los parámetros leídos por los parametros de URL si existen
   */

  public getModuleConfig(className): Observable<any> {
    this.urlPrefix = environment.config_module.prefix;
    this.urlSuffix = environment.config_module.suffix;
    this.type = 'config';
    const cache = this.cacheService.getFromCache(className, this.constructor.name, this.type);
    if (cache) {
      return of(cache);
    } else {
      const url = `${this.urlPrefix}${className}${this.urlSuffix}`;
      return this.httpClient.get(url)
        .pipe(
          tap((config) => {
            this.cacheService.addToCache(className, this.constructor.name, this.type, config);
          })
        );

    }
  }
}
