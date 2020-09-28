import { Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ParentComponent } from './parent-component.class';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { InjectorService } from '@cotvisor/services/injector.service';
/**
 * Clase abstracta para las herramientas del mapa
 *
 * @export
 * @abstract
 * @class AbstractParentToolComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export abstract class AbstractParentToolComponent extends ParentComponent implements OnInit, OnDestroy {

  @Input() public map?: VsMap;
  public zoomDuration = 500;
  protected mapService: VsMapService;

  constructor() {
    super();
    this.zoomDuration = environment.map_view.animations.zoom_duration;
    this.mapService = InjectorService.injector.get(VsMapService);
  }

  public ngOnInit() {
    // Suscribimos el cambio de mapa activo
    this.mapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((vsMap) => {
        // Si ya existe un mapa definido, lanzamos el método que debe ejecutarse
        // antes de cambiar de mapa activo
        if (this.map) {
          this.beforeChangeActiveMap();
        }
        if (vsMap) {
          this.map = vsMap;
          this.afterChangeActiveMap();
        }
      });
  }

  /**
   *
   *
   * @protected
   * @abstract
   * @memberof ParentToolComponent
   */
  protected abstract afterChangeActiveMap(): void;

  /**
   *
   *
   * @protected
   * @abstract
   * @memberof ParentToolComponent
   */
  protected abstract beforeChangeActiveMap(): void;

}
