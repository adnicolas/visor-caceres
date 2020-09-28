import { Component, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';

@Component({
  selector: 'cot-toc-layer-item',
  templateUrl: 'toc-layer-item.component.html',
  styleUrls: ['toc-layer-item.component.scss']
})
export class TocLayerItemComponent extends ParentComponent {
  @Input() public layer: VsLayer;
  public showInfo = false;
  public openLegendWindow: boolean = false;

  constructor() {
    super();
  }

  public toggleLegendWindow() {
    this.openLegendWindow = !this.openLegendWindow;
  }

  public showLayerInfoBox() {
    if ((this.layer instanceof VsLayerWMS || this.layer instanceof VsLayerWMTS) && this.layer.activeStyle && this.layer.activeStyle.legendURL.length) {
      this.showInfo = !this.showInfo;
    }
  }
  public onLegendWindowClose() {
    this.openLegendWindow = !this.openLegendWindow;
  }
}
