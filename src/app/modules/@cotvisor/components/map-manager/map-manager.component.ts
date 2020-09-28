import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { VsMapService } from '@cotvisor/services/vs-map.service';

/**
 * Componente que muestra la estructura de capas de un mapa y permite su gestión
 *
 * @export
 * @class MapManagerComponent
 */
@Component({
  selector: 'cot-map-manager',
  templateUrl: './map-manager.component.html',
})
export class MapManagerComponent extends ParentComponent {

  public vsMapUserMap: VsMapUserMap;
  public showMapInfo: boolean = false;
  constructor(private vsMapService: VsMapService) {
    super();
    // TODO en el cambio de mapa hay que reconstruir el arbol de carpetas, no basta con cambiar el input
    this.vsMapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (vsMap: VsMapUserMap) => {
          this.vsMapUserMap = vsMap;
        });
  }

  public toggleMapInfo() {
    this.showMapInfo = !this.showMapInfo;
  }

}
