import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';


/**
 * Componente que muestra datos en un grid o lista con opciones para ordenar los datos
 *
 * @export
 * @class DataViewComponent
 */
@Component({
  selector: 'the-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataViewComponent {
  @Input() sortField: any;
  @Input() values: any;
  @Input() sortOrder: any;
  @Input() sortOptions: any;
  @Input() sortKey: any;
  @Input() filterField: string;
  @Input() itemsTemplate: TemplateRef<any>;

  constructor() { }


  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }


}
