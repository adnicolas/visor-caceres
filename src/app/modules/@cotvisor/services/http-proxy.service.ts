import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para cachear los json obtenidos en otros servicios, de forma que no haya que pedirlo remotamente
 * @return {[type]} [description]
 */
export class HttpProxyService {

  constructor(private _http: HttpClient) {
  }

  public proxyfyURL(url: string): string {
    return Utilities.proxyfyURL(url);
  }

  public get<T>(url: string, options?: any): Observable<any> {
    return this._http.get<T>(this.proxyfyURL(url), options);
  }

  public getJsonp(url: string): Observable<any> {
    return this._http.jsonp(url, 'callback');
  }

  public post(url: string, body: any, options?: any): Observable<any> {
    return this._http.post(this.proxyfyURL(url), body, options);
  }

}
