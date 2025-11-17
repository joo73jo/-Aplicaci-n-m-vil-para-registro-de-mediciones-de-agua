import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home-medidor',
    loadComponent: () => import('./medidor/home-medidor/home-medidor.page').then(m => m.HomeMedidorPage)
  },
  {
    path: 'nueva-lectura',
    loadComponent: () => import('./medidor/nueva-lectura/nueva-lectura.page').then(m => m.NuevaLecturaPage)
  },
  {
    path: 'home-admin',
    loadComponent: () => import('./admin/home-admin/home-admin.page').then(m => m.HomeAdminPage)
  },
  {
    path: 'detalle-lectura/:id',
    loadComponent: () => import('./lecturas/detalle-lectura/detalle-lectura.page').then(m => m.DetalleLecturaPage)
  }
];
