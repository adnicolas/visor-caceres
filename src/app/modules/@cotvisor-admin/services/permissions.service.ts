import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { catchError } from 'rxjs/operators';
import { PermissionModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionsService extends ParentAdminService {

  /*private resourcePermissions: PermissionModel[] = [];
  private resourcePermissionsSubject = new Subject<PermissionModel[]>();
  public resourcePermissions$ = this.resourcePermissionsSubject.asObservable();

  private appPermissions: PermissionModel[] = [];
  private appPermissionsSubject = new Subject<PermissionModel[]>();
  public appPermissions$ = this.appPermissionsSubject.asObservable();*/

  private permissions: PermissionModel[] = [];
  private permissionsSubject = new Subject<PermissionModel[]>();
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(
  ) {
    super();
  }

  /*public getResourcePermissions() {

      const op = 'obtener permisos de tipo resource';
      this.notifyLoading(true);
      this.httpClient
          // .get<PermissionModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.permissions}?type=RESOURCE`)
          .get<PermissionModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.permissions}`)
          .pipe(
              catchError(error => this.servicesErrorManager.handleError(error, op))
          ).subscribe(
              (permissions) => {
                  this.resourcePermissions = permissions;
                  this.resourcePermissionsSubject.next(this.resourcePermissions);
                  this.notifyLoading(false);
              }
          );
  }

  public getAppPermissions() {

      const op = 'obtener permisos de tipo app';
      this.notifyLoading(true);
      this.httpClient
          .get<PermissionModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.permissions}?type=APP`)
          .pipe(
              catchError(error => this.servicesErrorManager.handleError(error, op))
          ).subscribe(
              (permission) => {
                  this.appPermissions = permission;
                  this.appPermissionsSubject.next(this.appPermissions);
                  this.notifyLoading(false);
              }
          );
  }*/

  public getAll() {
    const op = 'obtener todos los permisos';
    this.notifyLoading(true);
    return this.httpClient
      .get<PermissionModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.permissions}`)
      .pipe(
        catchError(error => this.servicesErrorManager.handleError(error, op))
      ).subscribe(
        (permissions) => {
          this.permissions = permissions;
          this.permissionsSubject.next(this.permissions);
          this.notifyLoading(false);
        }
      );
  }




}
