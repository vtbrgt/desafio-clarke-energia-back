export interface Estado {
  uf: string;
  tarifaBase: number;
}

export type Solucao = "GD" | "ML";

export interface Fornecedor {
  id: number;
  nome: string;
  sigla: string;
  cor: string;
  estadoOrigem: string;
  solucoes: Solucao[];
  custo_kwh_gd: number | null;
  custo_kwh_ml: number | null;
  clientes: number;
  avaliacao: number;
  estados: string[];
  descricao: string;
}

export interface ResultadoResponse {
  uf: string;
  consumo_kwh: number;
  tarifa_base_kwh: number;
  custo_base_mensal: number;
  solucoes: SolucaoResultado[]
}

export interface FornecedorResultado {
  fornecedor: Fornecedor
  solucao: Solucao
  custo_kwh: number
  custo_mensal: number
  economia: number
  economia_percentual: number
}

export interface SolucaoResultado {
  tipo: Solucao;
  fornecedores: FornecedorResultado[]
  melhor_economia: number
}