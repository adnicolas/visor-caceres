import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { UserMapModel, UserMapSharedModel } from '@cotvisor-admin/models';
import { environment } from 'src/environments/environment';
import { ParentAdminService } from './parentadmin.service';
import { GlobalAuthService } from './global-auth.service';

@Injectable({ providedIn: 'root' })
export class UserMapsService extends ParentAdminService {

  // lista local del servicio que guarda los userMaps recuperados
  private allUserMaps: UserMapModel[] = [];
  private userMaps: UserMapModel[] = [];
  private userMapsFavourites: UserMapModel[] = [];
  private userMapsShared: UserMapSharedModel[] = [];
  // Subjects de userMaps
  private allUserMapsSubject = new Subject<UserMapModel[]>();
  private userMapsSubject = new Subject<UserMapModel[]>();
  private userMapsFavouritesSubject = new Subject<UserMapModel[]>();
  private userMapsSharedSubject = new Subject<UserMapSharedModel[]>();
  // Observables que notificarán los cambios en la lista de userMaps
  public allUserMaps$ = this.allUserMapsSubject.asObservable();
  public userMaps$ = this.userMapsSubject.asObservable();
  public userMapFavourites$ = this.userMapsFavouritesSubject.asObservable();
  public userMapShared$ = this.userMapsSharedSubject.asObservable();
  // count subjects
  public allUserMapsCountSubject = new Subject<number>();
  public userMapsCountSubject = new Subject<number>();
  public userMapsSharedCountSubject = new Subject<number>();
  public userMapsFavouritesCountSubject = new Subject<number>();
  // count observables
  public allUserMapsCount$ = this.allUserMapsCountSubject.asObservable();
  public userMapsCount$ = this.userMapsCountSubject.asObservable();
  public userMapsSharedCount$ = this.userMapsSharedCountSubject.asObservable();
  public userMapsFavouritesCount$ = this.userMapsFavouritesCountSubject.asObservable();

  constructor(
    // TODO asignar propietario del mapa con el servicio de auth que se establezca
    private globalAuthService: GlobalAuthService
  ) {
    super();
  }

