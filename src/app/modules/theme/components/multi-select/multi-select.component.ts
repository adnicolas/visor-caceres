import { Component, OnInit, Output, Input, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelectComponent),
  multi: true
};

/**
 * Componente de selección de lista
 *
 * @export
 * @class MultiSelectComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [MULTISELECT_VALUE_ACCESSOR]
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {


  constructor() { }


  @Input() options: any[];
  @Input() optionLabel?: string;
  @Input() disabled?: boolean = false;
  @Input() styleClass?: string = null;
  @Input() defaultLabel?: string = null;
  @Input() name?: string = null;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<any>();
  @Input() selectedItemsLabel?: string = '{0} elementos seleccionados';

  public value: any;

  // tslint:disable-next-line:ban-types
  propagateChange: Function = (value: any) => { };
  // tslint:disable-next-line:ban-types
  propagateTouched: Function = () => { };

  ngOnInit() {
  }


  /**
   * Método que se llama al cambiar el valor del input
   *
   * @param {*} value
   * @memberof MultiSelectComponent
   */
  public handleValueChange(event) {
    this.value = event.value;
    // Propaga el cambio a la vista necesario para
    this.propagateChange(this.value);
    // Emite el cambio
    this.onChange.emit(this.value);

  }

  public getOptionLabel(option) {
    let label = '';
    if (this.options.length > 0) {
      // tslint:disable-next-line: no-string-literal
      label = this.options.find(opt => opt.value === option)['label'];
    } else if (this.optionLabel) {
      label = option[this.optionLabel];
    }
    return label;
  }

  /**
   *  Propaga el evento touched para el Angular API Form
   *
   *
   * @memberOf MultiSelectComponent
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
