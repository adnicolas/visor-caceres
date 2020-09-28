import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPageComponent } from './register-page.component';
import { UsersModule } from '@cotvisor-admin/modules/users/users.module';
import { ThemeModule } from '@theme/theme.module';
import { RegisterPageRoutingModule } from './register-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UsersModule,
    ThemeModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPageComponent]
})
export class RegisterPageModule { }
