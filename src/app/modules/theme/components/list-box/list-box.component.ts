import { Component, OnInit, Output, Input, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const LISTBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ListBoxComponent),
  multi: true,
};

/**
 * Componente de selección de lista
 *
 * @export
 * @class ListBoxComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-list-box',
  templateUrl: './list-box.component.html',
  styleUrls: ['./list-box.component.scss'],
  providers: [LISTBOX_VALUE_ACCESSOR],
})
export class ListBoxComponent implements OnInit, ControlValueAccessor {
  constructor() { }

  @Input() options: any[];
  @Input() optionLabel?: string;
  @Input() multiple?: boolean;
  @Input() disabled?: boolean;
  @Input() checkbox?: boolean;
  @Input() filter?: boolean;
  @Input() styleClass?: string;
  @Input() inputHeader?: string;
  @Input() metaKeySelection?: boolean;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<any>();

  public value: any;

  // tslint:disable-next-line:ban-types
  propagateChange: Function = (value: any) => { };
  // tslint:disable-next-line:ban-types
  propagateTouched: Function = () => { };

  ngOnInit() { }

  /**
   * Método que se llama al cambiar el valor del input
   *
   * @param {*} value
   * @memberof ListBoxComponent
   */
  public handleValueChange(event) {
    this.value = event.value;
    // Propaga el cambio a la vista necesario para
    this.propagateChange(this.value);
    // Emite el cambio
    this.onChange.emit(this.value);
  }

  /**
   *  Propaga el evento touched para el Angular API Form
   *
   *
   * @memberOf ListBoxComponent
   */
  public touched() {
    this.propagateTouched();
  }

  // Métodos para implementar el interfaz ControlValueAccessor
  writeValue(value: any): void {
    if (value !== undefined) this.value = value;
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
