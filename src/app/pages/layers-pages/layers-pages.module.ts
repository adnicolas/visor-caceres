import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayersPageComponent } from './layers-page/layers-page.component';
import { LayersDetailPageComponent } from './layers-detail-page/layers-detail-page.component';
import { GeospatialModule } from '@geospatial/geospatial.module';
import { ThemeModule } from '@theme/theme.module';
import { LayersPagesRoutingModule } from './layers-pages-routing.module';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';


@NgModule({
  declarations: [LayersPageComponent, LayersDetailPageComponent],
  imports: [
    CommonModule,
    LayersPagesRoutingModule,
    ThemeModule,
    GeospatialModule
  ], providers: [PermissionsGuard]
})
export class LayersPagesModule { }
