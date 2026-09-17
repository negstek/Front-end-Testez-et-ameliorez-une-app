import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { StudentMockService } from '../../core/service/student-mock.service';
import { StudentResponse } from '../../core/models/StudentResponse';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: StudentMockService;

  const students: StudentResponse[] = [
    { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' },
    { id: 2, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com', birthDate: '1912-06-23' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: StudentService, useValue: new StudentMockService() }
      ]
    }).compileComponents();

    studentService = TestBed.inject(StudentService) as unknown as StudentMockService;
  });

  it('displays the students returned by the backend', () => {
    jest.spyOn(studentService, 'getAll').mockReturnValue(of(students));
    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.students).toEqual(students);
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  it('flags a load error when the backend request fails', () => {
    jest.spyOn(studentService, 'getAll').mockReturnValue(throwError(() => new Error('boom')));
    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadError).toBe(true);
  });

  // deleteStudent() guards on window.confirm() before calling the backend
  it('does nothing when deletion is not confirmed', () => {
    jest.spyOn(studentService, 'getAll').mockReturnValue(of(students));
    const deleteSpy = jest.spyOn(studentService, 'delete');
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.deleteStudent(students[0]);

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('deletes the student and reloads the list once confirmed', () => {
    jest.spyOn(studentService, 'getAll').mockReturnValue(of(students));
    const deleteSpy = jest.spyOn(studentService, 'delete').mockReturnValue(of(undefined));
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.deleteStudent(students[0]);

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});
