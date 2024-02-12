import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: LoginRequest;
  constructor(
    private authService: AuthService,
    private cookieServie: CookieService,
    private router: Router
  ) {
    this.model = {
      email: '',
      password: '',
    };
  }

  onFormSubmit(): void {
    this.authService.login(this.model).subscribe({
      next: (res) => {
        // Set auth cookie
        this.cookieServie.set(
          'Authorization', // Corrected typo
          `Bearer ${res.token}`,
          undefined,
          '/', // Cookie path
          undefined,
          true, // Secure flag (for HTTPS)
          'Strict' // SameSite policy
        );

        // Set user
        this.authService.setUser({
          email: res.email,
          roles: res.roles,
        });

        // Redirect back to Home
        this.router.navigateByUrl('/');
      },
    });
  }
}
