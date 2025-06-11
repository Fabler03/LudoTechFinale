import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.fetchUserInfo().pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        authService.logout('Sessione scaduta, effettua il login', false);
        return router.parseUrl('/login');
      }
    }),
    catchError(err => {
      authService.logout('Sessione scaduta, effettua il login', false);
      return of(router.parseUrl('/login'));
    })
  );
};