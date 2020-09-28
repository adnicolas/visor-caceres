import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';


/**
 * Componente que define el dialog al cambiar su valor 'visible'
 *
 * @export
 * @class DialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// TODO: Solucionar ocultación de footer cuando no se inserta nada
export class DialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() closable?: boolean = true;
  @Input() modal?: boolean = false;
  @Input() header?: string;
  @Input() styleClass?: string;
  @Input() showHeader?: boolean = true;
  @Input() appendTo?: string;
  @Output() visibleChange = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

  /**
   * Método que se llama al cambiar el valor de visibilidad
   *
   * @protected
   * @param {*} event
   * @memberof DialogComponent
   */
  public handleVisibleChange(event) {
    this.visibleChange.emit(event);
  }
}
