import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/features/auth/models/user.model';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user?: User;

  constructor(private authServide: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authServide.user().subscribe({
      next: (res) => {
        this.user = res;
      },
    });
    // setting user on refresh by getting the value from localstorage
    this.user = this.authServide.getUser();
  }
  onLogout(): void {
    this.authServide.logout();
    this.router.navigateByUrl('/');
  }
}
