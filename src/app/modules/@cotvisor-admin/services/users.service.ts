import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { Subject } from 'rxjs/Subject';
import { UserModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

@Injectable()
export class UsersService extends ParentAdminService {

  // lista local del servicio que guarda los usuarios recuperados
  private users: UserModel[] = [];
  // Subject de usuarios
  private usersSubject = new Subject<UserModel[]>();
  // Observable de usuarios que notificará los cambios en la lista de usuarios
  public users$ = this.usersSubject.asObservable();

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor() {
    super();
  }

  /**
   * Obtiene todos los usuarios
   *
   * @returns {Observable<UserModel[]>}
   * @memberof UsersService
   */
  public getAll() {

    const op = 'Obtener todos los usuarios';
    this.httpClient
      .get<UserModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI.endpoints.users)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      )
      .subscribe(
        (users) => {
          this.users = users;
          this.usersSubject.next(this.users);
        },
      );
  }

  /**
   * Obtiene un usuario por su id
   *
   * @param {number} userId
   * @returns {Observable<UserModel>}
   * @memberof UsersService
   */

  public get(userId: number): Observable<UserModel> {
    // TODO obtener respuesta del modelo de usuario

    const op = 'Obtener usuario con id ' + userId;

    return this.httpClient.get<UserModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}/${userId}`, this.httpOptions)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );

  }

  /**
   * Actualiza los datos del usuario
   *
   * @param {UserModel} user
   * @returns {Observable<UserModel>}
   * @memberof UsersService
   */
  public update(user: UserModel): Observable<UserModel> {

    const op = 'Actualizar usuario';
    const userWithoutSocialObject = Object.assign({}, user as any);
    if (user.socialUser) {
      userWithoutSocialObject.socialUser = user.socialUser.id;
    }
    return this.httpClient.put<UserModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}`, userWithoutSocialObject, this.httpOptions)
      .pipe(
        tap((updatedUser) => {
          this.updateUsers(updatedUser);
          this.usersSubject.next(this.users);
        },
        ),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject),
        ),
      );
  }

  /**
   * Crea el usuario
   *
   * @param {UserModel} user
   * @returns {Observable<LoginResponse>}
   * @memberof UsersService
   */
  public create(user: UserModel): Observable<UserModel> {

    const op = 'Crear usuario';
    user.profileProvider = 'LOCAL';
    user.socialUser = null;
    // user.roles.push('USUARIO');

    return this.httpClient.post<UserModel>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}`, user, this.httpOptions)
      .pipe(
        tap((newUser: UserModel) => {
          this.users = [...this.users, newUser]; // better not to mutate
          this.usersSubject.next(this.users);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  /**
   * Manda una petición para que envie un email al usuario con el link para restaurar la contraseña
   *
   * @param {string} email
   * @returns {Observable<any>}
   * @memberof UsersService
   */
  public restorePassword(email: string): Observable<any> {

    const op = 'Solicitar restaurar contraseña de usuario';

    return this.httpClient.post<any>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}/restorePassword`, { email }, this.httpOptions)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  /**
   * Actualiza la contraseña del usuario especificado por id al valor pasado como parámetro
   *
   * @param {number} userId
   * @param {string} password
   * @returns {Observable<any>}
   * @memberof UsersService
   */
  public updatePassword(userId: number, password: string): Observable<any> {

    const op = 'Solicitar restaurar contraseña de usuario';

    return this.httpClient.put<any>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}/${userId}/password`, { password }, this.httpOptions)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  /**
   * Elimina el usuario
   *
   * @param {number} userId
   * @returns {Promise<void>}
   * @memberof UsersService
   */
  public delete(userId: number): Observable<void> {

    const op = 'Eliminar usuario ' + userId;

    return this.httpClient.delete<void>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}/${userId}`).pipe(
      tap(() => {
        Utilities.removeElementByKeyFromArray(this.users, 'id', userId);
        this.usersSubject.next(this.users);
      }),
      catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
    );
  }

  /**
   * Valida que el email recibido no exista contra la BBDD
   *
   * @param {string} userName
   * @returns {Observable<{ valid: boolean }>}
   * @memberof UsersService
   */
  public checkUserName(userName: string): Observable<{ valid: boolean }> {

    const op = 'Comprobar nombre de usuario ' + userName;

    return this.httpClient.get<{ valid: boolean }>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}/validusername/${userName}`)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)));
  }

  /**
   * Valida que el email recibido no exista contra la BBDD
   *
   * @param {string} email
   * @returns {Observable<{ valid: boolean }>}
   * @memberof UsersService
   */
  public checkEmail(email: string): Observable<{ valid: boolean }> {

    const op = 'Comprobar email ' + email;

    return this.httpClient.post<{ valid: boolean }>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.users}/validemail`, { email })
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)));
  }

  /**
   * Modifica el usuario en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {UserModel} newUser
   * @memberof UsersService
   */
  private updateUsers(newUser: UserModel) {
    // busamos la posición del ususario por ID
    const userPos = this.users.map((user) => user.id).indexOf(newUser.id);
    // reemplazamos en el array el usuario
    this.users.splice(userPos, 1, newUser);
  }

}
