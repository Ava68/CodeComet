import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cokkieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();
  // check for JWT token
  let token = cokkieService.get('Auhtorization');

  if (token && user) {
    token = token.replace('Bearer ', '');
    const decodedToken: any = jwtDecode(token);

    // check if token has expired
    const expirationDate = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();

    if (expirationDate < currentTime) {
      authService.logout();
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    } else {
      // token is still valid
      if (user.roles.includes('writer')) {
        return true;
      } else {
        alert('Unauthorizes');
        return false;
      }
    }
  } else {
    // LogOut
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
};
