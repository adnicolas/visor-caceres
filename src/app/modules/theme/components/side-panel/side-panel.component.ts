import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BasePanelClass } from '@theme/classes/base-panel.class';
/**
 * Panel que abre desde uno de los cuatro laterales de la pantalla.
 *
 * USO
 *
 * <gss-side-panel [panelName]='panelName' position='right'>
 * <cot-base-layers class="container">\</cot-base-layers>
 * <div class="buttons">
 * <button pButton type="button" label="{{'BUTTON.SAVE'|translate}}" class="ui-button-success">\</button>
 * <button pButton type="button" label="{{'BUTTON.CANCEL'|translate}}" class="ui-button-secondary">\</button>
 * </div>
 * </gss-side-panel>
 *
 * El panel dispone de dos contenedores en los que se proyectará el elemento de clase ‘container’ y el elemento de clase ‘buttons’.
 * El contenedor container dispone de scroll para poder visualizar elementos de tamaño mayor.
 * El contenedor buttons se fija en la parte inferior del componente.
 *
 * PARAMETROS
 * Parámetro	Tipo	Valor por defecto
 * panelName	string		Nombre del panel para su gestión por el servicio de paneles
 *
 * Mediante el servicio de gestión de paneles será posible abrir o cerrar o cambiar de estado un panel que previamente haya sido registrado en él y se encuentre
 * insertado en la página.
 *
 * Por ejemplo:
 * Registro del panel:  panelsManagerService.registerPanel(panelName: string)
 * Apertura del panel panelsManagerService.openPanel(nombrePanel)
 *
 * @export
 * @class SidePanelComponent
 * @extends {BasePanelClass}
 * @implements {OnInit}
 */
@Component({
  selector: 'the-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidePanelComponent extends BasePanelClass implements OnInit {

  @Input() panelName: string = '';
  @Input() position: string = 'left';


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
