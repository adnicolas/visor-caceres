
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MapContainerComponent } from './map-container/map-container.component';
import { ThemeModule } from '@theme/theme.module';
import { VisorToolsModule } from './visor-tools/visor-tools.module';
import { WmsLoaderComponent } from './wms-loader/wms-loader.component';
import { WmsLayerLoaderComponent } from './wms-loader/wms-layer-loader/wms-layer-loader.component';
import { PipesModule } from '@cotvisor/pipes/pipes.modules';
import { LocalLayerLoaderComponent } from './local-layer-loader/local-layer-loader.component';
import { UserLocationsComponent } from './user-locations/user-locations.component';
import { ToponomySearchComponent } from './toponomy-search/toponomy-search.component';
import { UserLocationItemComponent } from './user-locations/user-location-item/user-location-item.component';
import { WfsLoaderComponent } from './wfs-loader/wfs-loader.component';
import { WfsLayerLoaderComponent } from './wfs-loader/wfs-layer-loader/wfs-layer-loader.component';
import { VectorLayersEditorComponent } from './vector-layers-editor/vector-layers-editor.component';
import { VectorLayersEditorSaveAsComponent } from './vector-layers-editor/vector-layers-editor-save-as.component';




@NgModule({
  declarations: [
    MapContainerComponent,
    WmsLoaderComponent,
    WmsLayerLoaderComponent,
    WfsLoaderComponent,
    WfsLayerLoaderComponent,
    LocalLayerLoaderComponent,
    UserLocationsComponent,
    UserLocationItemComponent,
    ToponomySearchComponent,
    VectorLayersEditorComponent,
    VectorLayersEditorSaveAsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ThemeModule,
    PipesModule],
  exports: [
    MapContainerComponent,
    WmsLoaderComponent,
    WfsLoaderComponent,
    LocalLayerLoaderComponent,
    VisorToolsModule,
    UserLocationsComponent,
    UserLocationItemComponent,
    ToponomySearchComponent,
    VectorLayersEditorComponent
  ],

})
export class ComponentsModule { }
