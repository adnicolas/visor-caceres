import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareModule } from '@cotvisor-admin/modules/share/share.module';
import { UserMapsDetailComponent } from './user-maps-detail.component';
import { UserMapsFavouritesListComponent } from './user-maps-favourites-list.component';
import { UserMapsListComponent } from './user-maps-list.component';
import { UserMapsSharedListComponent } from './user-maps-shared-list.component';
import { ThemeModule } from '@theme/theme.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisorAdminInterceptor } from '@cotvisor-admin/services';
import { UserMapsLoaderListComponent } from './user-maps-loader-list.component';

@NgModule({
  declarations: [
    UserMapsListComponent,
    UserMapsDetailComponent,
    UserMapsSharedListComponent,
    UserMapsFavouritesListComponent,
    UserMapsLoaderListComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    ShareModule
  ],
  exports: [
    UserMapsListComponent,
    UserMapsDetailComponent,
    UserMapsSharedListComponent,
    UserMapsFavouritesListComponent,
    UserMapsLoaderListComponent
  ], providers: [{ provide: HTTP_INTERCEPTORS, useClass: VisorAdminInterceptor, multi: true }]
})
export class UserMapsModule { }
