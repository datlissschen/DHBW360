import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login Success:', response);
          // Store token
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login Error:', err);
          this.errorMessage = 'Passwort oder Benutzername falsch';
          this.isLoading = false;
        }
      });
    }
  }
}
