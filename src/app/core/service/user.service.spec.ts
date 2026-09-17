import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register() should send the registration payload to POST /api/register', () => {
    const registerData = { firstName: 'Ada', lastName: 'Lovelace', login: 'ada', password: 'secret' };

    service.register(registerData).subscribe();

    const req = httpTestingController.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush({});
  });

  it('login() should extract the token from the backend response', () => {
    const loginData = { login: 'jdoe', password: 'secret' };
    let result: string | undefined;

    service.login(loginData).subscribe((token) => (result = token));

    const req = httpTestingController.expectOne('/api/login');
    req.flush({ token: 'abc' });

    expect(result).toBe('abc');
  });

  it('should store the JWT returned by the backend after login', () => {
    const loginData = { login: 'jdoe', password: 'secret' };
    // payload is { "sub": "jdoe" }, matching the backend which puts the username in the JWT subject claim
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZG9lIn0.signature';

    service.login(loginData).subscribe();

    const req = httpTestingController.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token });

    expect(localStorage.getItem('jwt')).toBe(token);
  });

  it('should expose the username decoded from the JWT subject claim after login', () => {
    const loginData = { login: 'jdoe', password: 'secret' };
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZG9lIn0.signature';

    // flush() runs the login pipeline (and its tap side effect) synchronously,
    // so the BehaviorSubject already holds the final value by the time we subscribe
    service.login(loginData).subscribe();
    httpTestingController.expectOne('/api/login').flush({ token });

    let username: string | null = null;
    service.username$.subscribe((value) => (username = value));
    expect(username).toBe('jdoe');
  });

  it('isLoggedIn() should reflect whether a JWT is stored', () => {
    expect(service.isLoggedIn()).toBe(false);

    localStorage.setItem('jwt', 'abc');

    expect(service.isLoggedIn()).toBe(true);
  });

  it('logout() should clear the JWT and emit a null username', () => {
    localStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZG9lIn0.signature');
    let username: string | null | undefined;
    service.username$.subscribe((value) => (username = value));

    service.logout();

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(username).toBeNull();
  });
});

// UserService seeds its username$ BehaviorSubject from localStorage as soon as it is
// constructed, so the malformed token must already be stored *before* TestBed.inject()
// creates the service — hence the separate describe block with its own setup per test.
describe('UserService with a malformed stored JWT', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('exposes a null username instead of throwing', () => {
    localStorage.setItem('jwt', 'not-a-valid-jwt');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    const service = TestBed.inject(UserService);

    let username: string | null | undefined;
    service.username$.subscribe((value) => (username = value));
    expect(username).toBeNull();
  });

  // Covers the `payload?.sub ?? null` branch: a syntactically valid JWT (decodeJwt succeeds)
  // whose payload simply has no "sub" claim, as opposed to the malformed-token case above
  // which exercises the try/catch branch instead.
  it('exposes a null username when the JWT payload has no sub claim', () => {
    localStorage.setItem('jwt', `header.${btoa('{}')}.sig`);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    const service = TestBed.inject(UserService);

    let username: string | null | undefined;
    service.username$.subscribe((value) => (username = value));
    expect(username).toBeNull();
  });
});
