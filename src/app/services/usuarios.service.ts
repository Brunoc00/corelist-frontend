import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './api';

@Injectable({ providedIn: 'root' })
export class UsuariosService {

  private api = API + 'usuarios/';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get(this.api);
  }

  criar(data: any) {
    return this.http.post(this.api, data);
  }
}
