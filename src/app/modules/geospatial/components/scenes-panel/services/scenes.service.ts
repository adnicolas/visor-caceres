import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/observable/of';
import { catchError, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ScenesFilterService } from './scenes-filter.service';
import { VsLayerImage } from '@cotvisor/models/vs-layer-image';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { GeospatialParentService } from '@geospatial/classes/geospatial-parent-service.class';
import { Scene } from '@geospatial/classes/scene';
import { SceneFilter } from '@geospatial/classes/scene-filter';
import { PaginationResponse } from '@geospatial/classes/pagination-response';

/**
 * Servicio que realiza las consultas a la API de GBDX y Sentinel. Expone un observable con los resultados de las consulta.
 *
 * @export
 * @class ScenesService
 */
@Injectable()

export class ScenesService extends GeospatialParentService {

  // lista local del servicio que guarda los scenes recuperados
  // private scenes: SceneClass[] = [];
  // Subject de scenes
  private scenesSubject = new BehaviorSubject<Scene[]>([]);
  // Observables de scenes que notificará los cambios en la lista de scenes
  public scenes$ = this.scenesSubject.asObservable();
  private selectedScenesSubject = new BehaviorSubject<Scene[]>([]);
  public selectedScenes$ = this.selectedScenesSubject.asObservable();

  private selectedImageLayers: { id: string, satelliteName: string, layer: VsLayerImage }[] = [];

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };
  // Objeto con la lista de subjects llamados para cancelar anteriores peticiones al realizar nuevas
  private unSubscribes = {
    search: new Subject<boolean>()
  };


  constructor(private scenesFilterService: ScenesFilterService, private mapService: VsMapService) {
    super();
    this.scenesFilterService.scenesFilter$
      .subscribe(
        sceneFilter => {
          if (!sceneFilter.pristine) this.searchScenes(sceneFilter);
        }
      );
  }

  /**
   * Añade la escena a la lista de seleccionadas si no se encuentra ya seleccionada
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {Scene} scene
   * @memberof ScenesService
   */
  public addSelectedScene(scene: Scene, imageLayer: VsLayerImage) {
    if (!this.selectedScenesSubject.value.some(el => (el.id === scene.id && el.satelliteName === scene.satelliteName))) {
      // Añade la capa de imagen estática al mapa
      const map = this.mapService.getActiveMap();
      map.addVsLayer(imageLayer);
      this.selectedImageLayers.push({ id: scene.id, satelliteName: scene.satelliteName, layer: imageLayer });
      // centrar el mapa sobre la geometria de la escena
      map.getView().fit(imageLayer.extent);

      this.selectedScenesSubject.next([...this.selectedScenesSubject.value, ...[scene]]);
    }
  }

  /**
   * Elimina la escena de la lista de seleccionadas si se encunetra en dicha lista
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {Scene} scene
   * @memberof ScenesService
   */
  public removeSelectedScene(scene: Scene) {
    const filteredScenes = this.selectedScenesSubject.value.filter(el => (el.id !== scene.id || el.satelliteName !== scene.satelliteName));
    if (filteredScenes.length !== this.selectedScenesSubject.value.length) {
      const map = this.mapService.getActiveMap();
      const imageIndex = this.selectedImageLayers.findIndex(el => el.id === scene.id && el.satelliteName === scene.satelliteName);
      if (imageIndex > -1) {
        map.removeVsLayer(this.selectedImageLayers[imageIndex].layer);
        this.selectedImageLayers.splice(imageIndex, 1);
      }
      this.selectedScenesSubject.next(filteredScenes);
    }
  }

  /**
   *  Recoger escenas a partir de un filtro
   *
   * @param {*} filter
   * @memberof ScenesService
   */
  private searchScenes(filter: SceneFilter) {
    const OP = 'get scenes using a filter';
    // Cancelo anteriores peticiones de búsqueda
    this.unSubscribes.search.next(true);
    this.loadingSubject.next(true);

    // const httpBody = filter;
    // return this.httpClient.post(`${environment.apis.geospatialAPI.baseUrl}${environment.apis.geospatialAPI.endpoints.scenes}`, filter.generateFilterParameters())
    return this.httpClient.post(`${environment.apis.geospatialAPI.baseUrl}${environment.apis.geospatialAPI.endpoints}/scenes`, filter.generateFilterParameters())
      .pipe(
        takeUntil(this.unSubscribes.search),
        catchError((error) => {
          this.loadingSubject.next(false);
          return this.servicesErrorManager.handleError(error, OP);
        }),
      ).subscribe((response: PaginationResponse) => {
        this.scenesSubject.next(response.results);
        this.loadingSubject.next(false);
      });
  }
}
