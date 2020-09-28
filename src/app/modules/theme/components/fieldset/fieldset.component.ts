import { Component, OnInit, Input } from '@angular/core';


/**
 * Componente que agrupa contenido, con la opcion de hacerlo toggleable
 *
 * @export
 * @class FieldsetComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.scss']
})
export class FieldsetComponent implements OnInit {
  @Input() title: string;
  @Input() collapsed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
