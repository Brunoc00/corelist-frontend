import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Item} from '../../shared/models/item';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private api = 'http://127.0.0.1:8000/api/compras/listas/'

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Item[]>(this.api);
  }
  criar(data: Item) {
    return this.http.post<Item>(this.api, data);
  }
  editar(id: number, data: Item) {
    return this.http.put<Item>(`${this.api}${id}/`, data);
  }
  deletar(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }
}
