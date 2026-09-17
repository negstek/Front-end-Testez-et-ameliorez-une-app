import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { UserService } from '../service/user.service';

describe('authGuard', () => {
  let isLoggedIn: jest.Mock;
  let navigate: jest.Mock;

  beforeEach(() => {
    isLoggedIn = jest.fn();
    navigate = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: { isLoggedIn } },
        { provide: Router, useValue: { navigate } },
      ],
    });
  });

  function runGuard() {
    // authGuard() is a functional guard: it calls inject() internally, so it must run
    // inside an Angular injection context rather than being invoked as a plain function.
    // The route/state arguments are unused by the guard, hence the empty casts.
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it('allows access when the user is logged in', () => {
    isLoggedIn.mockReturnValue(true);

    expect(runGuard()).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('redirects to /login and denies access when the user is not logged in', () => {
    isLoggedIn.mockReturnValue(false);

    expect(runGuard()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
