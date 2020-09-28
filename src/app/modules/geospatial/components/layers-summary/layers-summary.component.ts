import { Component, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { LayersService } from '@cotvisor-admin/services/layers.service';

@Component({
  selector: 'gss-layers-summary',
  templateUrl: './layers-summary.component.html',
  styleUrls: ['./layers-summary.component.scss']
})
export class LayersSummaryComponent extends ParentComponent {
  layersCount: number;
  @Input() routerLink: string;

  constructor(
    public layersService: LayersService
  ) {
    super();
    // this.layersService.getAll();
    this.layersService.getWithPermission();
  }
}
