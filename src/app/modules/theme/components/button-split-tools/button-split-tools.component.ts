import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonItem } from '@theme/classes/button-item.class';

const ACTIVE_CLASS = 'ui-state-active';
const INACTIVE_CLASS = 'ui-state-default';

/**
 * Componente que muestra un splitbutton que despliega las opciones como botones
 *
 * @export
 * @class ButtonSplitComponent
 * @extends {SplitButton}
 * @implements {OnInit}
 */
@Component({
  selector: 'the-button-split-tools',
  templateUrl: './button-split-tools.component.html',
  styleUrls: ['./button-split-tools.component.scss'],
  encapsulation: ViewEncapsulation.None

})
// TODO propiedad para marcar como activo
export class ButtonSplitToolsComponent implements OnInit {
  @Input() icon: string;
  @Input() tooltip: string;
  @Input() styleClass?: string;
  @Input() disabled: boolean = false;
  @Input() buttonItems: ButtonItem[];
  @Input() direction: string = 'right';
  public buttonsVisible: boolean;
  private _active: boolean = null;
  private _activeClass: string;
  private _inactiveClass: string;
  private defaultIcon: string;
  private defaultTooltip: string;
  private activeMenuItem: MenuItem;




  constructor() { }

  ngOnInit() {

    this.defaultIcon = this.icon;
    this.defaultTooltip = this.tooltip;

    this._inactiveClass = `${INACTIVE_CLASS} ${this.styleClass}`;
    this._activeClass = `${ACTIVE_CLASS} ${this.styleClass}`;
    this.resetMenuItems();
  }

  /**
   * Establece la herramienta global como activa o desactiva
   *
   *
   * @memberOf ButtonSplitToolsComponent
   */
  @Input()
  set active(val: boolean) {

    if (this._active === null) {
      this._active = false;
    } else {
      this._active = val;
      if (!this._active) this.resetMenuItems();
    }

  }

  get active() {
    return this._active;
  }

  /**
   * Evento asignado al clic del botón
   *
   * @param {Event} event
   * @memberof ButtonSplitComponent
   */
  public split(event: Event) {

    this.buttonsVisible = !this.buttonsVisible;
    if (this.buttonsVisible) this.tooltip = null;
    else this.tooltip = this.defaultTooltip;

    // Si los botones están visibles se muestra el icono de cierre y el botón como inactivo
    if (this.buttonsVisible) {
      this.icon = this.getCloseDirectionIcon();
      this.styleClass = this._inactiveClass;
    } else {
      // Si no lo están, si hay herramienta activa se muestra su icono activado
      if (this.activeMenuItem) {
        this.icon = this.activeMenuItem.icon;
        this.styleClass = this._activeClass;
      } else {
        this.icon = this.defaultIcon;
        this.styleClass = this._inactiveClass;
      }
    }
  }

  /**
   * Método al hacer clic en un elemento desplegado
   *
   * @param {Event} _event
   * @param {MenuItem} item
   * @memberof ButtonSplitComponent
   */
  itemClick(_event: Event, item: ButtonItem) {
    // Evita que el boton de despliegue responda a los clics en items
    _event.stopPropagation();
    if (this.activeMenuItem) {
      this.activeMenuItem.styleClass = this._inactiveClass;
      this.activeMenuItem = null;
    }
    if (item.toggleButton) {
      this.activeMenuItem = item;
      this.activeMenuItem.styleClass = this._activeClass;
    }
    item.command();


  }

  private resetMenuItems() {

    this.buttonItems.forEach(item => item.styleClass = this._inactiveClass);
    if (!this.buttonsVisible) this.icon = this.defaultIcon;
    this.activeMenuItem = null;
    this.styleClass = this._inactiveClass;
  }

  /**
   * Devuelve
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @private
   * @memberof ButtonSplitToolsComponent
   */
  private getCloseDirectionIcon(): string {
    switch (this.direction) {
      case 'left':
        return 'pi pi-chevron-right';
      case 'right':
        return 'pi pi-chevron-left';
      case 'top':
        return 'pi pi-chevron-down';
      case 'bottom':
        return 'pi pi-chevron-up';
      case 'default':
        return 'pi pi-chevron-left';
    }
  }



}
