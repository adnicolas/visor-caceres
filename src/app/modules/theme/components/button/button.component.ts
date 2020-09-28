import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';


/**
 * Componente boton con opcion de mostrar un spinner "cargando"
 *
 * @export
 * @class ButtonComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'the-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent implements OnChanges {

  @Input() icon: string;
  @Input() label: string = '';
  @Input() type: string = 'button';
  @Input() tooltipPosition: string = 'top';
  @Input() tooltip: string;
  @Input() styleClass: string = 'ui-button-primary';
  @Input() disabled: boolean = false;
  @Input() showSpinner: boolean = false;
  @Input() small: boolean = false;

  private defaultIcon: string;


  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClick = new EventEmitter();


  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {

    if (!changes.showSpinner || changes.showSpinner.firstChange) return;

    if (this.showSpinner) {
      this.defaultIcon = this.icon;
      this.icon = 'pi pi-spin pi-spinner';
    } else {
      this.icon = this.defaultIcon;
    }

  }


  /**
   * Método que se llama al clicar sobre el botón
   *
   * @protected
   * @param {*} event
   * @memberof ButtonComponent
   */
  public onClickEvent(event) {
    event.cancelBubble = true;
    this.onClick.emit(event);
  }

}
