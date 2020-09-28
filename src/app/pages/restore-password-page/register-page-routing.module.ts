import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestorePasswordPageComponent } from './restore-password-page.component';

const routes: Routes = [
  {
    path: '',
    component: RestorePasswordPageComponent,
    data: {
      storeState: false,
      clearStoreState: true,
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestorePasswordPageRoutingModule { }
