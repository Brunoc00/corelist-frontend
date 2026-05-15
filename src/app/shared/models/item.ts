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
  categoria?: {
    nome: string;
  };
}
