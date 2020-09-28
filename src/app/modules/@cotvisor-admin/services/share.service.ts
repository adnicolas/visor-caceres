import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { PermissionResourceModel } from '@cotvisor-admin/models';
import { IShare } from '@cotvisor-admin/modules/share/share-options.component';
import { Subject } from 'rxjs/Subject';

@Injectable({ providedIn: 'root' })
export class ShareService extends ParentAdminService {
  private permissionsResources: PermissionResourceModel[] = [];
  private permissionsResourcesSubject = new Subject<PermissionResourceModel[]>();
  public permissionsResources$ = this.permissionsResourcesSubject.asObservable();

  private permissionsResourcesResponse: string = '';
  private permissionsResourcesResponseSubject = new Subject<string>();
  public permissionsResourcesResponse$ = this.permissionsResourcesResponseSubject.asObservable();

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor() {
    super();
  }
  public shareResource(shareInfo: IShare) {
    const op = 'Compartir recurso';
    this.notifyLoading(true);
    // TODO @ADR: Hacer la petición así no tiene ningún sentido, solicitar que se pase como menje
    // http://geospatialsaitest.grupotecopy.es/geospatialsaiback/permissionsresources?
    // permissionIds=9&resourceId=5&resourceType=LAYER&subjectIds=9&subjectIds=11&subjectIds=12&subjectIds=1&subjectTypes=USER&subjectTypes=USER&subjectTypes=USER&subjectTypes=GROUP
    let urlRequest = this.BACKENDURL + environment.apis.geospatialAPI.endpoints.permissionsResources + '?';
    shareInfo.subjectIds.forEach(subjectId => {
      urlRequest += `subjectIds=${subjectId}&`;
    });
    shareInfo.subjectTypes.forEach(subjectType => {
      urlRequest += `subjectTypes=${subjectType}&`;
    });
    urlRequest += `resourceId=${shareInfo.resourceId}&`;
    urlRequest += `resourceType=${shareInfo.resourceType}&`;
    shareInfo.permissionIds.forEach(permissionId => {
      urlRequest += `permissionIds=${permissionId}`;
    });
    return this.httpClient.post(urlRequest, {}, {
      responseType: 'text' as 'text'
    })
      .pipe(
        tap((resp) => {
          this.notifyLoading(false);
          this.permissionsResourcesResponse = resp;
          this.permissionsResourcesResponseSubject.next(this.permissionsResourcesResponse);
          // this.getPermissionsResourcesByResourceId(iShare.resourceId.toString());
          // return resp;
          // this.permissionsResourcesResponseSubject.next(this.permissionsResourcesResponse);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject))
      );
  }

  public deleteResource(shareInfo: IShare) {

  }

  public getPermissionsResourcesByResourceId(resourceId: string) {
    const op = 'obtener los permisos para el recurso especificado';
    this.notifyLoading(true);
    return this.httpClient
      // Mientras llega el resourceTpye
      .get<PermissionResourceModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.permissionsResources}/resource/${resourceId}`)
      // .get<PermissionResourceModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.permissionsResources}`)
      .pipe(
        catchError(error => this.servicesErrorManager.handleError(error, op))
      ).subscribe(
        (permissionsResources) => {
          this.permissionsResources = permissionsResources;
          this.permissionsResourcesSubject.next(this.permissionsResources);
          this.notifyLoading(false);
        }
      );
  }
}
