import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// FIXME Arreglar problema en drag-drop cuando está desplegada la leyenda de una capa
@Component({
  selector: 'cot-toc-layer-list',
  templateUrl: './toc-layers-list.component.html',
  styleUrls: ['./toc-layers-list.component.scss']
})
export class TocLayersListComponent extends ParentComponent implements AfterViewInit, OnInit {
  public layers: VsLayer[] = [];

  public isOpen: boolean = true;
  private _isToolsOpen: boolean = false;

  public activeElement: any;


  constructor(private vsMapService: VsMapService) {
    super();

  }

  public ngOnInit(): any {
    // suscribimos las capas al evento de cambio de mapa activo
    this.vsMapService.activeMapChanged$.subscribe((vsMap) => {
      if (vsMap) {
        this.layers = vsMap.getActiveLayers();
      }
    });
  }

  public ngAfterViewInit(): any {

    this.layers.sort((layer1, layer2) => {
      return layer1.zIndex - layer2.zIndex;
    });
  }
  /**
   * abre o cierra el componente
   * @todo Incorporar esta funcionalidad a componentes que tengan interfaz de ventana con una clase padre
   * @return {[type]} [description]
   */
  public toggle() {
    this.isOpen = !this.isOpen;
  }

  public isToolsOpen(): boolean {
    return this._isToolsOpen;
  }

  public openAddLayerModal() {
    // this.modalService.showModal(AddLayersModalComponent);
  }

  /**
   * Función que se llama cada vez que se reordena una capa de la lista de capas activas
   * para cambiar el orden de las capas sobre el mapa
   * @param {CdkDragDrop<string[]>} event
   * @memberof TocLayersListComponent
   */
  public dropLayer(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
    // Cambio el zIndex dentro del mapa solo para las capas afectadas
    let init: number;
    let end: number;
    if (event.previousIndex > event.currentIndex) {
      init = event.currentIndex;
      end = event.previousIndex;
    } else {
      init = event.previousIndex;
      end = event.currentIndex;
    }
    for (init; init <= end; init++) {
      const zIndex = this.layers.length - init;
      this.layers[init].setZIndex(zIndex);
    }
  }

  public removeLayer(layer: VsLayer): any {
    this.vsMapService.removeVsLayer(layer);

  }
}
