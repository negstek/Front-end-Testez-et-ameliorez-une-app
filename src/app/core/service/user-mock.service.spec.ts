import { UserMockService } from './user-mock.service';

// UserMockService is a test double used to stand in for UserService in component specs;
// it isn't wired into the app itself. These smoke tests exist purely so its own methods
// aren't left uncovered by the coverage report.
describe('UserMockService', () => {
  let service: UserMockService;

  beforeEach(() => {
    service = new UserMockService();
  });

  // register() must actually emit a value (not just complete): components subscribe with
  // a single next callback (e.g. `.subscribe(() => { ...; this.router.navigate(...); })`),
  // which never fires on an observable that completes without emitting anything.
  it('register() emits a value', (done) => {
    service.register({ firstName: 'Ada', lastName: 'Lovelace', login: 'ada', password: 'secret' })
      .subscribe((value) => {
        expect(value).toEqual({});
        done();
      });
  });

  it('login() returns an observable emitting a mock JWT', (done) => {
    service.login({ login: 'ada', password: 'secret' }).subscribe((token) => {
      expect(token).toBe('mock-jwt-token');
      done();
    });
  });
});
