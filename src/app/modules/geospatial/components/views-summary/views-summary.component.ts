import { Component, Input } from '@angular/core';
import { ViewConfigsService } from '@cotvisor-admin/services';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';

@Component({
  selector: 'gss-views-summary',
  templateUrl: './views-summary.component.html',
  styleUrls: ['./views-summary.component.scss']
})
export class ViewsSummaryComponent extends ParentComponent {
  @Input() routerLink: string;

  constructor(
    public viewConfigsService: ViewConfigsService
  ) {
    super();
    this.viewConfigsService.getAll();
  }
}
