import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
/**
 * Servicio interceptor http
 * 
 * Inyecta el token para las peticiones necesarias
 * 
 * @export
 * @class Interceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
        return httpHandler.handle(request);
    }
}
