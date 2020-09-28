import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownComponent),
  multi: true
};


/**
 *
 * Componente dropdown. Custom Control Component
 *
 * Info de implementación:
 * <example-url>https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html</example-url>
 *
 * @author Centro de Observación y Teledetección Espacial, S.L.U.
 * @export
 * @class DropdownComponent
 * @implements {OnInit}
 * @implements {ControlValueAccessor}
 * @description https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
 * @tutorial tutorialID|https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html text}
 */
@Component({
  selector: 'the-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [DROPDOWN_VALUE_ACCESSOR]
})
export class DropdownComponent implements OnInit, ControlValueAccessor {

  /**
   * Placeholder a mostrar en el input
   *
   * @type {string}
   * @memberof DropdownComponent
   */
  @Input() placeholder: string = '';
  /**
   * Atributo type para el input
   *
   * @type {string}
   * @memberof DropdownComponent
   */
  @Input() options: any[] = [];
  @Input() optionLabel: string = null;
  @Input() name: string = null;
  @Input() styleClass: string = null;
  @Input() disabled: boolean = false;

  /**
   * Evento emitido al cambio del contenido del input
   *
   * @memberof DropdownComponent
   */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<string>();

  public value: any;

  // tslint:disable-next-line:ban-types
  propagateChange: Function = (value: any) => { };
  // tslint:disable-next-line:ban-types
  propagateTouched: Function = () => { };

  constructor() { }

  ngOnInit() {
  }

  /**
   * Método que se llama al cambiar el valor del input
   *
   * @param {*} event
   * @memberof DropdownComponent
   */
  public handleValueChange(event) {
    this.value = event.value;
    // Propaga el cambio a la vista necesario para
    this.propagateChange(this.value);
    // Emite el cambio
    this.onChange.emit(this.value);
  }


  /**
   * Evento que se ejecuta en el blur del control y propaga el touched
   *
   *
   * @memberOf DropdownComponent
   */
  onBlur() {
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
