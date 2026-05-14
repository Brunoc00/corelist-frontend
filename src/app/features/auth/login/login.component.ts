import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/login.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username = '';
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
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        // 🔐 salva o token
        this.auth.setToken(res.access);

        // (opcional) salvar usuário
        localStorage.setItem('user', JSON.stringify(res.user));

        // 🚀 redireciona
        this.router.navigate(['/dashboard']); // ajuste a rota que você tiver
      },
      error: (err) => {
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