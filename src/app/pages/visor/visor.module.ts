import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorRoutingModule } from './visor-routing.module';
import { VisorComponent } from './visor.component';
import { CotVisorModule } from '@cotvisor/cot-visor.module';
import { VisorToolsModule } from '@cotvisor/components/visor-tools/visor-tools.module';
import { ThemeModule } from '@theme/theme.module';
import { GeospatialModule } from '@geospatial/geospatial.module';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { CotVisorAdminModule } from '@cotvisor-admin/cot-visor-admin.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisorAdminInterceptor } from '@cotvisor-admin/services';

@NgModule({
  declarations: [VisorComponent],
  imports: [
    CommonModule,
    VisorRoutingModule,
    CotVisorModule,
    CotVisorAdminModule,
    VisorToolsModule,
    GeospatialModule,
    ThemeModule
  ],
  providers: [
    PermissionsGuard,
    // Interceptor del módulo de administración
    // Al ser un módulo Lazy Load hay que declarar el interceptor si se quiere que se pueda acceder directamente
    // a la url de la página http://localhost:4200/visor
    { provide: HTTP_INTERCEPTORS, useClass: VisorAdminInterceptor, multi: true }
  ]
})
export class VisorModule { }
