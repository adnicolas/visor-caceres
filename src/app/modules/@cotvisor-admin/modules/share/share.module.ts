import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ShareOptionsComponent } from './share-options.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggedUserCanDirective } from '@cotvisor-admin/modules/users/directives/user-can.directive';

@NgModule({
  declarations: [
    ShareOptionsComponent,
    LoggedUserCanDirective
  ],
  providers: [

  ],
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule
  ],
  exports: [
    ShareOptionsComponent,
    LoggedUserCanDirective
  ],
})
export class ShareModule { }
