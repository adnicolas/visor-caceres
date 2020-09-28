import { Component, OnInit, Input } from '@angular/core';


/**
 * Componente que muestra una animacion que avisa al usuario que algo esta cargando
 *
 * @export
 * @class ProgressSpinnerComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {

  @Input() public size = '100%';
  @Input() public strokeWidth = 2;
  @Input() public animationDuration = '2s';
  @Input() public fill = 'none';

  constructor() { }

  ngOnInit() {
  }

}
