import { Injectable } from '@angular/core';
import { VsUserLocation } from '@cotvisor/models/vs-user-location';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { GeospatialParentService } from '@geospatial/classes/geospatial-parent-service.class';
@Injectable({
  providedIn: 'root'
})

export class UserLocationsService extends GeospatialParentService {


  private userLocationsStoreSubject: BehaviorSubject<VsUserLocation[]> = new BehaviorSubject([]);
  private userLocationsStore: VsUserLocation[] = [];
  public userLocationsStore$ = this.userLocationsStoreSubject.asObservable();
  private BACKENDURL: string;


  constructor(
  ) {
    super();
    this.BACKENDURL = environment.apis.geospatialAPI.baseUrl;
  }

  /**
   *
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {VsUserLocation} userLocation
   * @returns {Observable<VsUserLocation>}
   * @memberof UserLocationsService
   */
  public save(userLocation: VsUserLocation): Observable<VsUserLocation> {

    const op = `añadir ubicacion`;
    this.notifyLoading(true);
    return this.httpClient
      .post<VsUserLocation>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.userLocations}`, userLocation)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
        tap(userLocationSaved => {
          this.notifyLoading(false);
          this.userLocationsStore.push(userLocationSaved);
          this.userLocationsStoreSubject.next(this.userLocationsStore);
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
   * @memberOf UserLocationsService
   */
  delete(id: number) {
    const op = 'eliminar UserLocation';
    this.notifyLoading(true);
    return this.httpClient
      .delete(`${this.BACKENDURL}${this.environment.apis.geospatialAPI.endpoints.userLocations}/${id}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
        tap(
          _success => {
            this.notifyLoading(false);
            this.refreshStore();
          })
      );
  }


  /**
   * Carga en el servicio las UserLocations desde la API Rest
   *
   * @private
   * @returns
   *
   * @memberOf UserLocationService
   */
  private refreshStore() {

    const op = `Obtener UserLocations`;

    this.notifyLoading(true);
    return this.httpClient
      .get<VsUserLocation[]>(`${this.BACKENDURL}${this.environment.apis.geospatialAPI.endpoints.userLocations}`)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe(
        userLocations => {
          this.notifyLoading(false);
          this.userLocationsStore = userLocations;
          this.userLocationsStoreSubject.next(this.userLocationsStore);
        }
      );
  }

  /**
   * Carga en el servicio las UserLocations desde la API Rest
   *
   * @private
   * @returns
   *
   * @memberOf UserLocationService
   */
  public getByUserId(userId: number) {
    const op = `obtener UserLocations`;
    this.notifyLoading(true);
    return this.httpClient
      .get<VsUserLocation[]>(`${this.BACKENDURL}${this.environment.apis.geospatialAPI.endpoints.userLocations}/user/${userId}?id=${userId}`)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe(
        userLocations => {
          this.notifyLoading(false);
          this.userLocationsStore = userLocations;
          this.userLocationsStoreSubject.next(this.userLocationsStore);
        }
      );
  }
}
