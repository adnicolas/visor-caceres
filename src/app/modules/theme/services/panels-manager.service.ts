import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorTheme } from '@theme/classes/error-theme.class';
import { PanelItem } from '@theme/classes/panel-item.class';
import { Router } from '@angular/router';

// FIXME  no funciona this.router.url para diferenciar paneles, las url llevan parámetros y el visor puede llevar el parámetro del mapa cargado
/**
 * Servicio que gestiona los sidebars y permite la comunicación entre componentes
 *
 * @export
 * @class SidebarsManagerService
 */
@Injectable({
  providedIn: 'root'
})

export class PanelsManagerService {

  public registeredPanels$: Observable<PanelItem[]>;
  private registeredPanels: BehaviorSubject<PanelItem[]> = new BehaviorSubject([]);


  constructor(private router: Router) {
    this.registeredPanels$ = this.registeredPanels.asObservable();
  }


  /**
   * Registra una barra sidebar en el servicio para
   * que pueda ser abierta o cerrada desde otros componentes
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @returns {PanelItem}
   * @memberof PanelsManagerService
   */
  registerPanel(panelName: string): PanelItem {
    if (this.registeredPanels.value.some(panel => (panel.name === panelName && panel.pageUrl === this.router.url))) {
      throw new ErrorTheme('PanelsManagerService', `Panel ${panelName} ya registrado para la página ${this.router.url}.`);
    }
    const newSidebar = new PanelItem();
    newSidebar.name = panelName;
    newSidebar.pageUrl = this.router.url;
    newSidebar.visible = false;
    this.registeredPanels.next([...this.registeredPanels.value, newSidebar]);
    return newSidebar;
  }


  /**
   * Quita el panel del array de paneles registrados
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {PanelItem} panel
   * @memberof PanelsManagerService
   */
  unRegisterPanel(panel: PanelItem) {
    this.registeredPanels.next(this.registeredPanels.value.filter(el => el !== panel));
  }


  /**
   * Obtiene el item de control del panel en el servicio
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @returns {PanelItem}
   * @memberof PanelsManagerService
   */
  getPanelItem(panelName: string, pageUrl?: string): PanelItem {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      return this.registeredPanels.value.find(panel => panel.name === panelName && panel.pageUrl === pageUrl);
    }
  }


  /**
   *  Establece el flag de estado de apertura de un sidebar a true
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @memberof PanelsManagerService
   */
  openPanel(panelName: string, pageUrl?: string) {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      this.registeredPanels.value.find(panel => panel.name === panelName && panel.pageUrl === pageUrl).visible = true;
    }

  }

  /**
   * Establece el estilo en linea del panel
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @param {object} inlineStyle
   * @memberof PanelsManagerService
   */
  setInlineStylePanel(inlineStyle: object, panelName: string, pageUrl?: string) {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      this.registeredPanels.value.find(panel => panel.name === panelName && panel.pageUrl === pageUrl).inlineStyle = inlineStyle;
    }
  }


  /**
   * Establece la prop appendTo del panel
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @param {string} styleClass
   * @memberof PanelsManagerService
   */
  setClassPanel(styleClass: string, panelName: string, pageUrl?: string) {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      this.registeredPanels.value.find(panel => panel.name === panelName && panel.pageUrl === pageUrl).styleClass = styleClass;
    }
  }


  /**
   * Muestra u oculta el boton de cerrar del panel
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @param {boolean} show
   * @memberof PanelsManagerService
   */
  setButtonClosePanel(show: boolean, panelName: string, pageUrl?: string) {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      this.registeredPanels.value.find(panel => panel.name === panelName && panel.pageUrl === pageUrl).showCloseIcon = show;
    }
  }


  /**
   *  Establece el flag de estado de apertura de un sidebar a false
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @memberof PanelsManagerService
   */
  closePanel(panelName: string, pageUrl?: string) {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      this.registeredPanels.value.find(panel => panel.name === panelName && panel.pageUrl === pageUrl).visible = false;
    }
  }


  /**
   *  Cambia el flag de estado de un sidebar
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {string} panelName
   * @param {string} pageUrl
   * @memberof PanelsManagerService
   */
  togglePanel(panelName: string, pageUrl?: string) {
    if (!pageUrl) pageUrl = this.router.url;
    if (this.isRegistered(panelName, pageUrl)) {
      const panel = this.registeredPanels.value.find(el => el.name === panelName && panel.pageUrl === pageUrl);
      panel.visible = !panel.visible;
    }
  }

  /**
   * Comprueba si un panel está registrado
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @private
   * @param {string} panelName
   * @param {string} pageUrl
   * @returns {boolean}
   * @memberof PanelsManagerService
   */
  private isRegistered(panelName: string, pageUrl: string): boolean {
    if (!this.registeredPanels.value.some(panel => (panel.name === panelName && panel.pageUrl === pageUrl))) {
      throw new ErrorTheme('PanelsManagerService', `Panel ${panelName} no registrado. Compruebe que el panel está insertado en la página.`);
    }
    return true;
  }

}
