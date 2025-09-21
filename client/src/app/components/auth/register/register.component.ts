import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="background-image"></div>
      <div class="auth-card">
        <div class="auth-header">
          <i class="fas fa-car"></i>
          <h1>Join AUTOGRAPHY</h1>
          <p>Create your account and start sharing your passion</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="userData.username"
              #username="ngModel"
              required
              minlength="3"
              class="form-control"
              [class.error]="username.invalid && username.touched"
              placeholder="Choose a username"
            >
            <div class="error-message" *ngIf="username.invalid && username.touched">
              <span *ngIf="username.errors?.['required']">Username is required</span>
              <span *ngIf="username.errors?.['minlength']">Username must be at least 3 characters</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userData.email"
              #email="ngModel"
              required
              email
              class="form-control"
              [class.error]="email.invalid && email.touched"
              placeholder="Enter your email"
            >
            <div class="error-message" *ngIf="email.invalid && email.touched">
              <span *ngIf="email.errors?.['required']">Email is required</span>
              <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              #password="ngModel"
              required
              minlength="6"
              class="form-control"
              [class.error]="password.invalid && password.touched"
              placeholder="Create a password"
            >
            <div class="error-message" *ngIf="password.invalid && password.touched">
              <span *ngIf="password.errors?.['required']">Password is required</span>
              <span *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              #confirmPasswordField="ngModel"
              required
              class="form-control"
              [class.error]="confirmPasswordField.invalid && confirmPasswordField.touched"
              placeholder="Confirm your password"
            >
            <div class="error-message" *ngIf="confirmPasswordField.invalid && confirmPasswordField.touched">
              <span *ngIf="confirmPasswordField.errors?.['required']">Please confirm your password</span>
            </div>
            <div class="error-message" *ngIf="userData.password && confirmPassword && userData.password !== confirmPassword">
              Passwords do not match
            </div>
          </div>
          
          <div class="alert alert-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="registerForm.invalid || isLoading || userData.password !== confirmPassword"
          >
            <i class="fas fa-spinner fa-spin" *ngIf="isLoading"></i>
            <i class="fas fa-user-plus" *ngIf="!isLoading"></i>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    
    .background-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('http://localhost:5000/uploads/1758471393909-502691935-Generated Image September 16, 2025 - 11_24PM.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.3;
      z-index: 1;
    }
    
    .auth-card {
      background: white;
      position: relative;
      z-index: 2;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .auth-header i {
      font-size: 48px;
      color: #e74c3c;
      margin-bottom: 20px;
    }
    
    .auth-header h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 10px;
    }
    
    .auth-header p {
      color: #666;
      font-size: 16px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-control {
      width: 100%;
      padding: 15px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #e74c3c;
    }
    
    .form-control.error {
      border-color: #e74c3c;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .btn-full {
      width: 100%;
      padding: 15px;
      font-size: 16px;
      margin-top: 10px;
    }
    
    .btn i {
      margin-right: 8px;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 30px;
    }
    
    .auth-footer a {
      color: #e74c3c;
      text-decoration: none;
      font-weight: 600;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  userData = {
    username: '',
    email: '',
    password: ''
  };
  
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