  /**
   * Obtiene todos los usermaps de todos los usuarios
   *
   * @returns {Observable<UserMapModel[]>}
   * @memberof UserMapsService
   */
  public getAll() {

    const op = 'Obtener todos los UserMaps';
    this.notifyLoading(true);
    this.httpClient.get<UserMapModel[]>(environment.apis.visorAssets.baseUrl + environment.apis.geospatialAPI.endpoints.maps)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      )
      .subscribe(
        (userMaps) => {
          this.allUserMaps = userMaps;
          this.allUserMapsSubject.next(this.allUserMaps);
          this.allUserMapsCountSubject.next(this.allUserMaps.length);
          this.notifyLoading(false);
        },
      );
  }

  /**
   * Obtiene todos los usermaps de un usuario
   *
   * @memberof UserMapsService
   */
  public getByOwner() {

    const op = 'Obtener todos los UserMaps de un usuario';
    this.notifyLoading(true);
    this.httpClient.get<UserMapModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/me/owner`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      )
      .subscribe(
        (userMaps) => {
          this.userMaps = userMaps;
          this.userMapsSubject.next(this.userMaps);
          this.userMapsCountSubject.next(this.userMaps.length);
          this.notifyLoading(false);
        },
      );
  }

  /**
   * Obtiene todos los usermaps para los que el usuario cuenta con permiso de lectura
   *
   * @memberof UserMapsService
   */
  public getReadableMaps() {

    const op = 'Obtener todos los UserMaps de un usuario con permiso de lectura';
    this.notifyLoading(true);
    this.httpClient.get<UserMapModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/me/permission`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
      )
      .subscribe(
        (userMaps) => {
          this.userMaps = userMaps;
          this.userMapsSubject.next(this.userMaps);
          this.userMapsCountSubject.next(this.userMaps.length);
          this.notifyLoading(false);
        },
      );
  }

  // TODO - change to subject?

  /**
   * Retorna un mapa de usuario por su ID.
   *
   * @param {number} usermapId
   * @returns {Observable<UserMapModel>}
   *
   * @memberOf UserMapsService
   */
  public get(usermapId: number): Observable<UserMapModel> {

    const OP = 'obtener mapa ' + usermapId;

    this.notifyLoading(true);
    return this.httpClient
      .get<UserMapModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/${usermapId}`)
      .pipe(
        map((userMapModel) => {
          this.sortFoldersAndLayers(userMapModel);
          this.notifyLoading(false);
          return userMapModel;
        }),


        catchError((error) => this.servicesErrorManager.handleError(error, OP, this.loadingSubject)),
      );

  }

  /**
   * Retorna el mapa por defecto pero con los valores asociados a la propiedad e id's a null
   * para que funcione como plantilla de un mapa nuevo
   *
   * @returns {Observable<UserMapModel>}
   *
   * @memberOf UserMapsService
   */
  public getMapTemplate(): Observable<UserMapModel> {

    const OP = 'obtener plantilla de mapa ';
    this.notifyLoading(true);

    return this.httpClient
      .get<UserMapModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/${environment.default_visor_map_id}`)
      .pipe(
        map((userMapModel) => {
          this.sortFoldersAndLayers(userMapModel);
          userMapModel.id = null;
          userMapModel.userOwner = this.globalAuthService.getCurrentUser();
          userMapModel.folders.forEach((folder) => {
            folder.id = null;
          });
          userMapModel.password = null;
          userMapModel.hasPassword = false;
          this.notifyLoading(false);
          return userMapModel;
        }),

        catchError((error) => this.servicesErrorManager.handleError(error, OP, this.loadingSubject)),
      );

  }

  /**
   * Retorna el id del mapa por mdefecto del sistema
   *
   * @returns {Observable<UserMapModel>}
   * @memberof UserMapsService
   */
  public getDefaultMapId(): number {
    return environment.default_visor_map_id;

  }

  /**
   * Guarda los datos del userMap
   *
   * @param {userMapModel} userMap
   * @returns {Observable<userMapModel>}
   * @memberof userMapsService
   */
  public save(userMap: UserMapModel): Observable<UserMapModel> {

    const op = 'Salvar userMap';
    this.notifyLoading(true);

    return this.httpClient.post<UserMapModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}`, userMap)
      .pipe(
        tap((savedUserMap) => {
          this.userMaps.push(savedUserMap);
          this.userMapsSubject.next(this.userMaps);
          this.notifyLoading(false);

        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject),
        ),
      );
  }

  /**
   * Actualiza los datos del userMap
   *
   * @param {userMapModel} userMap
   * @returns {Observable<userMapModel>}
   * @memberof userMapsService
   */
  public update(userMap: UserMapModel): Observable<UserMapModel> {

    const op = 'actualizar mapa de usuario';

    return this.httpClient.put<UserMapModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}`, userMap)
      .pipe(
        tap((updatedUserMap) => {
          this.updateUserMaps(updatedUserMap);
          this.userMapsSubject.next(this.userMaps);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Pide un mapa con contraseña
   *
   * @param {userMapModel} userMap
   * @returns {Observable<userMapModel>}
   * @memberof userMapsService
   */
  public getProtected(userMapId: number, password: string): Observable<UserMapModel> {

    const op = 'Pedir un mapa con contraseña';

    return this.httpClient.post<UserMapModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/${userMapId}/password`,
      { password }).pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Actualiza la contraseña de un mapa
   *
   * @param {userMapModel} userMap
   * @returns {Observable<userMapModel>}
   * @memberof userMapsService
   */
  public updatePassword(userMapId: number, password: string): Observable<UserMapModel> {

    const op = 'Actualizar contraseña userMap';

    return this.httpClient.put<UserMapModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/${userMapId}/password`,
      { password }).pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Modifica el map en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {UserMapModel} newuserMap
   * @memberof userMapService
   */
  private updateUserMaps(newuserMap: UserMapModel) {
    // busamos la posición del userMap por ID
    const userMapPos = this.userMaps.map((userMap) => userMap.id).indexOf(newuserMap.id);
    // reemplazamos en el array el userMap
    this.userMaps.splice(userMapPos, 1, newuserMap);
  }

  /**
   * Elimina el userMap
   * @param {number} userMapId
   * @returns {Promise<void>}
   * @memberof layersService
   */
  public delete(userMapId: number): Observable<void> {

    const op = 'Eliminar userMap ' + userMapId;

    return this.httpClient.delete<void>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/${userMapId}`)
      .pipe(
        tap(() => {
          // encontrar userMapId en el array
          const userMapPos = this.userMaps.map((userMap) => userMap.id).indexOf(userMapId);
          // quitar del array
          this.userMaps.splice(userMapPos, 1);
          this.userMapsSubject.next(this.userMaps);
          this.userMapsCountSubject.next(this.userMaps.length);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  /**
   * Obtiene los mapas compartidos por un usuario
   *
   * @param {number} userId
   * @memberof UsersService
   */
  public getSharedMaps(userId: number) {
    const op = 'Obtener todos los shared maps de un usuario';
    this.httpClient.get<UserMapSharedModel[]>(
      `${environment.apis.visorAssets.baseUrl}${environment.apis.geospatialAPI.endpoints.sharedMaps}/${userId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (shared) => {
          this.userMapsShared = shared;
          this.userMapsSharedSubject.next(this.userMapsShared);
          this.userMapsSharedCountSubject.next(shared.length);
        },
      );
  }

  /**
   * Elimina la relación de mapa compartido
   *
   * @param {number} userId  Usuario que compartió el mapa
   * @param {number} userMapId Mapa compartido
   * @param {number} userSharedToId Usario al que se le compartió el mapa
   * @memberof UserMapsService
   */
  public deleteSharedMap(userId: number, userMapId: number, userSharedToId: number): Observable<any> {

    const op = 'Eliminar mapa compartido';

    return this.httpClient.delete(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.maps}/${userId}/${userMapId}/${userSharedToId}`)
      .pipe(
        tap(() => {
          // encontrar userMapId en el array
          const userMapPos = this.userMaps.map((userMap) => userMap.id).indexOf(userMapId);
          // quitar del array
          this.userMaps.splice(userMapPos, 1);
          this.userMapsSubject.next(this.userMaps);
          this.userMapsCountSubject.next(this.userMaps.length);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );

  }

  /**
   * Obtiene los mapas compartidos por un usuario
   *
   * @param {number} userId
   * @returns {Observable<UserMapSharedModel[]>}
   * @memberof UsersService
   */
  public getFavouriteMaps(userId: number) {

    const op = 'obtener todos los mapas favoritos';

    this.httpClient.get<UserMapModel[]>(
      `${environment.apis.geospatialAPI.baseUrl}${environment.apis.geospatialAPI.endpoints.favouriteMaps}/${userId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (favourites) => {
          this.userMapsFavourites = favourites;
          this.userMapsFavouritesSubject.next(this.userMapsFavourites);
          this.userMapsFavouritesCountSubject.next(this.userMapsFavourites.length);
        },
      );
  }

  /**
   * Elimina la relación de mapa favorito
   *
   * @param {number} userId
   * @param {number} userMapId
   * @returns {Promise<void>}
   * @memberof UserMapsService
   */
  public deleteFavouriteMap(userId: number, userMapId: number): Promise<void> {

    const OP = 'desmarcar mapa favorito';

    return this.httpClient.delete<void>(
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.favouriteMaps}/${userId}/${userMapId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, OP)),
      )
      .toPromise();
  }

  /**
   * Establece el mapa como favortito para el usuario
   *
   * @param {number} userId
   * @param {number} userMapId
   * @returns {Promise<void>}
   * @memberof UserMapsService
   */
  public setFavouriteMap(userId: number, userMapId: number): Promise<object> {

    const OP = 'establecer el mapa como favorito';

    const httpBody = { id: userMapId, user: { id: userId } };
    return this.httpClient.post(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.favouriteMaps}`, httpBody)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, OP)),
      )
      .toPromise();
  }

  /**
   * Devuelve si el mapa es favorito para el usuario
   *
   * @param {number} userId
   * @param {number} userMapId
   * @returns {Promise<boolean>}
   * @memberof UserMapsService
   */
  public isFavouriteMap(userId: number, userMapId: number): Promise<boolean> {

    const OP = 'consultar mapa favorito';

    return this.httpClient.get<boolean>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.favouriteMaps}/${userId}/${userMapId}`)
      .pipe(catchError((error) => this.servicesErrorManager.handleError(error, OP)))
      .toPromise();
  }


  /**
   * Ordena las carpetas y sus capas por la propiedad order
   *
   * @private
   * @param {UserMapModel} userMapModel
   * @returns {UserMapModel}
   * @memberof UserMapsService
   */
  private sortFoldersAndLayers(userMapModel: UserMapModel): UserMapModel {
    // TODO ordenacion recursiva de subcarpetas
    // ordenacion de carpetas en orden descendente
    userMapModel.folders.sort((a, b) => this.descendingOrder(a, b));
    // Ordenación de capas en orden ascendente
    userMapModel.folders.forEach((folder) => {
      folder.layers.sort((a, b) => this.ascendingOrder(a, b));
    });
    return userMapModel;

  }

  /**
   * Ordnación de carpetas descendente
   *
   * @private
   * @param {*} folderOrLayerA
   * @param {*} folderOrLayerB
   * @returns
   * @memberof UserMapsService
   */
  private descendingOrder(folderOrLayerA: any, folderOrLayerB: any) {
    if (folderOrLayerA.order > folderOrLayerB.order) {
      return 1;
    }
    if (folderOrLayerA.order < folderOrLayerB.order) {
      return -1;
    }

    return 0;

  }

  /**
   * Ordenación de carpetas ascendente
   *
   * @private
   * @param {*} folderOrLayerA
   * @param {*} folderOrLayerB
   * @returns
   * @memberof UserMapsService
   */
  private ascendingOrder(folderOrLayerA: any, folderOrLayerB: any) {
    if (folderOrLayerA.order < folderOrLayerB.order) {
      return 1;
    }
    if (folderOrLayerA.order > folderOrLayerB.order) {
      return -1;
    }

    return 0;

  }
}
