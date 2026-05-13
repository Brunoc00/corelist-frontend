import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Produto} from '../../shared/models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private api = 'http://127.0.0.1:8000/api/compras/produtos/';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Produto[]>(this.api);
  }
  criar(data: Produto) {
    return this.http.post<Produto>(this.api, data);
  }
  editar(id: number, data: Produto) {
    return this.http.put<Produto>(`${this.api}${id}/`, data);
  }
  deletar(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }
}
