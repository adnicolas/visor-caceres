import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SceneFilter } from '@geospatial/classes/scene-filter';

/**
 * Servicio que contiene el filtro activo tanto geométrico como de atributos
 *
 * @export
 * @class ScenesFilterService
 */
@Injectable()

export class ScenesFilterService {
  private scenesFilter: SceneFilter;
  // Subject del filtro de escenas
  private scenesFilterSubject: BehaviorSubject<SceneFilter>;
  // Observable del filtro de escenas  notificará los cambios en el filtro
  public scenesFilter$: Observable<SceneFilter>;

  constructor() {
    this.scenesFilter = new SceneFilter();
    this.scenesFilterSubject = new BehaviorSubject<SceneFilter>(this.scenesFilter);
    this.scenesFilter$ = this.scenesFilterSubject.asObservable();
  }

  public setGeometricFilter(geometricFilter: ol.Feature[]) {
    this.scenesFilter.pristine = false;
    this.scenesFilter.areasFilter = geometricFilter;
    this.scenesFilterSubject.next(this.scenesFilter);

  }

  public getScenesFilter(): Observable<SceneFilter> {
    return this.scenesFilterSubject.asObservable();
  }

  public setScenesFilter(scenesFilter: SceneFilter) {
    this.scenesFilter.pristine = false;
    this.scenesFilter = scenesFilter;
    this.scenesFilterSubject.next(this.scenesFilter);
  }

  public resetFilter() {
    this.scenesFilter.resetFilter();
  }


}
