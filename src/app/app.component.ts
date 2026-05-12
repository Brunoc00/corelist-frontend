import { Component, OnInit } from '@angular/core';
import { ProdutosService } from './services/produtos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  produtos: any[] = [];

  constructor(private service: ProdutosService) {}

  ngOnInit() {
    this.service.listar().subscribe((res: any) => {
      this.produtos = res.results ?? res;
      console.log(this.produtos); // ajuda ver no console
    });
  }
}
