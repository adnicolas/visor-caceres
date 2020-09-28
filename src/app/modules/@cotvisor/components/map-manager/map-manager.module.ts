import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MapManagerComponent } from './map-manager.component';
import { MapManagerToolsComponent } from './map-manager-tools.component';
import { MapManagerUserMapInfoComponent } from './map-manager-user-map-info.component';
import { LayersFoldersTreeComponent } from './layers-folders/layers-folders-tree.component';
import { LayersFoldersTreeNodeComponent } from './layers-folders/layers-folders-tree-node.component';
// import { MapManagerDocsComponent } from './map-manager-docs/map-manager-docs.component';
import { DirectivesModule } from '@cotvisor/directives/directives.module';
import { SharedModule } from 'primeng/primeng';
import { ThemeModule } from '@theme/theme.module';
import { MapEditInfoComponent } from './map-edit-info/map-edit-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LayersFoldersTreeService } from './layers-folders/layers-folders-tree.service';
import { TocModule } from '@cotvisor/components/toc/toc-module';
import { MapManagerDocsComponent } from './map-manager-docs/map-manager-docs.component';

@NgModule({
  declarations: [
    MapManagerComponent,
    MapManagerToolsComponent,
    MapManagerUserMapInfoComponent,
    LayersFoldersTreeComponent,
    LayersFoldersTreeNodeComponent,
    MapEditInfoComponent,
    MapManagerDocsComponent
  ],

  imports: [
    CommonModule,
    DirectivesModule,
    SharedModule,
    ThemeModule,
    ReactiveFormsModule,
    TocModule
  ],
  entryComponents: [
    MapManagerComponent,
    MapEditInfoComponent
  ],
  exports: [
    MapManagerComponent,
  ],
  providers: [
    LayersFoldersTreeService
  ],
})
export class MapManagerModule { }
