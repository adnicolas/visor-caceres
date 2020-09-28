import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersPageComponent } from './users-page/users-page.component';
import { UsersDetailPageComponent } from './users-detail-page/users-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { Permissions } from '@cotvisor-admin/classes/permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: UsersPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: true,
      permissions: [Permissions.USERMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: ':id',
    component: UsersDetailPageComponent,
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
export class UsersPagesRoutingModule { }
