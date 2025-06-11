import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: (requiredRole: string) => CanActivateFn = 
  (requiredRole) => () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.hasRole(requiredRole) 
      ? true 
      : router.createUrlTree(['/tabs/home']); // 👈 Route per accesso negato
  };
