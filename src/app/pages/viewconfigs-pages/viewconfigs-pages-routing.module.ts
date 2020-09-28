import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewConfigsPageComponent } from './viewconfigs-page/viewconfigs-page.component';
import { ViewConfigsDetailPageComponent } from './viewconfigs-detail-page/viewconfigs-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { Permissions } from '@cotvisor-admin/classes/permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: ViewConfigsPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: false,
      permissions: [Permissions.SELFMANAGER, Permissions.VIEWCONFIGMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: 'new',
    component: ViewConfigsDetailPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      // FIXME Al guardar el estado, al pasar de detalle de mapa al visor y de visor a mapas, reaparece el mensaje de confirmación
      storeState: false,
      permissions: [Permissions.SELFMANAGER, Permissions.VIEWCONFIGMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: ':id',
    component: ViewConfigsDetailPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      // FIXME Al guardar el estado, al pasar de detalle de mapa al visor y de visor a mapas, reaparece el mensaje de confirmación
      storeState: false,
      permissions: [Permissions.SELFMANAGER, Permissions.VIEWCONFIGMANAGER, Permissions.SUPERMANAGER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewConfigsPagesRoutingModule { }
