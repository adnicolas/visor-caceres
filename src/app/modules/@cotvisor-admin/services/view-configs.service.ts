import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap, map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ViewConfigModel } from '@cotvisor-admin/models/view-configs.model';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

@Injectable({ providedIn: 'root' })
export class ViewConfigsService extends ParentAdminService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // lista local del servicio que guarda los views recuperados
  private views: ViewConfigModel[] = [];
  // private viewConfig: ViewConfigModel;
  // Subject de views
  private viewsSubject = new Subject<ViewConfigModel[]>();
  // current viewConfig
  private currentViewSubject = new Subject<ViewConfigModel>();
  // Observables de views que notificará los cambios en la lista de views/ view actual
  public views$ = this.viewsSubject.asObservable();
  public currentView$ = this.currentViewSubject.asObservable();
  // Count subjects
  public viewConfigsCountSubject = new Subject<number>();
  // Count observables
  public viewConfigsCount$ = this.viewConfigsCountSubject.asObservable();

  constructor() {
    super();
  }

  /**
   * Obtiene todos los views
   *
   * @returns {Observable<ViewConfigModel[]>}
   * @memberof ViewConfigsService
   */
  public getAll() {
    const op = 'Obtener todos los views';
    this.notifyLoading(true);
    this.httpClient
      .get<ViewConfigModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI.endpoints.views)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe((views) => {
        this.views = views;
        this.viewConfigsCountSubject.next(this.views.length);
        this.viewsSubject.next(this.views);
        this.notifyLoading(false);
      });
  }

  /**
   * Obtiene un view por su id
   *
   * @param {number} viewId
   * @returns {Observable<ViewConfigModel>}
   * @memberof ViewConfigsService
   */

  public get(viewId: number): Observable<ViewConfigModel> {
    const op = 'Obtener view con id ' + viewId;
    this.notifyLoading(true);
    /*this.httpClient
      .get<ViewConfigModel>(
        `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.views}/${viewId}`,
        this.httpOptions
      )
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op)))
      .subscribe((viewConfig: ViewConfigModel) => {
        this.viewConfig = viewConfig;
        this.currentViewSubject.next(this.viewConfig)
      });*/
    return this.httpClient
      .get<ViewConfigModel>(
        `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.views}/${viewId}`,
        this.httpOptions
      )
      .pipe(
        map((viewConfigModel) => {
          this.currentViewSubject.next(viewConfigModel);
          this.notifyLoading(false);
          return viewConfigModel;
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)));
  }

  /**
   * Obtiene la configuracion de visor por defecto
   *
   * @returns {Observable<ViewConfigModel>}
   * @memberof ViewConfigsService
   */
  public getDefault(): Observable<ViewConfigModel> {
    const op = 'Obtener visor por defecto';
    this.notifyLoading(true);
    return this.httpClient
      .get<ViewConfigModel>(
        `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.views}/default`,
        this.httpOptions
      )
      .pipe(map((viewConfigModel) => {
        this.notifyLoading(false);
        return viewConfigModel;
      }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)));
  }

  /**
   * Guarda los datos del viewConfig
   *
   * @param {ViewConfigModel} viewConfig
   * @returns {Observable<ViewConfigModel>}
   * @memberof ViewConfigsService
   */
  public save(viewConfig: ViewConfigModel): Observable<ViewConfigModel> {
    const op = 'Salvar view';
    this.notifyLoading(true);
    return this.httpClient
      .put<ViewConfigModel>(
        `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.views}`,
        viewConfig,
        this.httpOptions
      )
      .pipe(
        tap((view) => {
          this.updateViews(view);
          this.viewsSubject.next(this.views);
          this.notifyLoading(false);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject))
      );
  }

  /**
   * Crea la configuración de visor
   *
   * @param {ViewConfigModel} viewConfig
   * @returns {Observable<ViewConfigModel>}
   * @memberof ViewConfigsService
   */
  public create(viewConfig: ViewConfigModel): Observable<ViewConfigModel> {
    const op = 'Crear viewConfig';
    this.notifyLoading(true);
    return this.httpClient
      .post<ViewConfigModel>(
        `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.views}`,
        viewConfig,
        this.httpOptions
      )
      .pipe(
        tap((newViewConfig) => {
          this.views = [...this.views, newViewConfig]; // better not to mutate
          this.viewsSubject.next(this.views);
          this.notifyLoading(false);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject))
      );
  }

  /**
   * Elimina el view
   *
   * @param {number} viewId
   * @returns {Promise<void>}
   * @memberof ViewConfigsService
   */
  public delete(viewId: number): Observable<void> {
    const op = 'Eliminar view ' + viewId;
    this.notifyLoading(true);
    return this.httpClient
      .delete<void>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.views}/${viewId}`)
      .pipe(
        tap(() => {
          Utilities.removeElementByKeyFromArray(this.views, 'id', viewId);
          this.viewsSubject.next(this.views);
          this.notifyLoading(false);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject))
      );
  }

  /**
   * Modifica el view en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {ViewConfigModel} newViewConfig
   * @memberof ViewConfigService
   */
  private updateViews(newViewConfig: ViewConfigModel) {
    // busamos la posición del view por ID
    const viewPos = this.views.map((view) => view.id).indexOf(newViewConfig.id);
    // reemplazamos en el array el view
    this.views.splice(viewPos, 1, newViewConfig);
  }
}
