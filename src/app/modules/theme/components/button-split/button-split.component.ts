import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';


/**
 * Componente que muestra un splitbutton que despliegua un menu de opciones 
 *
 * @export
 * @class ButtonSplitComponent
 * @extends {SplitButton}
 * @implements {OnInit}
 */
@Component({
  selector: 'the-button-split',
  templateUrl: './button-split.component.html',
  styleUrls: ['./button-split.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ButtonSplitComponent extends SplitButton {
  @Input() icon: string;
  @Input() label: string = '';
  @Input() tooltip: string;
  @Input() styleClass: string;
  @Input() disabled: boolean = false;
  @Input() menuItems: MenuItem[];
  @ViewChild('splitButton') splitButton: SplitButton;
  parentClick: (event: Event, item: MenuItem) => void;
  // @ts-ignore
  constructor(private elementRef: ElementRef, private renderer2: Renderer2, public router: Router, private changeDetectorRef: ChangeDetectorRef) {
    super(elementRef, renderer2, router, changeDetectorRef);
    super.itemClick = this.itemClick; // sobreescribe el método
  }

  /**
   * Evento asignado al clic del botón
   *
   * @param {Event} event
   * @memberof ButtonSplitComponent
   */
  public split(event: Event) {
    if (this.menuItems.length > 0) this.splitButton.onDropdownButtonClick(event);
  }



}
