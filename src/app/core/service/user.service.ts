import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { decodeJwt } from '../utils/jwt.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  login(credentials: Login): Observable<string> {
    // the backend now returns JSON: { token: "..." }
    return this.httpClient.post<LoginResponse>('/api/login', credentials).pipe(
      // extract the token from the response to keep an Observable<string> interface for callers
      map((response: LoginResponse) => response.token),
      // tap: side effect only, does not alter the value passed downstream
      tap((token: string) => {
        if (token) {
          console.log('token payload', decodeJwt(token));
          // persist the token for future authenticated requests / page reloads
          localStorage.setItem('jwt', token);
        }
      })
    );
  }
}
