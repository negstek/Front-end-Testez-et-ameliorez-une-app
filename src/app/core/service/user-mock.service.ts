import {Register} from '../models/Register';
import {Login} from '../models/Login';
import {Observable, of} from 'rxjs';


export class UserMockService {

  register(user: Register): Observable<Object> {
    return of();
  }

  login(credentials: Login): Observable<string> {
    return of('mock-jwt-token');
  }
}
