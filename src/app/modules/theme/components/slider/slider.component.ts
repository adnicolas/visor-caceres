import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';



/**
 * Componente que mustra un input de una barra con un valor desplazable
 *
 * @export
 * @class SliderComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class SliderComponent implements OnInit {
  @Input() animate: boolean = false;
  @Input() disabled: boolean = false;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() value: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter();
  @Output() slideEnd: EventEmitter<number> = new EventEmitter();
  constructor() {

  }
  ngOnInit() {

  }

  /**
   * Método que se llama al cambiar el valor del input
   *
   * @param {*} event
   * @memberof SliderComponent
   */
  public handleChange(event) {
    this.valueChange.emit(event.value);
  }

  /**
   * Método que se llama al parar de mover el slider
   *
   * @param {*} event
   * @memberof SliderComponent
   */
  public handleSlideEnd(event) {
    this.slideEnd.emit(event.value);
  }
}
