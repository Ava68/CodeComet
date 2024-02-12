import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $user = new BehaviorSubject<User | undefined>(undefined);
  // but for auth service has to Emit some values so that NavBar can listen to those values and change its look when value is changed
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiBaseUrl}/api/auth/login`,
      {
        email: request.email,
        password: request.password,
      }
    );
  }

  /// emitting login user
  setUser(user: User): void {
    // we will use behaviour subjects next method to emit new values to any subscribers of this observable
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
  }

  // observable
  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  // used for getting the user from local storage
  getUser(): User | undefined {
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if (email && roles) {
      const user: User = {
        email: email,
        roles: roles.split(','),
      };
      return user;
    }
    return undefined;
  }
  // clearing cookie and clearing localstotage also we need to emit new user that is undefined
  logout(): void {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}
