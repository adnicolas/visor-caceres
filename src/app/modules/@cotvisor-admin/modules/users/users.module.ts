import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UsersDetailDashboardComponent } from './users-detail/users-detail-dashboard/users-detail-dashboard.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { UsersFilterPipe } from './users-filter.pipe';
import { UsersListComponent } from './users-list/users-list.component';
import { ThemeModule } from '@theme/theme.module';
import { UsersService } from '@cotvisor-admin/services/users.service';
import { RolesService } from '@cotvisor-admin/services/roles.service';
import { UsersLoginComponent } from './users-login/users-login.component';
import { UsersRegisterComponent } from './users-register/users-register.component';
import { UsersRestorePasswordComponent } from './users-restore-password/users-restore-password.component';
import { LoggedUserHasRoleDirective } from './directives/user-has-role.directive';
import { UserGroupsSelectorComponent } from './user-groups-selector/user-groups-selector.component';
import { UserRolesSelectorComponent } from './user-roles-selector/user-roles-selector.component';
import { MessagesComponent } from '@theme/components/messages/messages.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UsersDetailComponent,
    UsersListComponent,
    UsersFilterPipe,
    UsersDetailDashboardComponent,
    UsersLoginComponent,
    UsersRegisterComponent,
    UsersRestorePasswordComponent,
    LoggedUserHasRoleDirective,
    UserGroupsSelectorComponent,
    UserRolesSelectorComponent
  ],
  providers: [
    UsersService, RolesService
  ],
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule
  ],
  exports: [
    UsersDetailComponent,
    UsersListComponent,
    UsersDetailDashboardComponent,
    UsersLoginComponent,
    UsersRegisterComponent,
    UsersRestorePasswordComponent,
    LoggedUserHasRoleDirective
  ],
  entryComponents: [
    MessagesComponent
  ]
})
export class UsersModule { }
