import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Categoria} from '../../shared/models/categoria';



@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private api = 'http://127.0.0.1:8000/api/compras/categorias/';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Categoria[]>(this.api);
  }
  criar(data: Categoria) {
    return this.http.post<Categoria>(this.api, data);
  }
  editar(id: number, data: Categoria) {
    return this.http.put<Categoria>(`${this.api}${id}/`, data);
  }
  deletar(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }
}
