export type MetodoPagamento = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'transferencia' | 'convenio';

export type StatusFinanceiro = 'pago' | 'pendente' | 'estornado';

export interface TransacaoFinanceira {
  id: string;
  agendamentoId?: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteCpf: string;
  profissionalId: string;
  profissionalNome: string;
  profissionalRegistro: string;
  
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: 'consulta_particular' | 'repasse_convenio' | 'pacote_sessoes' | 'outro';
  metodoPagamento: MetodoPagamento;
  status: StatusFinanceiro;
  
  dataVencimento: string;
  dataPagamento?: string;
  
  // Recibo / Declaração
  reciboEmitido: boolean;
  numeroRecibo?: string;
  emitirParaCpf: string;
  discriminacaoServico: string;
  
  criadoEm: string;
  atualizadoEm: string;
}
