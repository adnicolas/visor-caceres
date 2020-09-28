import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';


/**
 * Componente de un contenedor tipo "tarjeta"
 *
 * @export
 * @class CardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() styleClass: string;

  constructor() { }

  ngOnInit() {
  }

}
