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
import { Categoria } from '../../shared/models/categoria';

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

  // Variável adicionada para controlar o ícone no HTML e resolver o erro NG9
  isFullScreen = false;

  private todasCategorias: Categoria[] = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const valor = context.parsed.y ?? 0;
            return ` Gasto: R$ ${valor.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#666', font: { weight: 'bold' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: (value) => `R$ ${Number(value).toFixed(0)}`
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

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
    this.produtoService.listar().subscribe(res => this.totalProdutos = res.length);
    this.listaService.listar().subscribe(res => this.totalListas = res.length);

    this.categoriaService.listar().subscribe(res => {
      this.totalCategorias = res.length;
      this.todasCategorias = res;

      this.itemService.listar().subscribe((itens: Item[]) => {
        this.totalItens = itens.length;
        this.valorTotalGasto = itens.reduce((total, item) => total + (Number(item.subtotal) || 0), 0);
        this.processarGrafico(itens);
      });
    });
  }

  private processarGrafico(itens: Item[]) {
    const dadosAgrupados: { [key: string]: number } = {};

    itens.forEach(item => {
      let nomeCat = 'Sem Categoria';

      if (item.categoria_nome) {
        nomeCat = item.categoria_nome;
      }
      else if (item.categoria && typeof item.categoria === 'object') {
        nomeCat = item.categoria.nome;
      }
      else if (item.categoria) {
        const idProcurado = Number(item.categoria);
        const catEncontrada = this.todasCategorias.find(c => c.id === idProcurado);
        if (catEncontrada) {
          nomeCat = catEncontrada.nome;
        }
      }

      const valor = Number(item.subtotal) || 0;
      dadosAgrupados[nomeCat] = (dadosAgrupados[nomeCat] || 0) + valor;
    });

    this.barChartData = {
      labels: Object.keys(dadosAgrupados),
      datasets: [
        {
          data: Object.values(dadosAgrupados),
          label: 'Gastos por Categoria',
          backgroundColor: [
            '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A', '#26C6DA', '#78909C'
          ],
          borderRadius: 5,
          barThickness: 30
        }
      ]
    };

    setTimeout(() => this.chart?.update(), 100);
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
      }
    }
  }
}
