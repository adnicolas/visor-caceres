import { NgModule } from '@angular/core';
import { LayersListComponent } from './layers-list.component';
import { LayersDetailComponent } from './layers-detail.component';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { LayersService } from '@cotvisor-admin/services';
import { LayersFilePublisherComponent } from './layers-file-publisher/layers-file-publisher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '@cotvisor-admin/modules/share/share.module';

@NgModule({
  declarations: [
    LayersListComponent,
    LayersDetailComponent,
    LayersFilePublisherComponent
  ],
  providers: [
    LayersService
  ],
  imports: [
    CommonModule,
    ThemeModule,
    ShareModule,
    ReactiveFormsModule
  ],
  exports: [
    LayersListComponent,
    LayersDetailComponent,
    LayersFilePublisherComponent
  ],
})
export class LayersModule { }
