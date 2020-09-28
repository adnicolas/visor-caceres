import { Component, OnInit, Input, Output, EventEmitter, forwardRef, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutoCompleteComponent),
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
 * @class AutoCompleteComponent
 * @implements {OnInit}
 * @implements {ControlValueAccessor}
 * @description https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
 * @tutorial tutorialID|https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html text}
 */
@Component({
  selector: 'the-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class AutoCompleteComponent implements OnInit, ControlValueAccessor {




  /**
   * Placeholder a mostrar en el input
   *
   * @type {string}
   * @memberof AutoCompleteComponent
   */
  @Input() placeholder: string = '';
  /**
   * Atributo type para el input
   *
   * @type {string}
   * @memberof AutoCompleteComponent
   */
  @Input() type: string = 'text';
  @Input() size: string = '30';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() suggestions: any[] = null;
  @Input() minLength: number = 1;
  @Input() emptyMessage: string = null;
  @Input() dropdown: boolean = false;
  @Input() name: string = null;

  /**
   * La clave a mostrar de los objectos en el array de suggestions
   *
   * @type {string}
   * @memberof AutoCompleteComponent
   */
  @Input() field: string = null;
  @Input() itemsTemplate: TemplateRef<any>;

  /**
   * Evento emitido al cambio del contenido del input
   *
   * @memberof AutoCompleteComponent
   */
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<string>();

  /**
   * Evento emitido al introducir algo con el teclado
   *
   * @memberof AutoCompleteComponent
   */
  @Output() keyUp = new EventEmitter<Event>();

  /**
   * Evento emitido al introducir algo con el teclado
   *
   * @memberof AutoCompleteComponent
   */
  @Output() complete = new EventEmitter<Event>();


  public value: string = '';

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
   * @memberof AutoCompleteComponent
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
   * @memberOf AutoCompleteComponent
   */
  onBlur() {
    this.propagateTouched();

  }

  public emitKeyUp(event) {
    this.keyUp.emit(event);
  }

  public emitComplete(event) {
    this.complete.emit(event);
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
