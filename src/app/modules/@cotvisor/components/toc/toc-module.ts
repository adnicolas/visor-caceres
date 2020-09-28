import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from '@theme/theme.module';
import { PipesModule } from '@cotvisor/pipes/pipes.modules';
import { TocLayerItemComponent } from './toc-layer-item/toc-layer-item.component';
import { TocLayerOptionsComponent } from './toc-layer-options/toc-layer-options.component';
import { TocLayersListComponent } from './toc-layers-list/toc-layers-list.component';

@NgModule({
  declarations: [
    TocLayersListComponent,
    TocLayerItemComponent,
    TocLayerOptionsComponent
  ], exports: [TocLayersListComponent, TocLayerItemComponent, TocLayerOptionsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ThemeModule,
    PipesModule
  ]
})
export class TocModule { }
