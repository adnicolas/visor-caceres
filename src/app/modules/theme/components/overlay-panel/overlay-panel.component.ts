import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';


/**
 * Componente que muestra una ventana sobre encima de otros componentes
 *
 * @export
 * @class OverlayPanelComponent
 */
@Component({
  selector: 'the-overlay-panel',
  templateUrl: './overlay-panel.component.html',
  styleUrls: ['./overlay-panel.component.scss']
})
export class OverlayPanelComponent {
  @Input() dismissable: boolean = false;
  @Input() showCloseIcon: boolean = false;
  @Input() styleClass: string = null;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  constructor() {

  }

  /**
   * Evento asignado al clic del botón
   *
   * @param {Event} event
   * @memberof OverlayPanelComponent
   */
  public toggle(event: Event) {
    this.overlayPanel.toggle(event);
  }

  public onClose(event: Event) {
    this.closed.emit(true);
  }

}
