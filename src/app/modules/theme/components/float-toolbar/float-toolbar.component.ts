import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';


/**
 * Componente que muestra un toolbar flotante
 *
 * @export
 * @class FloatToolbarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-float-toolbar',
  templateUrl: './float-toolbar.component.html',
  styleUrls: ['./float-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FloatToolbarComponent implements OnInit {

  @Input() position: string = 'top';

  constructor() { }

  ngOnInit() {
  }

}
