import { Component, EventEmitter, Output } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { LayerModel } from '@cotvisor-admin/models';
import { LayersService } from '@cotvisor-admin/services';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';


class LayerExcerpt {
  id: number;
  name: string;
  title: string;
  url: string;
}

@Component({
  selector: 'cot-layers-list',
  templateUrl: './layers-list.component.html',
  styleUrls: ['./layers-list.component.scss'],
})
export class LayersListComponent extends ParentComponent {


  public layers: LayerModel[] = [];
  public layersExcerpt: LayerExcerpt[] = [];
  public layersCols = [
    { field: 'name', header: 'Nombre' },
    { field: 'title', header: 'Título' },
    { field: 'url', header: 'Servicio' }
  ];

  public name: string;
  public title: string;
  public visible: boolean;
  public loading: boolean = true;
  @Output() selectedLayer: EventEmitter<LayerModel> = new EventEmitter();
  @Output() goToLayer: EventEmitter<number> = new EventEmitter();

  constructor(public layersService: LayersService, private confirmDialogService: ConfirmDialogService) {
    super();
    this.layersService.layers$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        layers => {
          this.layers = layers;
          this.layersExcerpt = [];
          layers.forEach(
            (layerItem) => {
              const layerExcerpt: LayerExcerpt = new LayerExcerpt();
              layerExcerpt.id = layerItem.id;
              layerExcerpt.name = layerItem.name;
              layerExcerpt.title = layerItem.title;
              if (layerItem.service) layerExcerpt.url = layerItem.service.url;
              this.layersExcerpt.push(layerExcerpt);
            }

          );
          this.loading = false;
        }
      );
    // this.layersService.getAll();
    this.layersService.getWithPermission();
    this.useLiterals(['LAYERS.DELETE_CONFIRM', 'LAYERS.DELETE']);
  }


  /**
   * Emite evento para navegar al detalle de la capa
   *
   * @param {LayerExcerpt} layerExcerpt
   *
   * @memberOf LayersListComponent
   */
  public emitGoToLayer(layerExcerpt: LayerExcerpt) {
    this.goToLayer.emit(layerExcerpt.id);
  }

  /**
   * Elimina la capa
   *
   * @param {any} $event
   *
   * @memberOf LayersListComponent
   */
  public deleteLayer($event: { row: LayerExcerpt, deleteConfirm: () => void }) {

    this.confirmDialogService.open({
      message: this.componentLiterals['LAYERS.DELETE_CONFIRM'],
      header: this.componentLiterals['LAYERS.DELETE'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.layersService.delete($event.row.id)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(() => $event.deleteConfirm());

      },
      reject: () => { }
    });

  }

  /**
   *
   * Emite el evento de capa seleccionada
   *
   * @param {LayerExcerpt} layerExcerptSelected
   *
   * @memberOf LayersListComponent
   */
  public emitSelectedLayer(layerExcerptSelected: LayerExcerpt) {
    const selectedLayer = this.layers.filter(layer => layerExcerptSelected.id === layer.id)[0];
    this.selectedLayer.emit(selectedLayer);
  }



}

