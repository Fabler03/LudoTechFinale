import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'upload-game',
        loadComponent: () => import('./upload-game/upload-game.page').then(m => m.UploadGamePage)
      },
      {
        path: 'user',
        loadComponent: () => import('./user/user.page').then(m => m.UserPage)
      },
      {
        path: 'game/:id',
        loadComponent: () => import('./game/game.page').then(m => m.GamePage)
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.page').then(m => m.AboutPage)
      },
      {
        path: 'game',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
