import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


// tslint:disable:no-use-before-declare
export const INPUTTEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTextAreaComponent),
  multi: true
};

/**
 * Componente text-area con la opcion de cambiar su tamaño a mano
 *
 * @export
 * @class InputTextAreaComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrls: ['./input-text-area.component.scss'],
  providers: [INPUTTEXTAREA_VALUE_ACCESSOR]
})
export class InputTextAreaComponent implements OnInit, ControlValueAccessor {

  value: string = '';
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<string>();
  @Input() placeholder: string = '';
  @Input() rows: string = '5';
  @Input() cols: string = '30';
  @Input() autoResize: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;



  // tslint:disable-next-line:ban-types
  propagateChange: (value: any) => {};
  // tslint:disable-next-line:ban-types
  propagateTouched: () => {};

  constructor() { }

  ngOnInit() {
  }

  /**
   * Método que se llama al cambiar el valor del input
   *
   * @param {*} event
   * @memberof InputTextComponent
   */
  public handleValueChange(value: any) {
    this.propagateChange(value);
    this.onChange.emit(value);
  }


  public onBlur() {
    this.propagateTouched();

  }


  // Métodos para implementar el interfaz ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


}
