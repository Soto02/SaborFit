import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authenticationService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authenticationService.isLoggedInUser()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
