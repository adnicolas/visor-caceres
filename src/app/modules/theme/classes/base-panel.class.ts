import { PanelItem } from './panel-item.class';
import { PanelsManagerService } from '@theme/services/panels-manager.service';
import { InjectorService } from '@cotvisor/services/injector.service';
import { OnDestroy } from '@angular/core';

/**
 * Clase base para los paneles del tema.
 * Se inyecta el servicio de paneles y se registra el panel
 *
 * @export
 * @class BasePanelClass
 */
export class BasePanelClass implements OnDestroy {

  public sidebarItem: PanelItem;
  protected sidebarsManagerService: PanelsManagerService;
  protected panelName: string;

  constructor() {
    this.sidebarsManagerService = InjectorService.injector.get(PanelsManagerService);
  }


  /**
   * Registra el panel en el servicio, será llamado por los componentes que extiendan la clase
   * y reciban el nombre como parámetro de entrada
   */
  protected register(panelName: string): PanelItem {
    this.panelName = panelName;
    this.sidebarItem = this.sidebarsManagerService.registerPanel(this.panelName);
    return this.sidebarItem;
  }

  protected unRegister() {
    this.sidebarsManagerService.unRegisterPanel(this.sidebarItem);
  }

  ngOnDestroy() {
    this.unRegister();
  }

  /**
   * Abre el panel, método para ser llamado desde el mismo panel
   */
  openPanel() {
    this.sidebarsManagerService.openPanel(this.panelName);
  }


  /**
   * Cierra el panel, método para ser llamado desde el mismo panel
   */
  closePanel() {
    this.sidebarsManagerService.closePanel(this.panelName);
  }

  /**
   * Cambia estado del panel, método para ser llamado desde el mismo panel
   */
  togglePanel() {
    this.sidebarsManagerService.togglePanel(this.panelName);
  }

}
