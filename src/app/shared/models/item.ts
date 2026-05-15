export interface Item {
  id?: number;
  nome?: string;
  quantidade: number;
  preco: number;
  subtotal: number;
  comprado: boolean;
  is_active: boolean;
  lista: number;
  produto: number;
  // Adicione estas duas linhas abaixo para suportar os nomes
  categoria_nome?: string;
  produto_nome?: string;
  categoria?: {
    nome: string;
  };
}
