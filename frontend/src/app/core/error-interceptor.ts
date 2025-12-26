import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized or 404 Not Found (specifically for user verification or authenticated endpoints)
      // Note: We might want to be careful with 404s if other resources can be 404,
      // but for now, if the user context is invalid (e.g. /api/user returns 404), logout is appropriate.
      // Especially /api/user returning 404 means the user is gone.

      if (error.status === 401) {
        authService.logout();
      } else if (error.status === 404 && req.url.includes('/api/user')) {
         // Only force logout on 404 if it's the user endpoint itself indicating the user doesn't exist.
         // Other 404s (like missing resource) shouldn't necessarily log the user out.
         authService.logout();
      }

      return throwError(() => error);
    })
  );
};
