import { Component } from '@angular/core';

import { UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService } from '@cotvisor-admin/services';

@Component({
  selector: 'gss-user-maps-visor-loader',
  templateUrl: './user-maps-visor-loader.component.html',
  styleUrls: ['./user-maps-visor-loader.component.scss']
})
export class UserMapsVisorLoaderComponent {
  currentUser: UserModel;
  loaderDialogRef: any;

  constructor(private globalAuthService: GlobalAuthService) {
    this.currentUser = this.globalAuthService.getCurrentUser();
  }


}
