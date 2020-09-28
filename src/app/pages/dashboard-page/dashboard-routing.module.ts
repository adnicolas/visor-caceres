import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [PermissionsGuard],
    data: {
      storeState: false
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]



})
export class DashboardRoutingModule { }
