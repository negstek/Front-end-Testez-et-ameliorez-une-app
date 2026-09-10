import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { decodeJwt } from '../utils/jwt.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // seeded from localStorage so the logged-in state survives a page reload
  private usernameSubject = new BehaviorSubject<string | null>(this.readUsernameFromStorage());
  // exposed so components (e.g. the header) can react to login/logout without re-reading storage
  username$ = this.usernameSubject.asObservable();

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
          // persist the token for future authenticated requests / page reloads
          localStorage.setItem('jwt', token);
          this.usernameSubject.next(this.readUsernameFromStorage());
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.usernameSubject.next(null);
  }

  private readUsernameFromStorage(): string | null {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return null;
    }
    try {
      // the backend puts the username in the standard JWT "sub" (subject) claim
      const payload = decodeJwt(token) as { sub?: string };
      return payload?.sub ?? null;
    } catch {
      return null;
    }
  }
}
