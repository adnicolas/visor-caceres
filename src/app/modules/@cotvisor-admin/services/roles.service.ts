import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { map, catchError } from 'rxjs/operators';
import { RoleModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class RolesService extends ParentAdminService {

  private roles: RoleModel[] = [];
  private rolesSubject = new Subject<RoleModel[]>();
  public roles$ = this.rolesSubject.asObservable();

  private rol: RoleModel;
  private rolSubject = new Subject<RoleModel>();
  public rol$ = this.rolSubject.asObservable();

  constructor(
  ) {
    super();
  }

  public getAll(): void {

    const op = 'obtener roles';
    this.notifyLoading(true);
    this.httpClient
      .get<RoleModel[]>(this.BACKENDURL + environment.apis.geospatialAPI.endpoints.roles)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe((roles) => {
        this.roles = roles;
        this.rolesSubject.next(this.roles);
        this.notifyLoading(false);
      });
  }

  public get(roleId: number): void {

    const op = `obtener rol con id->${roleId}`;
    this.notifyLoading(true);
    this.httpClient
      .get<RoleModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.roles}/${roleId}`)
      .pipe(
        map((rol) => {
          this.rol = rol;
          this.rolSubject.next(this.rol);
          this.notifyLoading(false);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)));
  }
  // TODO implementar
  public save(role: RoleModel): Observable<RoleModel> {
    return Observable.of(role);
  }
  /**
   *
   *
   *
   * @param {number} roleId
   * @returns {Promise<void>}
   *
   * @memberOf RolesService
   */
  // TODO implementar
  public delete(roleId: number): Promise<void> {

    const op = `Eliminar Rol con id->${roleId}`;

    return this.httpClient.delete(this.BACKENDURL + environment.apis.geospatialAPI.endpoints.roles)
      .toPromise()
      .then(() => null)
      .catch(catchError(error => this.servicesErrorManager.handleError(error, op)));
  }


}
