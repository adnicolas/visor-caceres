import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayersPageComponent } from './layers-page/layers-page.component';
import { LayersDetailPageComponent } from './layers-detail-page/layers-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { Permissions } from '@cotvisor-admin/classes/permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: LayersPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: false,
      permissions: [Permissions.SELFMANAGER, Permissions.LAYERMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: ':id',
    component: LayersDetailPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: false,
      permissions: [Permissions.SELFMANAGER, Permissions.LAYERMANAGER, Permissions.SUPERMANAGER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayersPagesRoutingModule { }
