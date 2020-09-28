import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Menu, MenuItem } from 'primeng/primeng';


/**
 * Componente para la creación de un menú
 *
 * @export
 * @class MenuComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @ViewChild(Menu) menu: Menu;
  @Input() popup: boolean = false;
  @Input() model: MenuItem[] = [];
  @Input() styleClass: string = '';
  @Input() appendTo: any;

  constructor() { }

  ngOnInit() {
  }


  /**
   * Conmuta el estado de abierto/cerrado del menú cuando se encuentra en modo popup
   *
   * @param {*} event
   * @memberof MenuComponent
   */
  public toggle(event) {
    this.menu.toggle(event);
  }

  /**
   * Muestra el menú cuando se encuentra en modo popup
   *
   * @param {*} event
   * @memberof MenuComponent
   */
  public show(event) {
    this.menu.show(event);
  }

  /**
   * Oculta el menú cuando se encuentra en modo popup
   *
   * @param {*} event
   * @memberof MenuComponent
   */
  public hide(event) {
    this.menu.hide();
  }

}
