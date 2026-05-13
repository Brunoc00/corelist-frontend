import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ItemService} from '../../core/services/item.service';
import {ListaService} from '../../core/services/lista.service';
import {ProdutoService} from '../../core/services/produto.service';
import {Item} from '../../shared/models/item';
import {Lista} from '../../shared/models/lista';
import {Produto} from '../../shared/models/produto';

@Component({
  selector: 'app-itens',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatSelectModule, MatCheckboxModule
  ],
  templateUrl: './itens.component.html',
  styleUrl: './itens.component.scss'
})
export class ItensComponent implements OnInit {
  itens: Item[] = [];
  listas: Lista[] = [];
  produtos: Produto[] = [];
  colunas = ['produto', 'lista', 'quantidade', 'subtotal', 'comprado', 'status', 'acoes'];
  mostrarForm = false;
  editando = false;

  form: Item = {quantidade: 0, comprado: false, subtotal: 0, lista: 0, produto: 0, is_active: true};

  constructor(
    private itemService: ItemService,
    private listaService: ListaService,
    private produtoService: ProdutoService
  ) {
  }

  ngOnInit() {
    this.carregar();
    this.listaService.listar().subscribe(res => this.listas = res);
    this.produtoService.listar().subscribe(res => this.produtos = res);
  }

  carregar() {
    this.itemService.listar().subscribe(res => this.itens = res);
  }

  abrirForm() {
    this.form = {quantidade: 0, comprado: false, subtotal: 0, lista: 0, produto: 0, is_active: true};
    this.editando = false;
    this.mostrarForm = true;
  }

  editar(item: Item) {
    this.form = {...item};
    this.editando = true;
    this.mostrarForm = true;
  }

  salvar() {
    if (this.editando && this.form.id) {
      this.itemService.editar(this.form.id, this.form as Item).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    } else {
      this.itemService.criar(this.form as Item).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    }
  }

  deletar(id: number) {
    if (confirm('Deseja deletar este item?')) {
      this.itemService.deletar(id).subscribe(() => this.carregar());
    }
  }

  cancelar() {
    this.mostrarForm = false;
  }

  getNomeProduto(id: number): string {
    return this.produtos.find(p => p.id === id)?.nome ?? '-';
  }

  getNomeLista(id: number): string {
    return this.listas.find(l => l.id === id)?.nome ?? '-';
  }
}
