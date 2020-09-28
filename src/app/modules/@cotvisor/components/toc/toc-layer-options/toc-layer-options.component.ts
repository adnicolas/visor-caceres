import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as ol from 'openlayers';
import { OverlayPanelComponent } from '@theme/components/overlay-panel/overlay-panel.component';
import { ToastService } from '@theme/services/toast.service';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';

@Component({
  selector: 'cot-toc-layer-options',
  templateUrl: 'toc-layer-options.component.html',
  styleUrls: ['toc-layer-options.component.scss']
})
export class TocLayerOptionsComponent extends ParentComponent implements OnInit {

  @ViewChild('panelOptions') panelOptions: OverlayPanelComponent;
  @Input() public layer: VsLayer;
  public optionsPanelOpen: boolean = false;
  public display: boolean = false;

  constructor(private vsMapService: VsMapService, private confirmDialogService: ConfirmDialogService, private toastService: ToastService) {
    super();
  }

  public togglePanelOpciones() {
    this.panelOptions.toggle(event);
    this.optionsPanelOpen = !this.optionsPanelOpen;
  }

  public ngOnInit() {
    this.useLiterals(['TOC.LAYER.OPTIONS.DELETE_LAYER_QUESTION', 'TOC.LAYER.OPTIONS.DELETE_LAYER', 'TOC.LAYER.OPTIONS.LAYER_DELETED']);
  }
  /**
   * acercar el mapa al extent de la capa
   *
   * @memberof TocLayerOptionsComponent
   */
  public zoomToLayerExtent() {
    if (this.layer.extent) {
      const view = this.vsMapService.getActiveMap().getView();
      try {
        // Convertimos el extent que viene en coordenadas de la proyección de la capa al del mapa activo
        const extent = ol.proj.transformExtent(this.layer.extent, this.layer.projection, view.getProjection());
        if (!extent.some(isNaN)) {
          view.fit(extent, { duration: environment.map_view.animations.zoom_duration, maxZoom: 17 });
        }
      } catch (error) {
        /*                console.log(error); */
      }
    } else {

    }
  }


  /**
   * mostrar propiedades de la capa
   *
   * @memberof TocLayerOptionsComponent
   */
  public showLayerProperties() {
    this.display = true;
  }


  /**
   * mostrar confirmacion para borrar la capa
   *
   * @memberof TocLayerOptionsComponent
   */
  public showConfirmDeleteLayer() {
    this.confirmDialogService.open({
      message: this.componentLiterals['TOC.LAYER.OPTIONS.DELETE_LAYER_QUESTION'],
      header: this.componentLiterals['TOC.LAYER.OPTIONS.DELETE_LAYER'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vsMapService.removeVsLayer(this.layer);
        this.toastService.showSuccess({ summary: this.componentLiterals['TOC.LAYER.OPTIONS.LAYER_DELETED'], detail: '' });
      },
      reject: () => {

      }
    });
  }
}

