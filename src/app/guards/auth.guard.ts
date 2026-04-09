import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Aguardar o Firebase Auth resolver o estado (ignorar o null inicial)
  return authService.authReady$.pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      const user = authService.getCurrentUser();
      if (user) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};