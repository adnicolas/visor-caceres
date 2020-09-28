import { Injectable } from '@angular/core';
import {
  SocialUser,
} from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { LoginResponse } from '@cotvisor-admin/classes/login-response.class';
import { environment } from 'src/environments/environment';
import { ToastService } from '@theme/services/toast.service';


@Injectable({ providedIn: 'root' })
export class GlobalAuthService extends ParentAdminService {

  private loggedUser: UserModel = null;
  private token: string;

  // Observable cambios en el usuario autorizado
  private authStateSource = new BehaviorSubject<UserModel>(null);
  public authState$: Observable<UserModel>;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private timeOutRefresh: any;

  constructor(
    private toastService: ToastService
  ) {
    super();
    this.checkLocalStorageUser();

    this.authState$ = this.authStateSource.asObservable();

  }

  /**
   * Valida si el usuario validado tiene el rol buscado. Si no hay usuario logado retorna falso
   *
   * @param {string} role
   * @returns
   * @memberof GlobalAuthService
   */
  public loggedUserHasRole(role: string) {

    if (this.loggedUser) {
      return this.loggedUser.roles.find(rol => rol.name === role);
    }
    return false;
  }

  /**
   * Valida si el usuario logado tiene un permiso. Si no hay usuario logado retorna falso
   *
   * @param {string} permission
   * @returns
   * @memberof GlobalAuthService
   */
  public loggedUserHasPermission(permission: string) {

    if (this.loggedUser) {
      // tslint:disable-next-line:prefer-for-of
      for (const rol of this.loggedUser.roles) {
        for (const permiso of rol.permissions) {
          if (permiso.name === permission) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Valida si hay un usuario logado.
   * Puede recibir un mensaje,para mostrar si el usuario no está logado,
   *
   * @returns {boolean}
   * @memberof GlobalAuthService
   */
  public isAuthenticated(noUserLoggedMsg?: string): boolean {
    const flagUserLogged = this.loggedUser !== null;
    if (!flagUserLogged && noUserLoggedMsg) {
      this.toastService.showError({ detail: 'Login', summary: noUserLoggedMsg });
    }

    return flagUserLogged;
  }

  /**
   * Retorna el usuario logado
   *
   * @returns {UserModel}
   * @memberof GlobalAuthService
   */
  public getCurrentUser(): UserModel {

    return this.loggedUser;

  }

  /**
   *  Registra el usuario en el sistema
   *
   * @param {UserModel} loggedUser
   * @memberof GlobalAuthService
   */
  public register(loggedUser: UserModel) {
    // llamar al sevicio de registro
    this.authStateSource.next(loggedUser);
  }

  /**
   * Retorna el token de la sesion del usuario
   *
   * @returns
   * @memberof GlobalAuthService
   */
  public getToken() {
    return this.token;
  }

  /**
   * Asigna el token de la sesion del usuario
   *
   * @returns
   * @memberof GlobalAuthService
   */
  public setToken(token: string) {
    this.token = token;
  }

  /**
   * Realiza el intento de login del usuario por email y contraseña
   *
   * @param {string} email
   * @param {string} password
   * @memberof GlobalAuthService
   */
  public logIn(email: string, password: string): Promise<LoginResponse> {

    const op = 'acceso de usuario ';

    const httpBody = {
      email,
      password,
    };

    return this.httpClient.post<LoginResponse>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.login}`, httpBody, this.httpOptions)

      .pipe(
        tap((loginResponse) => {
          this.setLogIn(loginResponse.token, loginResponse.user);
          window.localStorage.setItem('authUser', JSON.stringify({ token: this.token, user: this.loggedUser }));
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .toPromise();

  }



  /**
   * Cancela el login del usuario actual deslogando de la red social correspondiente y eliminando el token
   *
   * @memberof GlobalAuthService
   */
  public logOut() {

    // Elimino de locastorage
    window.localStorage.removeItem('authUser');
    if (this.timeOutRefresh) {
      clearTimeout(this.timeOutRefresh);
      this.timeOutRefresh = null;
    }
    this.loggedUser = null;
    this.token = null;
    this.authStateSource.next(null);
  }

  /**
   * Realiza el login con un usuario de una red social,
   * en el primer login crea la cuenta local y la devuelve como perfil del usuario
   * Si la cuenta ya está creada, a partir del usuario social, se realiza el login del
   * usuario local y se actualiza el proveedor usado
   *
   * @memberof GlobalAuthService
   */
  public logInSocialUser(socialUser: SocialUser) {

    const op = 'Login usuario social';

    const localUser = new UserModel();
    localUser.email = socialUser.email;
    localUser.userName = socialUser.name;
    localUser.profileProvider = socialUser.provider;
    localUser.socialUser = socialUser;

    const paramUser = {
      email: socialUser.email,
      userName: socialUser.name,
      profileProvider: socialUser.provider,
      socialUser: localUser.socialUser.id,
    };

    const httpBody = {
      token: socialUser.provider.toLowerCase() === 'google' ? socialUser.idToken : socialUser.authToken,
      user: paramUser,
    };

    return this.httpClient.post<LoginResponse>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.login}/social`, httpBody, this.httpOptions)
      .pipe(
        tap((loginResponse) => {
          this.setLogIn(loginResponse.token, loginResponse.user);
          window.localStorage.setItem('authUser', JSON.stringify({ token: this.token, user: this.loggedUser }));
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .toPromise();

  }

  public getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  public isTokenExpired(token: string): boolean {
    if (!token) { return true; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }

  private refreshToken(): Promise<LoginResponse> {

    const op = 'refrescar login';

    return this.httpClient.get<LoginResponse | any>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.login}/refresh`)
      .pipe(
        tap((loginResponse) => {
          this.token = loginResponse.token;
          window.localStorage.setItem('authUser', JSON.stringify({ token: this.token, user: this.loggedUser }));
          this.setRefreshTimeout();
        })
        ,
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .toPromise();

  }

  private setLogIn(token: string, userLogged: UserModel) {
    this.token = token;
    this.loggedUser = userLogged;
    this.authStateSource.next(this.loggedUser);
    // Hago un settimeout para refrescar el token 2 minutos antes de que acabe
    this.setRefreshTimeout();
  }

  private setRefreshTimeout() {
    if (this.timeOutRefresh) {
      clearTimeout(this.timeOutRefresh);
      this.timeOutRefresh = null;
    }
    if (!this.isTokenExpired(this.token)) {
      // Hago un settimeout para refrescar el token 2 minutos antes de que acabe
      const expToken = this.getTokenExpirationDate(this.token);
      const now = new Date();
      const refreshTime = Math.max((expToken.getTime() - now.getTime() - 120000), 120000);
      this.timeOutRefresh = setTimeout(() => this.refreshToken(), refreshTime);
    }
  }

  private checkLocalStorageUser() {
    const authUser: { token: string, user: UserModel } = JSON.parse(window.localStorage.getItem('authUser'));
    if (authUser) {
      if (this.isTokenExpired(authUser.token)) {
        window.localStorage.removeItem('authUser');
      } else {
        this.setLogIn(authUser.token, authUser.user);
      }
    }
  }


  /**
   *
   *
   * @param {*} e
   * @memberof GlobalAuthService
   */
  public loginError(e: any) {
    this.toastService.showError({ detail: e, summary: 'Error en login' });
  }

}

// const userLoggedDummy: UserModel = {
//     id: 1,
//     userName: 'Admin',
//     email: 'admin@ideex.es',
//     disabled: false,
//     profileProvider: 'LOCAL',
//     password: '',
//     role: {
//         id: 3,
//         name: 'ADMINISTRADOR',
//         permissions: [
//             {
//                 id: 8,
//                 name: 'SELFMANAGER',
//                 description: 'Gestion de los datos propios del usuario'
//             },
//             {
//                 id: 1,
//                 name: 'USERMANAGER',
//                 description: 'Gestión de usuarios'
//             },
//             {
//                 id: 2,
//                 name: 'MAPMANAGER',
//                 description: 'Gestión de mapas de otros usuarios'
//             },
//             {
//                 id: 3,
//                 name: 'LAYERMANAGER',
//                 description: 'Gestión de capas, etiquetas categorías y servicios'
//             },
//             {
//                 id: 4,
//                 name: 'VIEWCONFIGMANAGER',
//                 description: 'Gestión de configuraciones de visor'
//             }
//         ]
//     },
//     socialUser: null
// };
