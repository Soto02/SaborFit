import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () => import('../app/Components/main/main.page').then( m => m.MainPage)
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'perfil',
    loadComponent: () => import('../app/Components/profile/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'filter',
    loadComponent: () => import('../app/Components/filter/filter.page').then( m => m.FilterPage)
  },
  {
    path: 'recipe',
    loadComponent: () => import('../app/Components/recipe/recipe.page').then( m => m.RecipePage)
  },
  
];
