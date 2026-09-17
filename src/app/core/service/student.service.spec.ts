import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { StudentService } from './student.service';
import { StudentRequest } from '../models/StudentRequest';
import { StudentResponse } from '../models/StudentResponse';

describe('StudentService', () => {
  let service: StudentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(StudentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should return the list of students', () => {
    const students: StudentResponse[] = [
      { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' },
      { id: 2, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com', birthDate: '1912-06-23' },
    ];
    let result: StudentResponse[] | undefined;

    service.getAll().subscribe((response) => (result = response));

    const req = httpTestingController.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush(students);

    expect(result).toEqual(students);
  });

  it('getById() should return the requested student', () => {
    const student: StudentResponse = { id: 5, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };
    let result: StudentResponse | undefined;

    service.getById(5).subscribe((response) => (result = response));

    const req = httpTestingController.expectOne('/api/students/5');
    expect(req.request.method).toBe('GET');
    req.flush(student);

    expect(result).toEqual(student);
  });

  it('create() should send the student payload and return the created student', () => {
    const payload: StudentRequest = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };
    const created: StudentResponse = { id: 1, ...payload };
    let result: StudentResponse | undefined;

    service.create(payload).subscribe((response) => (result = response));

    const req = httpTestingController.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);

    expect(result).toEqual(created);
  });

  it('update() should send the student payload to /api/students/:id', () => {
    const payload: StudentRequest = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };

    service.update(5, payload).subscribe();

    const req = httpTestingController.expectOne('/api/students/5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 5, ...payload });
  });

  it('delete() should target /api/students/:id', () => {
    service.delete(5).subscribe();

    const req = httpTestingController.expectOne('/api/students/5');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
