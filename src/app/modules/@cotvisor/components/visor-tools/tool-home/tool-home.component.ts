import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AbstractParentToolComponent } from '@cotvisor/classes/parent/abstract-parent-tool.component';

/**
 * Componente que vuelve a la posicion original del visor
 *
 * @export
 * @class ToolHomeComponent
 * @extends {AbstractParentToolComponent}
 */
@Component({
  selector: 'cot-tool-home',
  templateUrl: 'tool-home.component.html',
  styleUrls: ['tool-home.component.scss']
})

export class ToolHomeComponent extends AbstractParentToolComponent {

  @Input() tooltip: string;

  constructor() {
    super();
  }
  public afterChangeActiveMap() {
  }
  public beforeChangeActiveMap() {
  }

  /**
   *
   *
   * @memberof ToolHomeComponent
   */
  public goHome() {
    this.map.getView().fit(this.map.getInitialBbox(), { duration: this.zoomDuration, maxZoom: environment.map_view.initial_zoom });
  }
}
