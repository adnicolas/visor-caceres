import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GeospatialParentService } from '@geospatial/classes/geospatial-parent-service.class';
import { AOIModel } from '@geospatial/classes/aoi.model';

/**
 * Servicio que gestiona las peticiones de AOIs del usuario
 *
 *
 * @export
 * @class AoiService
 */
@Injectable({
  providedIn: 'root'
})
export class AoiService extends GeospatialParentService {

  aoisStore$: Observable<AOIModel[]>;

  private aoisStoreSubject: BehaviorSubject<AOIModel[]>;
  private aoisStore: AOIModel[] = [];

  constructor() {
    super();
    this.aoisStoreSubject = new BehaviorSubject([]);
    this.refreshStore();
  }

  /**
   * Retorna observable que notificará los AOI del servicio
   *
   * @returns
   *
   * @memberOf AoiService
   */
  getAll() {
    return this.aoisStoreSubject.asObservable();
  }

  /**
   * Añade un nuevo AOI
   *
   * @param {AOIModel} aoi
   * @returns {Observable<AOIModel>}
   *
   * @memberOf AoiService
   */
  add(aoi: AOIModel): Observable<AOIModel> {

    const op = `añadir AOI`;

    this.notifyLoading(true);
    return this.httpClient
      // .post<AOIModel>(`${this.environment.apis.geospatialAPI.baseUrl}${this.environment.apis.geospatialAPI.endpoints.aoi}`, aoi)
      .post<AOIModel>(`${this.environment.apis.geospatialAPI.baseUrl}${this.environment.apis.geospatialAPI.endpoints}/aoi`, aoi)

      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
        tap(aoiSaved => {
          this.notifyLoading(false);
          this.aoisStore.push(aoiSaved);
          this.aoisStoreSubject.next(this.aoisStore);
        })
      );
  }


  /**
   * Elimina un aoi por su ID.
   * No devuelve observable porque  el método controla el error y notifica
   * los cambios a través del observable del store a los componentes suscritos
   *
   *
   * @param {number} id
   * @returns {Observable<boolean>}
   *
   * @memberOf AoiService
   */
  delete(id: number) {
    const op = 'eliminar AOI';

    this.httpClient
      // .delete(`${this.environment.apis.geospatialAPI.baseUrl}${this.environment.apis.geospatialAPI.endpoints.aoi}/${id}`)
      .delete(`${this.environment.apis.geospatialAPI.baseUrl}${this.environment.apis.geospatialAPI.endpoints}/aoi/${id}`)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe(
        _success => {
          this.notifyLoading(false);
          this.refreshStore();
        });
  }

  /**
   * Obtiene un AOI por ID
   *
   * @param {number} id
   * @returns {Observable<AOIModel>}
   *
   * @memberOf AoiService
   */
  get(id: number): Observable<AOIModel> {
    return null;
  }

  /**
   * Carga en el servicio los AOI desde la API Rest
   *
   * @private
   * @returns
   *
   * @memberOf AoiService
   */
  private refreshStore() {

    const op = `Obtener AOIS`;

    this.notifyLoading(true);
    return this.httpClient
      // .get<AOIModel[]>(`${this.environment.apis.geospatialAPI.baseUrl}${this.environment.apis.geospatialAPI.endpoints.aoi}`)
      .get<AOIModel[]>(`${this.environment.apis.geospatialAPI.baseUrl}${this.environment.apis.geospatialAPI.endpoints}/aoi`)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe(
        aois => {
          this.notifyLoading(false);
          this.aoisStore = aois;
          this.aoisStoreSubject.next(this.aoisStore);
        }
      );
  }

}
