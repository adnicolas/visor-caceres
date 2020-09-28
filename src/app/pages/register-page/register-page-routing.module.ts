import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './register-page.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterPageComponent,
    data: {
      storeState: false,
      clearStoreState: true,
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterPageRoutingModule { }
