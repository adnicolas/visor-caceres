import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComparatorPageComponent } from './comparator-page.component';

const routes: Routes = [
  {
    path: '',
    component: ComparatorPageComponent,
    data: {
      storeState: false, // Está desactivado porque sino, no se destruyen los mapas al volver al visor, y habría que devolver al visor el mapa activo
      key: 'comparatorPage'
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparatorPageRoutingModule { }
