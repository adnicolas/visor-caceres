import { Component } from '@angular/core';
import { UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService, UserMapsService, ViewConfigsService, LayersService } from '@cotvisor-admin/services';

@Component({
  selector: 'gss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  currentUser: UserModel;

  constructor(
    private globalAuthService: GlobalAuthService,
    public viewConfigsService: ViewConfigsService,
    public userMapsService: UserMapsService,
    public layersService: LayersService
  ) {
    this.currentUser = this.globalAuthService.getCurrentUser();
    this.viewConfigsService.getAll();
    // this.layersService.getAll();
    this.layersService.getWithPermission();
    this.userMapsService.getReadableMaps();
    this.userMapsService.getFavouriteMaps(this.currentUser.id);
  }
}
