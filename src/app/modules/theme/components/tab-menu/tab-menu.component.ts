import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';


/**
 * Componente de navigacion que muestra varias entidades como pestañas
 *
 * @export
 * @class TabMenuComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabMenuComponent implements OnInit {

  @Input() items: MenuItem[] = [];
  @Input() styleClass: string = 'primary';

  @Input() activeItem: MenuItem;
  constructor() { }

  ngOnInit() {
    // Si no se ha inicializado el item activo, selecciona el primero
    if (!this.activeItem && this.items.length) {
      this.activeItem = this.items[0];
    }
  }
}
