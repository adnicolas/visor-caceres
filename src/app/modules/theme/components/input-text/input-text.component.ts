import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const INPUTTEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputTextComponent),
  multi: true
};


/**
 *
 * Componente input de texto. Custom Control Component
 *
 * Info de implementación:
 * <example-url>https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html</example-url>
 *
 * @author Centro de Observación y Teledetección Espacial, S.L.U.
 * @export
 * @class InputTextComponent
 * @implements {OnInit}
 * @implements {ControlValueAccessor}
 * @description https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
 * @tutorial tutorialID|https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html text}
 */
@Component({
  selector: 'the-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [INPUTTEXT_VALUE_ACCESSOR]
})
export class InputTextComponent implements ControlValueAccessor {



  @ViewChild('inputElement') inputElement: ElementRef;


  /**
   * Placeholder a mostrar en el input
   *
   * @type {string}
   * @memberof InputTextComponent
   */
  @Input() placeholder: string = '';
  /**
   * Atributo pattern para el input
   *
   * @type {string}
   * @memberof InputTextComponent
   */
  @Input() pattern: string;
  /**
   * Atributo type para el input
   *
   * @type {string}
   * @memberof InputTextComponent
   */
  @Input() type: string = 'text';
  @Input() size: string = '30';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() floatLabel: boolean = true;
  /**
   * Evento emitido al cambio del contenido del input
   *
   * @memberof InputTextComponent
   */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<string>();

  public value: string = '';



  // tslint:disable-next-line:ban-types
  propagateChange: Function = (value: any) => { };
  // tslint:disable-next-line:ban-types
  propagateTouched: Function = () => { };

  constructor() {
  }

  /**
   * Método que se llama al cambiar el valor del input
   *
   * @param {*} event
   * @memberof InputTextComponent
   */
  public handleValueChange(value) {
    this.value = value;
    // Propaga el cambio a la vista necesario para
    this.propagateChange(this.value);
    // Emite el cambio
    this.onChange.emit(this.value);
  }


  /**
   * Evento que se ejecuta en el blur del control y propaga el touched
   *
   *
   * @memberOf InputTextComponent
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

  setFocus() {
    this.inputElement.nativeElement.focus();

  }


}
