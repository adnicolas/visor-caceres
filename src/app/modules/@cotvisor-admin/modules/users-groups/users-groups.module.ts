import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VisorAdminInterceptor } from '@cotvisor-admin/services';
import { UsersGroupsListComponent } from './users-groups-list/users-groups-list.component';
import { UsersGroupsDetailComponent } from './users-groups-detail/users-groups-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersGroupsLoaderListComponent } from './users-groups-loader-list/users-groups-loader-list.component';
// import { NgStackFormsModule } from '@ng-stack/forms'; // incluye ReactiveFormsModule

@NgModule({
  declarations: [
    UsersGroupsDetailComponent,
    UsersGroupsListComponent,
    UsersGroupsLoaderListComponent
  ],
  imports: [CommonModule, ThemeModule, ReactiveFormsModule],
  exports: [
    UsersGroupsDetailComponent,
    UsersGroupsListComponent,
    UsersGroupsLoaderListComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: VisorAdminInterceptor, multi: true }],
})
export class UsersGroupsModule { }
