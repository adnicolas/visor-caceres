import { Component, OnInit, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const INPUTGROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputGroupComponent),
  multi: true
};

/**
 *  Componente que muestra un input con un botón asociado
 *
 * @export
 * @class InputGroupComponent
 * @implements {OnInit}
 * @implements {ControlValueAccessor}
 */
@Component({
  selector: 'the-input-group',
  templateUrl: './input-group.component.html',
  styleUrls: ['./input-group.component.scss'],
  providers: [INPUTGROUP_VALUE_ACCESSOR]
})
export class InputGroupComponent implements OnInit, ControlValueAccessor {



  /**
   * Placeholder para el input del componente (HTML)
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() placeholder: string = '';

  /**
   * Nombre para el input del componente (HTML)
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() name: string = '';
  /**
   * Pattern para el input del componente (HTML)
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() pattern: string;
  /**
   *  Indica si el control es de tamaño reducido
   *
   * @type {boolean}
   * @memberOf InputGroupComponent
   */
  @Input() small: boolean = false;
  /**
   *  Tipo para el input (HTML)
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() type: string = 'text';
  /**
   * Indica si el input es requerido (HTML)
   *
   * @type {boolean}
   * @memberOf InputGroupComponent
   */
  @Input() required: boolean = false;
  /**
   * Icono para el input
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() iconInput?: string;

  // Button inputs
  /**
   * Etiqueta para el botón
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() labelButton: string = '';
  /**
   * Icono para el botón
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() iconButton: string;
  /**
   * Tooltip para mostrar al pasar sobre el botón
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() tooltip: string = '';
  /**
   * Posición para el tooltip del botón
   *
   * @type {string}
   * @memberOf InputGroupComponent
   */
  @Input() tooltipPosition: string = 'top';
  /**
   * Flag para mostrar u ocultar el spinner en el botón. Mientras se muestra el spinner el botón queda deshabilitado
   *
   * @type {boolean}
   * @memberOf InputGroupComponent
   */
  @Input() showSpinner: boolean = false;
  /**
   * Establece el botón como deshabilitado
   *
   * @type {boolean}
   * @memberOf InputGroupComponent
   */
  @Input() disabled: boolean = false;

  /**
   * La contraseña indica lo fuerte que es en los campos de tipo contraseña.
   *
   * @type {boolean}
   * @memberof InputGroupComponent
   */
  @Input() passwordIndicator: boolean = false;
  /**
   * Evento que se emite al hacer click en el botón
   *
   *
   * @memberOf InputGroupComponent
   */
  @Output() clickButton = new EventEmitter();
  /**
   * Evento que se emite al cambiar el valor del input
   *
   *
   * @memberOf InputGroupComponent
   */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<string>();

  public value: string = '';
  // tslint:disable-next-line:ban-types
  propagateChange: Function = (value: any) => { };
  // tslint:disable-next-line:ban-types
  propagateTouched: Function = () => { };


  constructor() { }

  ngOnInit() {
    if (this.required) this.placeholder = this.placeholder + '*';
  }


  /**
   * Método que se llama al clicar sobre el botón
   *
   * @param {*} event
   * @memberof InputGroupComponent
   */
  public clickEvent(event) {
    this.clickButton.emit(event);
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
   * @memberof InputTextComponent
   */
  public onBlur() {
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
