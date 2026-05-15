import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ItemService } from '../../core/services/item.service';
import { ListaService } from '../../core/services/lista.service';
import { ProdutoService } from '../../core/services/produto.service';
import { Item } from '../../shared/models/item';
import { Lista } from '../../shared/models/lista';
import { Produto } from '../../shared/models/produto';

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

  form: Item = this.limparForm();

  constructor(
    private itemService: ItemService,
    private listaService: ListaService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    this.carregar();
    this.listaService.listar().subscribe(res => this.listas = res);
    this.produtoService.listar().subscribe(res => this.produtos = res);
  }

  private limparForm(): Item {
    return {
      quantidade: 1, // Começar com 1 é melhor para o cálculo
      subtotal: 0,
      comprado: false,
      is_active: true,
      lista: 0,
      produto: 0,
      preco: 0 // Se o erro 400 persistir, tente remover este campo daqui e da interface
    };
  }

  carregar() {
    this.itemService.listar().subscribe(res => this.itens = res);
  }

  abrirForm() {
    this.form = this.limparForm();
    this.editando = false;
    this.mostrarForm = true;
  }

  editar(item: Item) {
    this.form = { ...item };
    this.editando = true;
    this.mostrarForm = true;
  }

  salvar() {
    // IMPORTANTE: Criamos um objeto limpo para enviar ao Back-end
    // Removi o campo 'nome' porque geralmente ele pertence ao Produto e causa erro 400 no Item
    const payload = {
      produto: this.form.produto,
      lista: this.form.lista,
      quantidade: this.form.quantidade,
      subtotal: this.form.subtotal,
      comprado: this.form.comprado,
      is_active: this.form.is_active
    };

    if (this.editando && this.form.id) {
      this.itemService.editar(this.form.id, payload as any).subscribe({
        next: () => {
          this.carregar();
          this.mostrarForm = false;
        },
        error: (err) => console.error("Erro ao editar:", err)
      });
    } else {
      this.itemService.criar(payload as any).subscribe({
        next: () => {
          this.carregar();
          this.mostrarForm = false;
        },
        error: (err) => {
          console.error("Erro ao criar (400 Bad Request):", err.error);
          alert("Erro ao salvar! Verifique se todos os campos estão preenchidos.");
        }
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
