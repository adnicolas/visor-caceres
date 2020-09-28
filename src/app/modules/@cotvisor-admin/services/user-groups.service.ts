import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { UserGroupModel } from '@cotvisor-admin/models';

@Injectable({ providedIn: 'root' })
export class UserGroupsService extends ParentAdminService {

  // lista local del servicio que guarda los userGroups recuperados
  private userGroups: UserGroupModel[] = [];
  // Subjects de userGroups
  private userGroupsSubject = new Subject<UserGroupModel[]>();
  // Observables que notificarán los cambios en la lista de userGroups
  public userGroups$ = this.userGroupsSubject.asObservable();

  // lista local del servicio que guarda los userGroups recuperados
  // private userGroup: UserGroupModel;
  // Subjects de userGroups
  private userGroupSubject = new Subject<UserGroupModel>();
  // Observables que notificarán los cambios en la lista de userGroups
  public userGroup$ = this.userGroupSubject.asObservable();

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor() {
    super();
  }

  /**
   * Obtiene un grupo por su id
   *
   * @param {number} groupId
   * @returns {Observable<UserGroupModel>}
   * @memberof UserGroupsService
   */

  public get(groupId: number): Observable<UserGroupModel> {
    // TODO obtener respuesta del modelo de grupo de usuarios

    const op = 'Obtener grupo de usuarios con id ' + groupId;
    // this.notifyLoading(true);
    return this.httpClient.get<UserGroupModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.groups}/${groupId}`, this.httpOptions)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      )/*.subscribe(
        (userGroup) => {
          this.userGroup = userGroup;
          this.notifyLoading(false);
          this.userGroupSubject.next(this.userGroup);

        },
      )*/;

  }

  /**
   * Obtiene todos los userGroups de todos los usuarios
   *
   * @returns {Observable<UserGroupModel[]>}
   * @memberof userGroupsService
   */
  public getAll() {

    const op = 'Obtener todos los userGroups';
    this.notifyLoading(true);

    this.httpClient.get<UserGroupModel[]>(`${environment.apis.geospatialAPI.baseUrl}${environment.apis.geospatialAPI.endpoints.groups}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      )
      .subscribe(
        (userGroups) => {
          this.userGroups = userGroups;
          this.notifyLoading(false);
          this.userGroupsSubject.next(this.userGroups);

        },
      );
  }

  public create(userGroup: UserGroupModel) {
    const op = 'crear userGroup';
    this.notifyLoading(true);
    return this.httpClient.post<UserGroupModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.groups}`, userGroup)
      .pipe(
        tap((newUserGroup) => {
          this.userGroups = [...this.userGroups, newUserGroup];
          this.userGroupsSubject.next(this.userGroups);
          this.notifyLoading(false);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject),
        ),
      );
  }

  /**
   * Obtiene todos los userGroups de un usuario
   *
   * @memberof userGroupsService
   */
  public getForUser(userId: number) {

    const op = 'Obtener todos los userGroups de un usuario';
    this.notifyLoading(true);
    return this.httpClient.get<UserGroupModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.groups}?userid=${userId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      ).subscribe(
        (userGroups) => {
          this.userGroups = userGroups;
          this.userGroupsSubject.next(this.userGroups);
          this.notifyLoading(false);
        },
      );
  }


  /**
   * Actualiza los datos del userGroup
   *
   * @param {userGroupModel} userGroup
   * @returns {Observable<userGroupModel>}
   * @memberof userGroupsService
   */
  public update(userGroup: UserGroupModel): Observable<UserGroupModel> {

    const op = 'actualizar userGroups';

    return this.httpClient.put<UserGroupModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.groups}`, userGroup)
      .pipe(
        tap((newUserGroup) => {
          this.updateUserGroups(newUserGroup);
          this.userGroupsSubject.next(this.userGroups);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject),
        ),
      );
  }

  /**
   * Elimina el userGroup
   * @param {number} userGroupId
   * @returns {Promise<void>}
   * @memberof layersService
   */
  public delete(userGroupId: number): Observable<void> {

    const op = 'Eliminar userGroup ' + userGroupId;

    return this.httpClient.delete<void>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.groups}/${userGroupId}`)
      .pipe(
        tap(() => {
          // encontrar userGroupId en el array
          const userGroupPos = this.userGroups.map((userGroup) => userGroup.id).indexOf(userGroupId);
          // quitar del array
          this.userGroups.splice(userGroupPos, 1);
          this.userGroupsSubject.next(this.userGroups);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  /**
   * Modifica el map en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {userGroupModel} newuserGroup
   * @memberof userGroupService
   */
  private updateUserGroups(newuserGroup: UserGroupModel) {
    // busamos la posición del userGroup por ID
    const userGroupPos = this.userGroups.map((userGroup) => userGroup.id).indexOf(newuserGroup.id);
    // reemplazamos en el array el userGroup
    this.userGroups.splice(userGroupPos, 1, newuserGroup);
  }
}
