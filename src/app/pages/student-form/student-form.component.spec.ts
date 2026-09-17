import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../core/service/student.service';
import { StudentMockService } from '../../core/service/student-mock.service';

// StudentFormComponent reads its route id via `route.snapshot.paramMap` in ngOnInit(),
// so a fake ActivatedRoute is provided instead of a real router: idParam=null simulates
// creation, a value simulates edition (see the two describe blocks below).
function configureTestBed(idParam: string | null) {
  return TestBed.configureTestingModule({
    imports: [StudentFormComponent],
    providers: [
      provideHttpClient(),
      provideRouter([]),
      { provide: StudentService, useValue: new StudentMockService() },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap(idParam ? { id: idParam } : {}) } }
      }
    ]
  }).compileComponents();
}

describe('StudentFormComponent (create mode)', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: StudentMockService;

  beforeEach(async () => {
    await configureTestBed(null);
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    studentService = TestBed.inject(StudentService) as unknown as StudentMockService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is not in edit mode when no id route param is present', () => {
    expect(component.isEditMode).toBe(false);
  });

  it('exposes the form controls via the form getter', () => {
    expect(component.form).toBe(component.studentForm.controls);
  });

  it('does not call the student service and flags the form as submitted when it is invalid', () => {
    const createSpy = jest.spyOn(studentService, 'create');

    component.onSubmit();

    expect(createSpy).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('creates the student and navigates to /students on success', () => {
    const createSpy = jest.spyOn(studentService, 'create').mockReturnValue(of({
      id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10'
    }));
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.studentForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      birthDate: '1815-12-10'
    });

    component.onSubmit();

    expect(createSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });

  it('marks the form valid with a well-formed email', () => {
    component.studentForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      birthDate: '1815-12-10'
    });

    expect(component.studentForm.valid).toBe(true);
  });

  it('marks the form invalid with a malformed email', () => {
    component.studentForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'not-an-email',
      birthDate: '1815-12-10'
    });

    expect(component.studentForm.valid).toBe(false);
  });

  it('flags a server error when the creation request fails', () => {
    jest.spyOn(studentService, 'create').mockReturnValue(throwError(() => new Error('boom')));
    component.studentForm.setValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      birthDate: '1815-12-10'
    });

    component.onSubmit();

    expect(component.serverError).toBe(true);
  });
});

describe('StudentFormComponent (edit mode)', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: StudentMockService;

  beforeEach(async () => {
    await configureTestBed('3');
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    studentService = TestBed.inject(StudentService) as unknown as StudentMockService;
    fixture.detectChanges();
  });

  it('is in edit mode when an id route param is present', () => {
    expect(component.isEditMode).toBe(true);
    expect(component.studentId).toBe(3);
  });

  it('pre-fills the form with the fetched student', () => {
    expect(component.studentForm.value).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      birthDate: '1815-12-10'
    });
  });

  it('updates the student and navigates to /students on success', () => {
    const updateSpy = jest.spyOn(studentService, 'update').mockReturnValue(of({
      id: 3, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10'
    }));
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.onSubmit();

    expect(updateSpy).toHaveBeenCalledWith(3, {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      birthDate: '1815-12-10'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });
});
