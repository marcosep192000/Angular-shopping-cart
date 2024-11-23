import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Función para validar si el token es un JWT válido
export const isValidJwt = (token: string): boolean => {
  const parts = token.split('.');
  return parts.length === 3; // Un JWT válido tiene 3 partes
};

// Guard que verifica si el usuario está autenticado
export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (!token || !isValidJwt(token)) {
    router.navigate(['/login']); // Redirige al login si el token no es válido
    return false;
  }

  return true;
};

// Interceptor para agregar el token a las solicitudes
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (!token || !isValidJwt(token)) {
    console.error('Invalid or missing JWT token');
    return next(req); // No agregar token si es inválido
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedRequest);
};
