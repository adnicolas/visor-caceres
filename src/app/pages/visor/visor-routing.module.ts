import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisorComponent } from './visor.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';

const routes: Routes = [
  {
    path: '',
    component: VisorComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: true
    }
    // },
    // {
    //   path: 'nuevo',
    //   component: VisorComponent,
    //   canActivate: [VisorIsLoggedGuard],
    //   data: {
    //     storeState: false
    //   }
    // Debido al uso de reuse-strategy los mapas llegan por queryparams no en la URL, de esta forma
    // sólo tenemos una página visor a la que aplicar la estrategia
    // },
    // {
    //   path: ':id',
    //   component: VisorComponent,
    //   canActivate: [VisorIsLoggedGuard],
    //   data: {
    //     storeState: true
    //   }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorRoutingModule { }
