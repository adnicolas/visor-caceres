import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GlobalAuthService } from './global-auth.service';
import { environment } from 'src/environments/environment';

/**
 * Servicio que intercepta peticiones e inyecta el token del visor
 * cuando las peticiones se hacen al backend del visor
 *
 * @export
 * @class TokenInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class VisorAdminInterceptor implements HttpInterceptor {

  constructor(private globalAuthService: GlobalAuthService) { }

  public intercept(request: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    // Inyecta token cuando las peticiones son al backend del visor
    if (request.url.startsWith(environment.apis.geospatialAPI.baseUrl)) {
      const token = this.globalAuthService.getToken();
      let authRequest;
      if (token) {
        authRequest = request.clone({
          headers: request.headers.set('Authorization', token),
        });
      } else {
        authRequest = request.clone({});
      }
      return httpHandler.handle(authRequest);
    } else {
      return httpHandler.handle(request);
    }

  }
}
