import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';


/**
 * Componente que muestra un toggle con el estilo de un boton
 *
 * @export
 * @class ButtonToggleComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonToggleComponent implements OnInit {

  @Input() tooltip = '';
  @Input() tooltipPosition = 'left';
  @Input() styleClass: string;

  @Input() onLabel = '';
  @Input() offLabel = '';
  @Input() onIcon = 'fa fa-check';
  @Input() offIcon;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter();
  private _checked: boolean = null;
  @Input() disabled = false;
  @Input() small = false;

  constructor() { }

  ngOnInit() {
    if (!this.offIcon) this.offIcon = this.onIcon;
  }

  // Si this.state es nulo es la inicialización del componente
  // por lo que no se emite evento , tampoco cuando el valor no ha cambiado.
  @Input()
  get checked() {
    return this._checked;
  }
  set checked(val: boolean) {

    if (this._checked === null) {
      this._checked = false;
    } else {
      this.checkedChange.emit(val);
      this._checked = val;
    }

  }

}
