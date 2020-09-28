import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { ThemeModule } from '@theme/theme.module';
import { UsersModule } from '@cotvisor-admin/modules/users/users.module';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    ThemeModule,
    UsersModule,
    LoginPageRoutingModule
  ]
})
export class LoginPageModule { }
