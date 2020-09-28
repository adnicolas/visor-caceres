import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'visor',
    loadChildren: './pages/visor/visor.module#VisorModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login-page/login-page.module#LoginPageModule',
  },
  {
    path: 'register',
    loadChildren: './pages/register-page/register-page.module#RegisterPageModule',
  },
  {
    path: 'restore-password',
    loadChildren: './pages/restore-password-page/restore-password-page.module#RestorePasswordPageModule',
  },
  {
    path: 'comparador',
    loadChildren: './pages/comparator-page/comparator-page.module#ComparatorPageModule',
  },
  {
    path: 'dashboard',
    loadChildren: './pages/dashboard-page/dashboard-page.module#DashboardPageModule'
  },
  {
    path: 'capas',
    loadChildren: './pages/layers-pages/layers-pages.module#LayersPagesModule'
  },
  {
    path: 'mapas',
    loadChildren: './pages/maps-pages/maps-pages.module#MapsPagesModule'
  },
  {
    path: 'usuarios',
    loadChildren: './pages/users-pages/users-pages.module#UsersPagesModule'
  },
  {
    path: 'visores',
    loadChildren: './pages/viewconfigs-pages/viewconfigs-pages.module#ViewConfigsPagesModule'
  },
  {
    path: 'grupos',
    loadChildren: './pages/users-groups-pages/users-groups-pages.module#UsersGroupsPagesModule'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
