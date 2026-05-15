import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { UsuarioService } from '../../core/services/usuario.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ProdutoService } from '../../core/services/produto.service';
import { ListaService } from '../../core/services/lista.service';
import { ItemService } from '../../core/services/item.service';
import { Item } from '../../shared/models/item';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  totalUsuarios = 0;
  totalCategorias = 0;
  totalProdutos = 0;
  totalListas = 0;
  totalItens = 0;
  valorTotalGasto = 0;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private produtoService: ProdutoService,
    private listaService: ListaService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  private carregarDados() {
    this.usuarioService.listar().subscribe(res => this.totalUsuarios = res.length);
    this.categoriaService.listar().subscribe(res => this.totalCategorias = res.length);
    this.produtoService.listar().subscribe(res => this.totalProdutos = res.length);
    this.listaService.listar().subscribe(res => this.totalListas = res.length);

    this.itemService.listar().subscribe((itens: Item[]) => {
      this.totalItens = itens.length;
      this.valorTotalGasto = itens.reduce((total, item) => total + (Number(item.subtotal) || 0), 0);
      this.processarGrafico(itens);
    });
  }

  private processarGrafico(itens: Item[]) {
    const dadosAgrupados: { [key: string]: number } = {};

    itens.forEach(item => {
      let nomeCat = 'Sem Categoria';

      // Lógica de busca da categoria:
      // 1. Tenta no item
      // 2. Se não achar, tenta dentro do produto vinculado
      if (item.categoria && typeof item.categoria === 'object') {
        nomeCat = item.categoria.nome;
      } else if (item.produto && (item.produto as any).categoria?.nome) {
        nomeCat = (item.produto as any).categoria.nome;
      } else if (item.categoria) {
        nomeCat = `ID: ${item.categoria}`;
      }

      const valor = Number(item.subtotal) || 0;
      dadosAgrupados[nomeCat] = (dadosAgrupados[nomeCat] || 0) + valor;
    });

    this.barChartData = {
      labels: Object.keys(dadosAgrupados),
      datasets: [
        {
          data: Object.values(dadosAgrupados),
          label: 'Gastos por Categoria (R$)',
          // Cores variadas para diferenciar as categorias visualmente
          backgroundColor: [
            '#3f51b5', '#e91e63', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#795548'
          ],
          borderColor: '#ffffff',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };

    // Força a atualização visual do gráfico
    this.chart?.update();
  }
}
