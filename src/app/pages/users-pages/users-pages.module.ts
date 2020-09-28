import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersPageComponent } from './users-page/users-page.component';
import { UsersDetailPageComponent } from './users-detail-page/users-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { GeospatialModule } from '@geospatial/geospatial.module';
import { ThemeModule } from '@theme/theme.module';
import { UsersPagesRoutingModule } from './users-pages-routing.module';


@NgModule({
  declarations: [UsersPageComponent, UsersDetailPageComponent],
  imports: [
    CommonModule,
    UsersPagesRoutingModule,
    ThemeModule,
    GeospatialModule
  ],
  providers: [
    PermissionsGuard
  ]
})
export class UsersPagesModule { }
