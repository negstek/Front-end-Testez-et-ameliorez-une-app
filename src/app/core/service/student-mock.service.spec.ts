import { StudentMockService } from './student-mock.service';
import { StudentRequest } from '../models/StudentRequest';

// Same rationale as user-mock.service.spec.ts: StudentMockService is only ever used as a
// test double, so these smoke tests exist to keep it out of the coverage report's blind spots.
describe('StudentMockService', () => {
  let service: StudentMockService;
  const payload: StudentRequest = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };

  beforeEach(() => {
    service = new StudentMockService();
  });

  it('getAll() returns an empty list', (done) => {
    service.getAll().subscribe((students) => {
      expect(students).toEqual([]);
      done();
    });
  });

  it('getById() returns a mock student with the requested id', (done) => {
    service.getById(5).subscribe((student) => {
      expect(student.id).toBe(5);
      done();
    });
  });

  it('create() returns the payload with a generated id', (done) => {
    service.create(payload).subscribe((student) => {
      expect(student).toEqual({ id: 1, ...payload });
      done();
    });
  });

  it('update() returns the payload with the given id', (done) => {
    service.update(5, payload).subscribe((student) => {
      expect(student).toEqual({ id: 5, ...payload });
      done();
    });
  });

  it('delete() completes', (done) => {
    service.delete(5).subscribe({ complete: done });
  });
});
