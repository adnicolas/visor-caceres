import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsPagesRoutingModule } from './maps-pages-routing.module';
import { MapsPageComponent } from './maps-page/maps-page.component';
import { MapsDetailPageComponent } from './maps-detail-page/maps-detail-page.component';
import { ThemeModule } from '@theme/theme.module';
import { GeospatialModule } from '@geospatial/geospatial.module';

@NgModule({
  declarations: [MapsPageComponent, MapsDetailPageComponent],
  imports: [
    CommonModule,
    ThemeModule,
    GeospatialModule,
    MapsPagesRoutingModule
  ]
})
export class MapsPagesModule { }
