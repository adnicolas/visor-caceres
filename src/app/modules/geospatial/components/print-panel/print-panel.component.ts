import { Component } from '@angular/core';

@Component({
  selector: 'gss-print-panel',
  templateUrl: './print-panel.component.html',
  styleUrls: ['./print-panel.component.scss']
})
export class PrintPanelComponent {

  panelName = 'Impresión';

  constructor() { }

  /**
   * Imprime
   *
   * @memberof PrintPanelComponent
   */
  public print() {
    window.print();
  }

}
