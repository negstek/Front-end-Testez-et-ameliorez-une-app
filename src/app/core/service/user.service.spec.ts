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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store the JWT returned by the backend after login', () => {
    const loginData = { login: 'jdoe', password: 'secret' };
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiamRvZSJ9.signature';

    service.login(loginData).subscribe();

    const req = httpTestingController.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token });

    expect(localStorage.getItem('jwt')).toBe(token);
  });
});
