import { Component, OnInit } from '@angular/core';
import { AreaSelectionService } from '@cotvisor/services/area-selection.service';
import * as ol from 'openlayers';
import { ScenesFilterService } from '@geospatial/components/scenes-panel/services/scenes-filter.service';
import { Observable } from 'rxjs';
import { Scene } from '@geospatial/classes/scene';
import { ScenesService } from '@geospatial/components/scenes-panel/services/scenes.service';


/**
 * Lista las escenas resultado de la selección de escenas. Se subscribe al filtro de área y al servicio de filtro de escenas.
 *
 * @export
 * @class ScenesListComponent
 */
@Component({
  selector: 'gss-scenes-list',
  templateUrl: './scenes-list.component.html',
  styleUrls: ['./scenes-list.component.scss']
})
export class ScenesListComponent implements OnInit {

  public scenes$: Observable<Scene[]>;
  public loading$: Observable<boolean>; // para mostrar spinner al cargar scenes

  constructor(private scenesService: ScenesService, private areaSelectionService: AreaSelectionService, private scenesFilterService: ScenesFilterService) {
    this.scenes$ = this.scenesService.scenes$;
    this.loading$ = this.scenesService.loading$;
  }

  public ngOnInit() {
    // Cuando hay cambios en el filtro de áreas, actualiza el servicio de filtro de escenas.
    this.areaSelectionService.getArea().subscribe((geometricFilter: ol.Feature[]) => {
      this.scenesFilterService.setGeometricFilter(geometricFilter);
    });
  }
}
