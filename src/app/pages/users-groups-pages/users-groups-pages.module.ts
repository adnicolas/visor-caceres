import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersGroupsPageComponent } from './users-groups-page/users-groups-page.component';
import { UsersGroupsDetailPageComponent } from './users-groups-detail-page/users-groups-detail-page.component';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';
import { GeospatialModule } from '@geospatial/geospatial.module';
import { ThemeModule } from '@theme/theme.module';
import { UsersGroupsPagesRoutingModule } from './users-groups-pages-routing.module';


@NgModule({
  declarations: [UsersGroupsPageComponent, UsersGroupsDetailPageComponent],
  imports: [
    CommonModule,
    UsersGroupsPagesRoutingModule,
    ThemeModule,
    GeospatialModule
  ],
  providers: [
    PermissionsGuard
  ]
})
export class UsersGroupsPagesModule { }
