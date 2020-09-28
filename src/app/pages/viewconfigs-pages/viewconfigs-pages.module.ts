import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewConfigsPagesRoutingModule } from './viewconfigs-pages-routing.module';
import { ViewConfigsPageComponent } from './viewconfigs-page/viewconfigs-page.component';
import { ViewConfigsDetailPageComponent } from './viewconfigs-detail-page/viewconfigs-detail-page.component';
import { ThemeModule } from '@theme/theme.module';
import { GeospatialModule } from '@geospatial/geospatial.module';
import { PermissionsGuard } from '@cotvisor-admin/permissions-guard';

@NgModule({
  declarations: [ViewConfigsPageComponent, ViewConfigsDetailPageComponent],
  imports: [CommonModule, ThemeModule, GeospatialModule, ViewConfigsPagesRoutingModule],
  providers: [PermissionsGuard]
})
export class ViewConfigsPagesModule { }
