import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisorAdminInterceptor } from '@cotvisor-admin/services';
import { ViewConfigsListComponent } from './view-configs-list.component';
import { ViewConfigsDetailComponent } from './view-configs-detail.component';
import { ViewConfigsLoaderListComponent } from './view-configs-loader-list.component';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgStackFormsModule } from '@ng-stack/forms'; // incluye ReactiveFormsModule

@NgModule({
  declarations: [
    ViewConfigsListComponent,
    ViewConfigsDetailComponent,
    ViewConfigsLoaderListComponent
  ],
  imports: [CommonModule, ThemeModule, ReactiveFormsModule],
  exports: [
    ViewConfigsListComponent,
    ViewConfigsDetailComponent,
    ViewConfigsLoaderListComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: VisorAdminInterceptor, multi: true }],
})
export class ViewConfigsModule { }
