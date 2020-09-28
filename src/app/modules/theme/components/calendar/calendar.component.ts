import { Component, Input, Output, EventEmitter } from '@angular/core';


/**
 * Componente para elegir fechas
 *
 * @export
 * @class CalendarComponent
 */
@Component({
  selector: 'the-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Input() date: Date = null;
  @Input() defaultDate: Date = null;
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() showIcon: boolean = null;
  @Input() inputStyleClass: string = null; // clase css de la barra input del calendar
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  // calendario español
  public locale = {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Borrar'
  };


  constructor() {

  }

  /**
   * Gestiona el cambio de fecha sobre el calendario
   *
   * @protected
   * @param {Event} event
   * @memberof CalendarComponent
   */
  public handleSelectChange(event: Event) {
    this.onChange.emit(event);
  }


  /**
   * Gestiona el cambio de fecha al cambiarla manualmente en el input
   *
   * @protected
   * @param {Event} event
   * @memberof CalendarComponent
   */
  public handleChange(event: Event) {
    this.onChange.emit(this.date);
  }

}
