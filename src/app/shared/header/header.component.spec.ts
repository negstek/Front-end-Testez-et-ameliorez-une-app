import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { HeaderComponent } from './header.component';
import { UserService } from '../../core/service/user.service';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let username$: BehaviorSubject<string | null>;
  let logout: jest.Mock;
  let router: Router;

  beforeEach(async () => {
    // A BehaviorSubject double for UserService.username$: HeaderComponent subscribes to it
    // via the async pipe, so .next() below drives the "logged in" / "logged out" branches
    // of the template without needing a real login flow.
    username$ = new BehaviorSubject<string | null>(null);
    logout = jest.fn();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { username$, logout } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    router = TestBed.inject(Router);
  });

  it('shows the connected username when logged in', () => {
    username$.next('jdoe');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('jdoe');
    expect(fixture.nativeElement.textContent).not.toContain('Se connecter');
  });

  it('shows the login link when logged out', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Se connecter');
  });

  it('logout() logs the user out and navigates to /', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.componentInstance.logout();

    expect(logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
