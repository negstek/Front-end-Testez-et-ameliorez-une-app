import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserMockService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: UserService, useValue: new UserMockService() },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Reused as the base double for every test; individual tests override login()
    // with jest.spyOn(...).mockReturnValue(...) to simulate success/error responses.
    userService = TestBed.inject(UserService) as unknown as UserMockService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks the form valid once login and password are filled', () => {
    component.loginForm.setValue({ login: 'jdoe', password: 'secret' });

    expect(component.loginForm.valid).toBe(true);
  });

  it('marks the form invalid when a field is missing', () => {
    component.loginForm.setValue({ login: 'jdoe', password: '' });

    expect(component.loginForm.valid).toBe(false);
  });

  it('exposes the form controls via the form getter', () => {
    expect(component.form).toBe(component.loginForm.controls);
  });

  it('does not call the login service and flags the form as submitted when it is invalid', () => {
    const loginSpy = jest.spyOn(userService, 'login');

    component.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('flags invalid credentials on a 401 response', () => {
    jest.spyOn(userService, 'login').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    component.loginForm.setValue({ login: 'jdoe', password: 'wrong' });

    component.onSubmit();

    expect(component.invalidCredentials).toBe(true);
    expect(component.serverUnreachable).toBe(false);
  });

  // Any status other than 401 (network failure, 5xx from the dev proxy) is treated
  // as the backend being unreachable rather than a credentials problem
  it('flags an unreachable server on a non-401 error response', () => {
    jest.spyOn(userService, 'login').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.loginForm.setValue({ login: 'jdoe', password: 'secret' });

    component.onSubmit();

    expect(component.serverUnreachable).toBe(true);
    expect(component.invalidCredentials).toBe(false);
  });

  it('navigates to / on a successful login', () => {
    jest.spyOn(userService, 'login').mockReturnValue(of('mock-jwt-token'));
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.loginForm.setValue({ login: 'jdoe', password: 'secret' });

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
