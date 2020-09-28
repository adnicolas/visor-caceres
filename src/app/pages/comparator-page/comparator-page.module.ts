import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ComparatorPageRoutingModule } from './comparator-page-routing.module';
import { ComparatorPageComponent } from './comparator-page.component';
import { GeospatialModule } from '@geospatial/geospatial.module';

@NgModule({
  declarations: [ComparatorPageComponent],
  imports: [
    CommonModule,
    ThemeModule,
    GeospatialModule,
    ComparatorPageRoutingModule
  ]
})
export class ComparatorPageModule { }
