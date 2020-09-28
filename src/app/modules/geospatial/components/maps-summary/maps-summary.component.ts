import { Component, Input } from '@angular/core';
// import { GlobalAuthService } from '@cotvisor-admin/services';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserMapsService } from '@cotvisor-admin/services/user-maps.service';

@Component({
  selector: 'gss-maps-summary',
  templateUrl: './maps-summary.component.html',
  styleUrls: ['./maps-summary.component.scss']
})
export class MapsSummaryComponent extends ParentComponent {
  @Input() routerLink: string;
  constructor(
    // private globalAuthService: GlobalAuthService,
    public userMapsService: UserMapsService
  ) {
    super();
    // const currentUser = this.globalAuthService.getCurrentUser();
    this.userMapsService.getReadableMaps();
  }
}
