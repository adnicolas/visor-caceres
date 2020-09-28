import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { Subject } from 'rxjs/Subject';
import { LayerModel } from '@cotvisor-admin/models/layer.model';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { UserMapModel } from '@cotvisor-admin/models';
import { PublisherLayerModel } from '@cotvisor-admin/modules/layers/layers-file-publisher/publisher-layer.model';


const REPLACE_EP = '/replace';
const PUBLISH = '/publish';

@Injectable()
export class LayersService extends ParentAdminService {


  // lista local del servicio que guarda los layers recuperados
  private layers: LayerModel[] = [];
  // Subject de layers
  private layersSubject = new Subject<LayerModel[]>();
  // Observable de layers que notificará los cambios en la lista de layers
  public layers$ = this.layersSubject.asObservable();

  public layersCountSubject = new Subject<number>();
  public layersCount$ = this.layersCountSubject.asObservable();

  constructor(
  ) {
    super();
  }

  /**
   * Obtiene todos los layers
   *
   * @returns
   * @memberof layersService
   */
  public getAll() {

    const op = 'obtener todas las capas';
    this.notifyLoading(true);

    this.httpClient.get<LayerModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI.endpoints.layers)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe(
        (layers) => {
          this.layers = layers;
          this.layersSubject.next(this.layers);
          this.layersCountSubject.next(this.layers.length);
          this.notifyLoading(false);
          // return true;
        },
      );
  }

  public getWithPermission() {
    const op = 'obtener todas las capas para las que se cuenta con permiso';
    this.notifyLoading(true);

    this.httpClient.get<LayerModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI.endpoints.layers + '/me/permission')
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)))
      .subscribe(
        (layers) => {
          this.layers = layers;
          this.layersSubject.next(this.layers);
          this.layersCountSubject.next(this.layers.length);
          this.notifyLoading(false);
          // return true;
        },
      );
  }

  /**
   * Obtiene todos los layers que sean de servicios
   *
   * @returns
   * @memberof layersService
   */
  public getAllWithOutUserContent() {

    const op = 'obtener todas las capas de servicios';
    this.notifyLoading(true);

    return this.httpClient.get<LayerModel[]>(environment.apis.geospatialAPI.baseUrl +
      environment.apis.geospatialAPI.endpoints.layers + '?onlyServices=true')
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );

  }

  /**
   * Obtiene un layer por su id
   *
   * @param {number} layerId
   * @returns {Observable<layerModel>}
   * @memberof layersService
   */

  public get(layerId: number): Observable<LayerModel> {
    // TODO obtener respuesta del modelo de layer

    const op = 'obtener capa con id ' + layerId;
    this.notifyLoading(true);

    return this.httpClient.get<LayerModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.layers}/${layerId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  /**
   * Guarda los datos del layer
   *
   * @param {layerModel} layer
   * @returns {Observable<layerModel>}
   * @memberof layersService
   */
  public save(layer: LayerModel): Observable<LayerModel> {

    const op = 'guardar capa';
    this.notifyLoading(true);

    return this.httpClient.put<LayerModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.layers}`, layer)
      .pipe(
        tap((savedLayer) => {
          this.updateLayers(savedLayer);
          this.layersSubject.next(this.layers);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject))
      );

  }

  /**
   * Crea el layer
   *
   * @param {layerModel} layer
   * @returns {Observable<layerModel>}
   * @memberof layersService
   */
  public create(layer: LayerModel): Observable<LayerModel> {

    const op = 'crear capa';
    this.notifyLoading(true);

    return this.httpClient.post<LayerModel>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.layers}`, layer)
      .pipe(
        tap((newLayer) => {
          this.layers = [...this.layers, newLayer]; // better not to mutate
          this.layersSubject.next(this.layers);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  public replaceLayer(originLayerId: number, targetLayerId: number) {
    const op = 'reemplazar capa';
    const body = {
      originLayerId,
      targetLayerId,
    };
    return this.httpClient.post<LayerModel>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.layers}${REPLACE_EP}`, body)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  /**
   * Elimina el layer
   *
   * @param {number} layerId
   * @returns {Promise<void>}
   * @memberof layersService
   */
  public delete(layerId: number): Observable<any> {

    const op = 'eliminar capa ' + layerId;

    return this.httpClient.delete(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.layers}/${layerId}`)
      .pipe(
        tap(() => {
          Utilities.removeElementByKeyFromArray(this.layers, 'id', layerId);
          this.layersSubject.next(this.layers);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );
  }

  public sendIncident(incident: { emailAddress: string, comment: string, coordinates: string, map: UserMapModel, }): Observable<any> {
    const op = 'reportar incidente en capas';

    return this.httpClient.post(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.incidents}`, incident)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  /**
   * Modifica el layer en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {layerModel} newLayer
   * @memberof layerService
   */
  private updateLayers(newLayer: LayerModel) {
    // busamos la posición del layer por ID
    const layerPos = this.layers.map((layer) => layer.id).indexOf(newLayer.id);
    // reemplazamos en el array el layer
    this.layers.splice(layerPos, 1, newLayer);
  }


  /**
   * Envia al servicio de publicación de shape una nueva capa con sus atributos
   *
   * @param {LayerModel} layer  Capa a insertar en BBDD
   * @param {File} featuresLayer  Capa a publicar en servidor de mapas
   * @returns
   *
   * @memberOf LayersService
   */
  public publishLayerFromfile(featuresLayer: PublisherLayerModel): Observable<LayerModel> {
    const op = 'publicar capa desde archivo';

    this.notifyLoading(true);
    return this.httpClient.post<LayerModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.layers}${PUBLISH}`, featuresLayer)
      .pipe(
        tap(() => this.notifyLoading(false)),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      );


  }


}
