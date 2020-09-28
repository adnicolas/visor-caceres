import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente para anadir capas que se pasa al dialogService
 *
 * @export
 * @class TocAddLayerDialogComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'gss-layers-loader-dialog',
  templateUrl: 'layers-loader.component.html',
  styleUrls: ['layers-loader.component.scss']
})
export class LayersLoaderComponent extends ParentComponent implements OnInit {
  public tabs: MenuItem[];
  public activeTab: MenuItem;

  constructor() {
    super();
  }
  public ngOnInit(): void {
    this.tabs = [
      {
        /* icon: 'fas fa-server', */
        id: 'wms',
        command: () => {
          this.changeActiveTab('wms');
        },
        visible: true
      },
      {
        /* icon: 'fas fa-server', */
        id: 'wfs',
        command: () => {
          this.changeActiveTab('wfs');
        },
        visible: true
      },
      {
        /* icon: 'fas fa-layer-group', */
        id: 'locales',
        command: () => {
          this.changeActiveTab('locales');
        },
        visible: true
      },
    ];

    // Asignamos las etiquetas del lenguaje activo y nos subscribimos a los cambios de idioma que se hagan
    this.onComponentLiteralsChange
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(() => {
        this.tabs[0].label = this.componentLiterals['LAYERS_LOADER.WMS'];
        this.tabs[1].label = this.componentLiterals['LAYERS_LOADER.WFS'];
        this.tabs[2].label = this.componentLiterals['LAYERS_LOADER.LOCAL'];
      });
    this.useLiterals(['LAYERS_LOADER.WMS', 'LAYERS_LOADER.WFS', 'LAYERS_LOADER.LOCAL']);
    this.activeTab = this.tabs[0];

  }

  /**
   * Método llamado al cambiar de pestaña para conocer la pestaña activa
   *
   * @private
   * @param {string} activeTab
   * @memberof LocalLayerLoaderComponent
   */
  private changeActiveTab(activeTab: string) {
    this.activeTab = this.tabs.find((tab) => tab.id === activeTab);
  }
}
