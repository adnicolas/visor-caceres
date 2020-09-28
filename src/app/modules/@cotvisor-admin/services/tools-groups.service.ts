import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { Subject } from 'rxjs/Subject';
import { ToolModel, ToolsGroupModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

// TODO añadir observable loading$
@Injectable({ providedIn: 'root' })
export class ToolsGroupsService extends ParentAdminService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // lista local del servicio que guarda los toolGroups recuperados
  private toolGroups: ToolsGroupModel[] = [];
  private tools: ToolModel[] = [];
  // Subject de toolGroups
  private toolGroupsSubject = new Subject<ToolsGroupModel[]>();
  private toolsSubject = new Subject<ToolModel[]>();
  // Observable de toolGroups que notificará los cambios en la lista de toolGroups
  public toolGroups$ = this.toolGroupsSubject.asObservable();
  public tools$ = this.toolsSubject.asObservable();

  constructor() {
    super();
  }

  /**
   * Obtiene todos los toolGroups
   *
   * @memberof ToolsGroupsService
   */
  public getAll() {

    const op = 'Obtener todos los toolsGroups';

    this.httpClient.get<ToolsGroupModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI
      .endpoints.toolsGroups)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (toolGroups: ToolsGroupModel[]) => {
          this.toolGroups = toolGroups;
          this.toolGroupsSubject.next(this.toolGroups);
        },
      );
  }

  // TODO - change to subject?
  public get(toolGroupId: number): Observable<ToolsGroupModel> {

    const OP = 'obtener mapa ' + toolGroupId;

    return this.httpClient
      .get<ToolsGroupModel>(
        `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.toolsGroups}/${toolGroupId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, OP)),
      );

  }

  /**
   * Crea el toolsgroup
   *
   * @param {ToolsGroupModel} toolsGroup
   * @returns {Observable<LoginResponse>}
   * @memberof toolsGroupsService
   */
  public create(toolsGroup: ToolsGroupModel): Observable<ToolsGroupModel> {

    const op = 'Crear ToolsGroup';

    return this.httpClient.post<ToolsGroupModel>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.toolsGroups}`, toolsGroup, this.httpOptions)
      .pipe(
        tap((newToolsGroup: ToolsGroupModel) => {
          this.toolGroups = [...this.toolGroups, newToolsGroup]; // better not to mutate
          this.toolGroupsSubject.next(this.toolGroups);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  public getTools() {
    const op = 'Obtener todos los tools';

    this.httpClient.get<ToolModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.tools}`,
      this.httpOptions)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (tools: ToolModel[]) => {
          this.tools = tools;
          this.toolsSubject.next(this.tools);
        },
      );
  }

  /**
   * Guarda los datos del toolsGroup
   *
   * @param {ToolsGroupModel} toolsGroup
   * @returns {Observable<toolsGroupModel>}
   * @memberof toolsGroupsService
   */
  public save(toolsGroup: ToolsGroupModel): Observable<ToolsGroupModel> {

    const op = 'Salvar toolsGroup';

    return this.httpClient.put<ToolsGroupModel>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.toolsGroups}`, toolsGroup, this.httpOptions)
      .pipe(
        tap((toolsGroups) => {
          this.updatetoolsGroups(toolsGroups);
          this.toolGroupsSubject.next(this.toolGroups);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  public delete(id: number): Observable<any> {

    const op = 'Eliminar toolgroup ' + id;

    return this.httpClient.delete(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.toolsGroups}/${id}`)
      .pipe(
        tap((group: ToolsGroupModel) => {
          Utilities.removeElementByKeyFromArray(this.toolGroups, 'id', id);
          this.toolGroupsSubject.next(this.toolGroups);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  /**
   * Modifica el toolsGroup en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {toolsGroupModel} newtoolsGroup
   * @memberof toolsGroupService
   */
  private updatetoolsGroups(newtoolsGroup: ToolsGroupModel) {
    // busamos la posición del toolsGroup por ID
    const toolsGroupPos = this.toolGroups.map((toolsGroup) => toolsGroup.id)
      .indexOf(newtoolsGroup.id);
    // reemplazamos en el array el toolsGroup
    this.toolGroups.splice(toolsGroupPos, 1, newtoolsGroup);
  }

}
