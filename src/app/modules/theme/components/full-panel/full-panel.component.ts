import { Component, OnInit, Input } from '@angular/core';
import { BasePanelClass } from '@theme/classes/base-panel.class';


/**
 * Componente que muestra un panel en pantalla completa
 *
 * @export
 * @class FullPanelComponent
 * @extends {BasePanelClass}
 * @implements {OnInit}
 */
@Component({
  selector: 'the-full-panel',
  templateUrl: './full-panel.component.html',
  styleUrls: ['./full-panel.component.scss']
})
export class FullPanelComponent extends BasePanelClass implements OnInit {

  @Input() panelName: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.panelName === '') {
      throw Error('No se ha recibido el nombre del panel');
    }
    this.sidebarItem = this.register(this.panelName);
  }

}
