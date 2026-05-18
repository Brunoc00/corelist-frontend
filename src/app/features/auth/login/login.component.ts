import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  entrar() {
    this.errorMsg = '';
    this.loading = true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.access);

        localStorage.setItem('user', JSON.stringify(res.user));

        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;

        if (err?.error?.non_field_errors) {
          this.errorMsg = err.error.non_field_errors[0];
        } else {
          this.errorMsg = 'Erro ao fazer login';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
