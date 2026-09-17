import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { HomeComponent } from './home.component';
import { UserService } from '../../core/service/user.service';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let username$: BehaviorSubject<string | null>;

  beforeEach(async () => {
    username$ = new BehaviorSubject<string | null>(null);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: UserService, useValue: { username$ } }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
  });

  it('greets the connected user by name', () => {
    username$.next('jdoe');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Bienvenue, jdoe !');
  });

  it('shows a generic welcome message when logged out', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Connectez-vous');
  });
});
