import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapsPageComponent } from './maps-page/maps-page.component';
import { MapsDetailPageComponent } from './maps-detail-page/maps-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { Permissions } from '@cotvisor-admin/classes/permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: MapsPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      // FIXME Al guardar el estado, al pasar de detalle de mapa al visor y de visor a mapas, reaparece el mensaje de confirmación
      storeState: false,
      permissions: [Permissions.SELFMANAGER, Permissions.MAPMANAGER, Permissions.SUPERMANAGER]
    }
  },
  {
    path: ':id',
    canActivate: [PermissionsGuard],
    component: MapsDetailPageComponent,
    data: {
      permissions: [Permissions.SELFMANAGER, Permissions.MAPMANAGER, Permissions.SUPERMANAGER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsPagesRoutingModule { }
