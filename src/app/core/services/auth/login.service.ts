import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://127.0.0.1:8000/api/login/';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }) {
    return this.http.post<any>(this.api, data);
  }

  // helpers úteis
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}