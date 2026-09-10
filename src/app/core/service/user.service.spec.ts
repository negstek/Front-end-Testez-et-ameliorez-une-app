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
});
