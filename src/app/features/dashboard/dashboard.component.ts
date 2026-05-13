import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../core/services/usuario.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ProdutoService } from '../../core/services/produto.service';
import { ListaService } from '../../core/services/lista.service';
import { ItemService } from '../../core/services/item.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalUsuarios = 0;
  totalCategorias = 0;
  totalProdutos = 0;
  totalListas = 0;
  totalItens = 0;

  constructor(
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService,
    private listaService: ListaService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.usuarioService.listar().subscribe(res => this.totalUsuarios = res.length);
    this.categoriaService.listar().subscribe(res => this.totalCategorias = res.length);
    this.produtoService.listar().subscribe(res => this.totalProdutos = res.length);
    this.listaService.listar().subscribe(res => this.totalListas = res.length);
    this.itemService.listar().subscribe(res => this.totalItens = res.length);
  }
}
