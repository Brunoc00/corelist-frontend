import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../../shared/models/usuario';
import {Lista} from '../../shared/models/lista';

@Injectable({
  providedIn: 'root'
})
export class ListaService {
  private api = 'http://127.0.0.1:8000/api/compras/listas/';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Lista[]>(this.api);
  }
  criar(data: Lista) {
    return this.http.post<Lista>(this.api, data);
  }
  editar(id: number, data: Lista) {
    return this.http.put<Lista>(`${this.api}${id}/`, data);
  }
  deletar(id: number) {
    return this.http.delete(`${this.api}${id}/`);
  }
}
