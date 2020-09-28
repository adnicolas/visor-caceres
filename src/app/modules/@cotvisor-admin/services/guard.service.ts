import { Injectable } from '@angular/core';
import { Permissions } from '@cotvisor-admin/classes';
import { UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService } from './global-auth.service';

@Injectable()
export class GuardService {

  private loggedUser: UserModel;

  constructor(
    private globalAuthService: GlobalAuthService,
  ) {
    this.globalAuthService.authState$.subscribe((user) => {
      this.loggedUser = user;
    });
  }

  /**
   * Compara el id del usuario validado con el id del parámetro
   *
   * @param {number} userId
   * @returns {boolean}
   * @memberof GuardService
   */
  public checkIsThisUser(userId: number): boolean {
    return this.loggedUser.id === userId;

  }

  /**
   * Valida si el usaurio está logado. Si no lo está abre la pagina de login y tras el
   * login retorna al returnPage pasando el returnParams
   *
   * @param {(string | ViewController)} returnPage
   * @param {*} returnParams
   * @returns {Promise<boolean>}
   * @memberof GuardService
   */
  public checklogged(): Promise<boolean> {

    return new Promise((resolve, reject) => {
      try {
        if (this.globalAuthService.isAuthenticated()) {
          resolve(true);
        } else {
          setTimeout(() => {
            // TODO navegar a login
            // this.app.getActiveNav().push('login', { returnPage, returnParams });
          });
          resolve(false);
        }
      } catch (e) {
        reject(false);
      }
    });

  }

  public checkPermissions(permisions: string[], userToAccessId?: number, returnPage?: string, returnParams?: any): Promise<boolean> {

    return new Promise((resolve) => {
      // Si no hay permisos para validar se resuelve la promesa
      if (permisions.length === 0) {
        resolve(true);
      } else {
        this.checklogged()
          // si está logado se validan los permisos
          .then(
            (logged) => {
              if (logged) {
                if (this.validatePermissions(permisions, userToAccessId)) {
                  resolve(true);
                } else {
                  // redireccionar a pagina de error con mesaje de no autorizado

                  setTimeout(() => {
                    // TODO navegar a error
                    // const error = ErrorLevels.ERROR;
                    // this.app.getActiveNav().push('error',                                            { errorTitle: 'No Autorizado', errorText: 'Acceso no Autorizado', errorType: error });
                  });
                  resolve(false);
                }
              } else {
                resolve(false);
              }
            },
          )
          // Error en el  login
          .catch((_) => {
            resolve(false);
          });
      }
    });

  }

  /**
   * Valida los permisos recibidos, devuelve true cuando uno de los permisos se encuentra en el usuario
   *
   * @private
   * @param {string[]} permisions Permisos a validar
   * @param {number} [userToAccessId]
   * @returns {boolean} true cuando uno de los permisos se encuentra en el usuario
   * @memberof GuardService
   */

  private validatePermissions(permisions: string[], userToAccessId?: number): boolean {

    return permisions.some((permision) => {
      for (const rol of this.loggedUser.roles) {
        return rol.permissions.some((userPermission) => {
          // el permiso SELF valida si el id recibido es el mismo que el del usuario logado
          if (permision === Permissions.SELFMANAGER) {
            return this.checkIsThisUser(userToAccessId);
          } else {
            return userPermission.name === permision;
          }
        });
      }
    });

  }

}
