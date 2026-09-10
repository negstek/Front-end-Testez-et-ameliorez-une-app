import { Observable, of } from 'rxjs';
import { StudentRequest } from '../models/StudentRequest';
import { StudentResponse } from '../models/StudentResponse';

export class StudentMockService {

  getAll(): Observable<StudentResponse[]> {
    return of([]);
  }

  getById(id: number): Observable<StudentResponse> {
    return of({ id, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' });
  }

  create(student: StudentRequest): Observable<StudentResponse> {
    return of({ id: 1, ...student });
  }

  update(id: number, student: StudentRequest): Observable<StudentResponse> {
    return of({ id, ...student });
  }

  delete(id: number): Observable<void> {
    return of(undefined);
  }
}
