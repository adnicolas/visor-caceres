import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapGalleryComponent } from './map-gallery.component';
import { TranslateModule } from '@ngx-translate/core';

// TODO eliminar modulo y dejar como componente
@NgModule({
  declarations: [
    MapGalleryComponent
  ], exports: [MapGalleryComponent],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class MapGalleryModule { }
