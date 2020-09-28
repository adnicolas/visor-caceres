import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersGroupsPageComponent } from './users-groups-page/users-groups-page.component';
import { UsersGroupsDetailPageComponent } from './users-groups-detail-page/users-groups-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { Permissions } from '@cotvisor-admin/classes/permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: UsersGroupsPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: true,
      permissions: [Permissions.USERMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: 'new',
    component: UsersGroupsDetailPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: false,
      permissions: [Permissions.USERMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: ':id',
    component: UsersGroupsDetailPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: false,
      permissions: [Permissions.USERMANAGER, Permissions.SUPERMANAGER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersGroupsPagesRoutingModule { }
