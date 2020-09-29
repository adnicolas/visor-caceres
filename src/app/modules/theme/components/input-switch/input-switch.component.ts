import { Component, EventEmitter, Output, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const INPUTSWITCH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSwitchComponent),
  multi: true
};

/**
 * Componente que muestra un selector de true/false
 *
 * @export
 * @class InputSwitchComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-input-switch',
  templateUrl: './input-switch.component.html',
  styleUrls: ['./input-switch.component.scss'],
  providers: [INPUTSWITCH_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class InputSwitchComponent implements ControlValueAccessor {

  @Input() toolTip: string;
  @Input() label: string;
  @Input() small: string = '';
  @Input() darkMode: string = '';
  @Input() disabled: boolean = false;

  value: boolean;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<boolean>();

  // tslint:disable-next-line:ban-types
  onModelChange: Function = () => { };
  // tslint:disable-next-line:ban-types
  onModelTouched: Function = () => { };


  constructor() { }



  /**
   * Evento al cambiar el valor del input
   *
   * @param {*} event
   * @memberof InputSwitchComponent
   */
  public handleChange(event) {
    this.onModelChange(event.checked);
    this.onModelTouched();
    this.onChange.emit(event.checked);
  }

  // Métodos para implementar el interfaz ControlValueAccessor
  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
