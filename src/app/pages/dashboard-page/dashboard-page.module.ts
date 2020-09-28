import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisorAdminInterceptor } from '@cotvisor-admin/services';
import { GeospatialModule } from '@geospatial/geospatial.module';

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  providers: [
    PermissionsGuard,
    // Al ser un módulo Lazy Load hay que declarar el interceptor
    { provide: HTTP_INTERCEPTORS, useClass: VisorAdminInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GeospatialModule
  ]
})
export class DashboardPageModule { }
