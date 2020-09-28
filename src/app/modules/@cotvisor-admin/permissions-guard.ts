import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GlobalAuthService } from './services/global-auth.service';
/**
 * Guard que se activa cuando hay usuario logado
 *
 * @export
 * @class PermissionsGuard
 * @implements {CanActivate}
 */
@Injectable({ providedIn: 'root' })
export class PermissionsGuard implements CanActivate {


  constructor(private globalAuthService: GlobalAuthService, private router: Router) {

  }

  /**
   * Implementación de método canActivate de la interface CanActivate
   *
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<boolean>} Observable que resuelve a true o false para indicar si se puede cargar la ruta
   * @memberof AuthGuard
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authenticated = this.globalAuthService.isAuthenticated();
    if (authenticated) {
      const currentUser = this.globalAuthService.getCurrentUser();
      if (route.data && route.data.permissions) {
        const permissions = route.data.permissions as Array<string>;
        for (const rol of currentUser.roles) {
          if (rol.permissions.filter(permission => permissions.includes(permission.name)).length > 0) {
            return true;
          }
        }
      } else {
        return true;
      }
    } else {
      this.router.navigate([environment.pages.login], { queryParams: { return: window.location.pathname + window.location.search } });
    }
    return false;
  }
}
