import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestorePasswordPageComponent } from './restore-password-page.component';
import { RestorePasswordPageRoutingModule } from './register-page-routing.module';
import { UsersModule } from '@cotvisor-admin/modules/users/users.module';
import { ThemeModule } from '@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    RestorePasswordPageRoutingModule,
    UsersModule,
    ThemeModule,
  ],
  declarations: [RestorePasswordPageComponent]
})
export class RestorePasswordPageModule { }
