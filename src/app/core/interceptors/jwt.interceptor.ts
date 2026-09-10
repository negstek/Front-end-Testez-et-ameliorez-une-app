import { HttpInterceptorFn } from '@angular/common/http';

// Attaches the stored JWT to every outgoing request. Harmless on /api/login and /api/register
// (public routes, the backend ignores the header there) and required on protected routes like
// /api/students/**.
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
