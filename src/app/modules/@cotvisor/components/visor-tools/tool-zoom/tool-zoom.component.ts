import { Component, Input } from '@angular/core';
import { AbstractParentToolComponent } from '@cotvisor/classes/parent/abstract-parent-tool.component';

@Component({
  selector: 'cot-tool-zoom',
  templateUrl: 'tool-zoom.component.html',
  styleUrls: ['tool-zoom.component.scss']
})
export class ToolZoomComponent extends AbstractParentToolComponent {
  @Input() tooltipIn: string;
  @Input() tooltipOut: string;

  constructor() {
    super();
  }

  public afterChangeActiveMap() { }
  public beforeChangeActiveMap() { }

  public zoomLess(): void {
    const view = this.map.getView();
    view.animate({ zoom: view.getZoom() - 1, duration: this.zoomDuration });
  }

  public zoomIn(): void {
    const view = this.map.getView();
    view.animate({ zoom: view.getZoom() + 1, duration: this.zoomDuration });
  }

}
