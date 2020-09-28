import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayPanelComponent } from '@theme/components/overlay-panel/overlay-panel.component';
import { ScenesFilterService } from '@geospatial/components/scenes-panel/services/scenes-filter.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { SceneFilter } from '@geospatial/classes/scene-filter';


/**
 * Permite filtrar escenas por fechas, porcentaje de visibilidad, y el resto de atributos que se indiquen...
 *
 * @export
 * @class ScenesFilterComponent
 */
@Component({
  selector: 'gss-scenes-filter',
  templateUrl: './scenes-filter.component.html',
  styleUrls: ['./scenes-filter.component.scss']
})
export class ScenesFilterComponent implements OnInit {

  @ViewChild('panelFiltros') panelFiltrosRef: OverlayPanelComponent;
  public scenesFilter: SceneFilter;
  public filterPanelOpen: boolean = false;

  private filterChangeDebouncer: Subject<any> = new Subject();
  constructor(private scenesFilterService: ScenesFilterService) {

  }

  ngOnInit() {
    // obtener filtro del servicio
    this.scenesFilterService.scenesFilter$
      .subscribe(scenesFilter => this.scenesFilter = scenesFilter);
    // Aplico un debounceTime para no enviar tantas peticiones al cambiar el slider.
    // Se hace así porque el evento onSlideEnd no salta cuando no se hace drag sobre el slider
    this.filterChangeDebouncer.pipe(debounceTime(500)).subscribe(() => this.scenesFilterService.setScenesFilter(this.scenesFilter));
  }


  /**
   * abrir y cerrar el panel de filtros
   *
   * @param {*} event
   * @memberof ScenesFilterComponent
   */
  public togglePanelFiltros(event) {
    this.panelFiltrosRef.toggle(event);
    this.filterPanelOpen = !this.filterPanelOpen;
  }

  /**
   *  actualizar valor startDate y avisa a los subscribers
   *
   * @param {*} value
   * @memberof ScenesFilterComponent
   */
  public startDateChanged(value: Date) {
    this.scenesFilter.startDate = value; // set date as ISO-8601
    this.scenesFilterService.setScenesFilter(this.scenesFilter);
  }

  public endDateChanged(value: Date) {
    this.scenesFilter.endDate = value; // set date as ISO-8601
    this.scenesFilterService.setScenesFilter(this.scenesFilter);
  }

  /**
   *  Lanzar servicio de filtros para actualizar la lista de escenas al cambiar un filtro
   *
   * @memberof ScenesFilterComponent
   */
  public filterChangeHandler() {
    this.filterChangeDebouncer.next();
  }

  /**
   *  Reestablecer filtros por defecto
   *
   * @memberof ScenesFilterComponent
   */
  public resetFilters() {
    // construir filtro por defecto
    this.scenesFilterService.resetFilter();
  }

  /**
   *  metodo que dispara al cerrar el panel de filtros
   *
   * @memberof ScenesFilterComponent
   */
  public onFilterPanelClose() {
    // console.error('filter panel closed');
  }
}
