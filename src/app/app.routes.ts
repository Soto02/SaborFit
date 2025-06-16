import { Routes } from '@angular/router';
//import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/Pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./Pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'main',
    loadComponent: () =>
      import('../app/Pages/main/main.page').then((m) => m.MainPage),
    //canActivate: [authGuard],
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('../app/Pages/profile/perfil.page').then((m) => m.PerfilPage),
    //canActivate: [authGuard],
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('../app/Pages/recipe/recipe.page').then((m) => m.RecipePage),
    //canActivate: [authGuard],
  },
  {
    path: 'resultados',
    loadComponent: () => import('./Pages/resultados/resultados.page').then( m => m.ResultadosPage)
    //canActivate: [authGuard],
  },
  {
    path: 'newrecipe',
    loadComponent: () => import('./Pages/newrecipe/newrecipe.page').then( m => m.NewrecipePage)
    //canActivate: [authGuard],
  },
];
