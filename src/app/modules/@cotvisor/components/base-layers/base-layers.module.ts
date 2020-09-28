import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayersComponent } from './base-layers.component';
import { TranslateModule } from '@ngx-translate/core';

// TODO eliminar modulo y dejar como componente
@NgModule({
  declarations: [
    BaseLayersComponent
  ], exports: [BaseLayersComponent],
  imports: [
    CommonModule,
    TranslateModule
  ]
})
export class BaseLayersModule { }
