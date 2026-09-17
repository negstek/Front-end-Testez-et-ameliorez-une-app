import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../core/service/student.service';
import { StudentMockService } from '../../core/service/student-mock.service';
import { StudentResponse } from '../../core/models/StudentResponse';

// Like StudentFormComponent, this component reads the id via route.snapshot.paramMap in
// ngOnInit(), hence the fake ActivatedRoute instead of a real router.
function configureTestBed() {
  return TestBed.configureTestingModule({
    imports: [StudentDetailComponent],
    providers: [
      provideHttpClient(),
      provideRouter([]),
      { provide: StudentService, useValue: new StudentMockService() },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } }
    ]
  }).compileComponents();
}

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let studentService: StudentMockService;

  beforeEach(async () => {
    await configureTestBed();
    studentService = TestBed.inject(StudentService) as unknown as StudentMockService;
  });

  it('displays the requested student', () => {
    const student: StudentResponse = { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };
    jest.spyOn(studentService, 'getById').mockReturnValue(of(student));

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.student).toEqual(student);
  });

  it('flags the student as not found when the backend responds with an error', () => {
    jest.spyOn(studentService, 'getById').mockReturnValue(throwError(() => new Error('not found')));

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.notFound).toBe(true);
  });
});
