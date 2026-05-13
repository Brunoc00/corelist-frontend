import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../../shared/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = 'http://127.0.0.1:8000/api/compras/usuarios/';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Usuario[]>(this.api);
  }
  criar(data: Usuario) {
    return this.http.post<Usuario>(this.api, data);
  }
  editar(id: number, data: Usuario) {
    return this.http.put<Usuario>(`${this.api}${id}/`, data);
  }
  deletar(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }
}
