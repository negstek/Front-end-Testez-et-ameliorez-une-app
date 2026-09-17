import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { jwtInterceptor } from './jwt.interceptor';

// jwtInterceptor() only touches localStorage, so it can be called directly with a fake
// `next` — no TestBed or injection context needed.
describe('jwtInterceptor', () => {
  afterEach(() => {
    localStorage.clear();
  });

  // Stands in for the next handler in the interceptor chain: captures the request
  // forwarded by jwtInterceptor so it can be inspected by the caller.
  function callInterceptor(req: HttpRequest<unknown>): HttpRequest<unknown> {
    let forwardedRequest!: HttpRequest<unknown>;
    const next: HttpHandlerFn = (request) => {
      forwardedRequest = request;
      return of();
    };
    jwtInterceptor(req, next);
    return forwardedRequest;
  }

  it('adds an Authorization header with the stored JWT', () => {
    localStorage.setItem('jwt', 'abc');
    const forwardedRequest = callInterceptor(new HttpRequest('GET', '/api/students'));
    expect(forwardedRequest.headers.get('Authorization')).toBe('Bearer abc');
  });

  it('forwards the request unchanged when no JWT is stored', () => {
    const forwardedRequest = callInterceptor(new HttpRequest('GET', '/api/students'));
    expect(forwardedRequest.headers.has('Authorization')).toBe(false);
  });
});
