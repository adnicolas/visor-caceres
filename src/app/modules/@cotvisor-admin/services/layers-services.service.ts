import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { Subject } from 'rxjs/Subject';
import { LayersServiceModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

@Injectable()
export class LayersServicesService extends ParentAdminService {

  // lista local del servicio que guarda los layers recuperados
  private layerServices: LayersServiceModel[] = [];
  // Subject de layers
  private layerServicesSubject = new Subject<LayersServiceModel[]>();
  // Observable de layers que notificará los cambios en la lista de layers
  public layerServices$ = this.layerServicesSubject.asObservable();

  constructor(
  ) {
    super();
  }

  /**
   * Obtiene todos los layers
   *
   * @returns {Observable<layersServiceModel[]>}
   * @memberof layersService
   */
  public getAll() {

    const op = 'Obtener todos los layerServices';

    return this.httpClient.get<LayersServiceModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI.endpoints.services)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (layers) => {
          this.layerServices = layers;
          this.layerServicesSubject.next(this.layerServices);
        },
      );
  }

  /**
   * Obtiene un layersService por su id
   *
   * @param {number} layersServiceId
   * @returns {Observable<LayersServiceModel>}
   * @memberof layersServicesService
   */

  public get(layersServiceId: number): Observable<LayersServiceModel> {
    // TODO obtener respuesta del modelo de layersService

    const op = 'Obtener view con id ' + layersServiceId;

    return this.httpClient.get<LayersServiceModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.services}/${layersServiceId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  /**
   * Guarda los datos del layer
   *
   * @param {layersServiceModel} layerService
   * @returns {Observable<layersServiceModel>}
   * @memberof layersService
   */
  public save(layerService: LayersServiceModel): Observable<LayersServiceModel> {

    const op = 'Salvar layer';

    return this.httpClient.put<LayersServiceModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.services}`, layerService)
      .pipe(
        tap((service) => {
          this.updateLayerServices(service);
          this.layerServicesSubject.next(this.layerServices);
        },
        ),
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Modifica el layer en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {layerModel} newLayerService
   * @memberof layerService
   */
  private updateLayerServices(newLayerService: LayersServiceModel) {
    // busamos la posición del layer por ID
    const layerPos = this.layerServices.map((layer) => layer.id).indexOf(newLayerService.id);
    // reemplazamos en el array el layer
    this.layerServices.splice(layerPos, 1, newLayerService);
  }

  /**
   * Elimina el servicio
   *
   * @param {number} layerServiceId
   * @returns {Promise<void>}
   * @memberof layersServicesService
   */
  public delete(layerServiceId: number): Observable<any> {

    const op = 'Eliminar servicio ' + layerServiceId;

    return this.httpClient.delete(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.services}/${layerServiceId}`)
      .pipe(
        tap(() => {
          Utilities.removeElementByKeyFromArray(this.layerServices, 'id', layerServiceId);
          this.layerServicesSubject.next(this.layerServices);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  /**
   * Elimina una etiqueta de un servicio por id
   *
   * @param {number} layerServiceId  ID d ela servicio
   * @param {number} tagId ID del Tag a eliminar
   * @returns {Promise<void>}
   * @memberof LayersService
   */
  /*public deleteTag(layerServiceId: number, tagId: number): Promise<void> {

    const op = `Eliminar Tag ${tagId} de servicio ${layerServiceId}`;

    return this.httpClient.delete(environment.apis.geospatialAPI.endpoints.tags)
      .toPromise()
      .then(() => null)
      .catch(error => this.servicesErrorManager.handleError(error, op));
  }*/


  // TODO validar funcionamiento de estos métodos
  /**
   *
   * @param {number} layerServiceId ID de la servicio
   * @param {number} tagId ID del tag a añadir
   * @returns {Promise<void>}
   * @memberof LayersService
   */
  public addTag(layerServiceId: number, tagId: number): Promise<void> {

    const op = `añadir tag ${tagId} al servicio ${layerServiceId}`;


    return this.httpClient.post(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.services}`, null)
      .toPromise()
      .then(() => null)
      .catch(error => this.servicesErrorManager.handleError(error, op));
  }


}
