import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserMockService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: UserService, useValue: new UserMockService() },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as UserMockService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marks the form valid once all four fields are filled', () => {
    component.registerForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'secret'
    });

    expect(component.registerForm.valid).toBe(true);
  });

  it('marks the form invalid when a field is missing', () => {
    component.registerForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: ''
    });

    expect(component.registerForm.valid).toBe(false);
  });

  it('exposes the form controls via the form getter', () => {
    expect(component.form).toBe(component.registerForm.controls);
  });

  it('onReset() clears the submitted flag and resets the form', () => {
    component.registerForm.setValue({ firstName: 'Ada', lastName: 'Lovelace', login: 'ada', password: 'secret' });
    component.submitted = true;

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.value).toEqual({ firstName: null, lastName: null, login: null, password: null });
  });

  it('does not call the register service and flags the form as submitted when it is invalid', () => {
    const registerSpy = jest.spyOn(userService, 'register');

    component.onSubmit();

    expect(registerSpy).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('shows a confirmation snackbar and navigates to /login on a successful registration', () => {
    jest.spyOn(userService, 'register').mockReturnValue(of({}));
    const navigateSpy = jest.spyOn(router, 'navigate');
    // MaterialModule pulls in MatSnackBarModule, which re-provides MatSnackBar at module scope
    // (see its NgModule metadata) — that shadows the providedIn: 'root' instance for anything
    // injected inside the component tree, so TestBed.inject(MatSnackBar) would return a
    // different instance than the one the component actually calls. Reading it off the
    // component's own injector via debugElement gets the right one.
    // Mocked so the test doesn't actually open a Material overlay in jsdom.
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    const snackBarSpy = jest.spyOn(snackBar, 'open').mockReturnValue({} as never);
    component.registerForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      login: 'ada',
      password: 'secret'
    });

    component.onSubmit();

    expect(snackBarSpy).toHaveBeenCalledWith('Compte créé avec succès !', 'Fermer', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
