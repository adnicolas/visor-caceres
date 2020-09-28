import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPanelComponent } from './components/login-panel/login-panel.component';
import { ThemeModule } from '@theme/theme.module';
import { BaselayersPanelComponent } from './components/baselayers-panel/baselayers-panel.component';
import { CotVisorModule } from '@cotvisor/cot-visor.module';
import { MultipanelComponent } from './components/multipanel/multipanel.component';
import { EjemplosPanelComponent } from './components/ejemplos-panel/ejemplos-panel.component';
import { BaseLayersModule } from '@cotvisor/components/base-layers';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { VisorToolsModule } from '@cotvisor/components/visor-tools/visor-tools.module';
import { TocModule } from '@cotvisor/components/toc/toc-module';
import { TocPanelComponent } from './components/toc-panel/toc-panel.component';
import { LayersLoaderComponent } from './components/layers-loader/layers-loader.component';
import { DynamicDialogService } from '@theme/services/dynamic-dialog.service';
import { UserLocationsPanelComponent } from './components/user-locations-panel/user-locations-panel.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { LogosComponent } from './components/logos/logos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayersListComponent } from './components/layers-list/layers-list.component';
import { LayersModule } from '@cotvisor-admin/modules/layers/layers.module';
import { MapPanelComponent } from './components/map-panel/map-panel.component';
import { MapManagerModule } from '@cotvisor/components/map-manager/map-manager.module';
import { LayerShpPublishCardComponent } from './components/layer-shp-publish-card/layer-shp-publish-card.component';
import { UserMapsListComponent } from './components/user-maps-list/user-maps-list.component';
import { UserMapsModule } from '@cotvisor-admin/modules/user-maps/user-maps.module';
import { CatalogPanelComponent } from './components/catalog-panel/catalog-panel.component';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ScenesPaginatorComponent } from './components/scenes-panel/scenes-paginator/scenes-paginator.component';
import { AoiPanelComponent } from './components/aoi-panel/aoi-panel.component';
import { AoisListComponent } from './components/aoi-panel/aois-list/aois-list.component';
import { AoiItemComponent } from './components/aoi-panel/aoi-item/aoi-item.component';
import { AoiNewComponent } from './components/aoi-panel/aoi-new/aoi-new.component';
import { PrintPanelComponent } from './components/print-panel/print-panel.component';
import { PrintComponent } from './components/print-panel/print/print.component';
import { ComparatorComponent } from './components/comparator/comparator.component';
import { MultipanelComparatorComponent } from './components/comparator/multipanel-comparator/multipanel-comparator.component';
import { ScenesPanelComponent } from './components/scenes-panel/scenes-panel.component';
import { ScenesListComponent } from './components/scenes-panel/scenes-list/scenes-list.component';
import { SceneItemComponent } from './components/scenes-panel/scene-item/scene-item.component';
import { ScenesFilterComponent } from './components/scenes-panel/scenes-filter/scenes-filter.component';
import { ScenesService } from './components/scenes-panel/services/scenes.service';
import { ScenesFilterService } from './components/scenes-panel/services/scenes-filter.service';
import { UsersModule } from '@cotvisor-admin/modules/users/users.module';
import { LayersDetailComponent } from './components/layers-detail/layers-detail.component';
import { UserMapsDetailComponent } from './components/user-maps-detail/user-maps-detail.component';
import { UserMapsFavListComponent } from './components/user-maps-fav-list/user-maps-fav-list.component';
import { UserMapsVisorLoaderComponent } from './components/user-maps-visor-loader/user-maps-visor-loader.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersDetailComponent } from './components/users-detail/users-detail.component';
import { ViewConfigsListComponent } from './components/view-configs-list/view-configs-list.component';
import { ViewConfigsDetailComponent } from './components/view-configs-detail/view-configs-detail.component';
import { ViewConfigsModule } from '@cotvisor-admin/modules/view-configs/view-configs.module';
import { ViewConfigsVisorLoaderComponent } from './components/view-configs-visor-loader/view-configs-visor-loader.component';
import { ViewsSummaryComponent } from './components/views-summary/views-summary.component';
import { MapsSummaryComponent } from './components/maps-summary/maps-summary.component';
import { LayersSummaryComponent } from './components/layers-summary/layers-summary.component';
import { ShareModule } from '@cotvisor-admin/modules/share/share.module';
import { UsersGroupsModule } from '@cotvisor-admin/modules/users-groups/users-groups.module';
import { UsersGroupsDetailComponent } from './components/users-groups-detail/users-groups-detail.component';
import { UsersGroupsListComponent } from './components/users-groups-list/users-groups-list.component';
@NgModule({
  declarations: [
    LayersLoaderComponent,
    EjemplosPanelComponent,
    LoginPanelComponent,
    BaselayersPanelComponent,
    MultipanelComponent,
    EjemplosPanelComponent,
    ToolbarComponent,
    ScenesPanelComponent,
    ScenesListComponent,
    SceneItemComponent,
    ScenesFilterComponent,
    ScenesPaginatorComponent,
    TocPanelComponent,
    UserLocationsPanelComponent,
    AoiPanelComponent,
    AoisListComponent,
    AoiItemComponent,
    AoiNewComponent,
    SearchbarComponent,
    LogosComponent,
    PrintPanelComponent,
    PrintComponent,
    ComparatorComponent,
    MultipanelComparatorComponent,
    DashboardComponent,
    LayersListComponent,
    MapPanelComponent,
    LayerShpPublishCardComponent,
    UserMapsListComponent,
    UserMapsDetailComponent,
    UserMapsFavListComponent,
    UserMapsVisorLoaderComponent,
    CatalogPanelComponent,
    LayersDetailComponent,
    UsersListComponent,
    UsersDetailComponent,
    ViewConfigsListComponent,
    ViewConfigsDetailComponent,
    ViewConfigsVisorLoaderComponent,
    ViewsSummaryComponent,
    MapsSummaryComponent,
    LayersSummaryComponent,
    UsersGroupsDetailComponent,
    UsersGroupsListComponent
  ],
  exports: [
    EjemplosPanelComponent,
    LoginPanelComponent,
    BaselayersPanelComponent,
    MultipanelComponent,
    EjemplosPanelComponent,
    ToolbarComponent,
    ScenesPanelComponent,
    ScenesListComponent,
    SceneItemComponent,
    ScenesFilterComponent,
    TocPanelComponent,
    UserLocationsPanelComponent,
    AoiPanelComponent,
    SearchbarComponent,
    LogosComponent,
    PrintComponent,
    PrintPanelComponent,
    ComparatorComponent,
    MultipanelComparatorComponent,
    DashboardComponent,
    MapPanelComponent,
    UserMapsListComponent,
    UserMapsDetailComponent,
    UserMapsFavListComponent,
    UserMapsVisorLoaderComponent,
    CatalogPanelComponent,
    LayerShpPublishCardComponent,
    LayersDetailComponent,
    LayersListComponent,
    UsersListComponent,
    UsersDetailComponent,
    ViewConfigsListComponent,
    ViewConfigsDetailComponent,
    ViewConfigsVisorLoaderComponent,
    MapsSummaryComponent,
    ViewsSummaryComponent,
    LayersSummaryComponent,
    UsersGroupsDetailComponent,
    UsersGroupsListComponent
  ],
  providers: [
    ScenesService,
    ScenesFilterService,
    DynamicDialogService
  ],
  imports: [
    CommonModule,
    CotVisorModule,
    UsersModule,
    UsersGroupsModule,
    LayersModule,
    UserMapsModule,
    MapManagerModule,
    BaseLayersModule,
    ThemeModule,
    VisorToolsModule,
    TocModule,
    CatalogModule,
    ViewConfigsModule,
    ShareModule
  ],
  entryComponents: [
    LayersLoaderComponent,
    UserMapsVisorLoaderComponent,
    ViewConfigsVisorLoaderComponent
  ]

})
export class GeospatialModule { }
