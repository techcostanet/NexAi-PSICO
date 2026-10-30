import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { TransacaoFinanceira, Agendamento } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Receipt,
  Download,
  Plus,
  TrendingUp,
  Clock,
  Calendar,
  Eye,
  EyeOff,
  MessageCircle,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import { gerarReciboPdf } from '../../services/pdfService';

type PeriodoFiltro = 'mes' | 'hoje' | 'semana' | 'proximos30' | 'ano' | 'todos';

export const FinancialDashboard: React.FC = () => {
  const { transacoes, pacientes, agendamentos, adicionarTransacao, atualizarTransacao, atualizarAgendamento } = useDatabase();
  const { showToast } = useToast();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [filterMetodo, setFilterMetodo] = useState<string>('todos');
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('mes');
  const [abaAtiva, setAbaAtiva] = useState<'transacoes' | 'agenda'>('transacoes');

  // Modo Privacidade para ocultar valores na presença de terceiros
  const [ocultarValores, setOcultarValores] = useState<boolean>(() => {
    return localStorage.getItem('nexai_financial_privacy') === 'true';
  });

  const toggleOcultarValores = () => {
    const novoValor = !ocultarValores;
    setOcultarValores(novoValor);
    localStorage.setItem('nexai_financial_privacy', novoValor ? 'true' : 'false');
    showToast(novoValor ? 'Valores ocultados' : 'Valores visíveis', '', 'info');
  };

  const formatarMoeda = (valor: number): string => {
    if (ocultarValores) return 'R$ ••••••';
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Formulário de Nova Transação com tipagem flexível
  const [novaTransacao, setNovaTransacao] = useState<{
    pacienteId: string;
    valor: number;
    metodoPagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'convenio';
    status: 'pago' | 'pendente';
    profissionalNome: string;
    profissionalRegistro: string;
    discriminacaoServico: string;
    emitirParaCpf: string;
    agendamentoId?: string;
  }>({
    pacienteId: pacientes[0]?.id || '',
    valor: 450.0,
    metodoPagamento: 'pix',
    status: 'pago',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    discriminacaoServico: 'Consulta especializada.',
    emitirParaCpf: '',
    agendamentoId: undefined,
  });

  // Filtro de Data
  const agora = useMemo(() => new Date(), []);

  const verificaDataNoPeriodo = (dataString: string, p: PeriodoFiltro): boolean => {
    if (p === 'todos') return true;
    const d = new Date(dataString);
    if (isNaN(d.getTime())) return true;

    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const fimHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59);

    if (p === 'hoje') {
      return d >= inicioHoje && d <= fimHoje;
    }

    if (p === 'semana') {
      const primeiroDiaSemana = new Date(inicioHoje);
      primeiroDiaSemana.setDate(inicioHoje.getDate() - inicioHoje.getDay());
      const ultimoDiaSemana = new Date(primeiroDiaSemana);
      ultimoDiaSemana.setDate(primeiroDiaSemana.getDate() + 7);
      return d >= primeiroDiaSemana && d <= ultimoDiaSemana;
    }

    if (p === 'mes') {
      return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    }

    if (p === 'proximos30') {
      const limiteFuturo = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);
      return d >= inicioHoje && d <= limiteFuturo;
    }

    if (p === 'ano') {
      return d.getFullYear() === agora.getFullYear();
    }

    return true;
  };

  // 1. Transações filtradas por período e método
  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter((t) => {
      const matchPeriodo = verificaDataNoPeriodo(t.dataPagamento || t.dataVencimento, periodo);
      if (!matchPeriodo) return false;
      if (filterMetodo === 'todos') return true;
      return t.metodoPagamento === filterMetodo;
    });
  }, [transacoes, periodo, filterMetodo]);

  // 2. Agendamentos futuros / pendentes ligados à agenda
  const agendamentosComPrevisao = useMemo(() => {
    return agendamentos
      .filter((a) => a.status !== 'faltou')
      .filter((a) => verificaDataNoPeriodo(a.dataHoraInicio, periodo))
      .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());
  }, [agendamentos, periodo]);

  // Métricas calculadas dinamicamente
  const totalRecebido = useMemo(() => {
    return transacoesFiltradas
      .filter((t) => t.status === 'pago')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [transacoesFiltradas]);

  const totalPendente = useMemo(() => {
    return transacoesFiltradas
      .filter((t) => t.status === 'pendente')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }, [transacoesFiltradas]);

  // Receita Futura Prevista com base na Agenda
  const receitaFuturaPrevista = useMemo(() => {
    return agendamentosComPrevisao
      .filter((a) => a.pagamentoStatus !== 'pago')
      .reduce((acc, curr) => acc + (curr.valorCobrado || 0), 0);
  }, [agendamentosComPrevisao]);

  const totalRecibos = useMemo(() => {
    return transacoesFiltradas.filter((t) => t.reciboEmitido).length;
  }, [transacoesFiltradas]);

  // Ticket Médio
  const transacoesPagasCount = transacoesFiltradas.filter((t) => t.status === 'pago').length;
  const ticketMedio = transacoesPagasCount > 0 ? totalRecebido / transacoesPagasCount : 0;

  // Handlers
  const handleEmitirRecibo = (transacao: TransacaoFinanceira) => {
    try {
      gerarReciboPdf(transacao);
      atualizarTransacao(transacao.id, { reciboEmitido: true });
      showToast('Recibo Gerado', 'PDF pronto para download.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Erro ao gerar recibo', 'Tente novamente.', 'error');
    }
  };

  const handleSalvarTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    const paciente = pacientes.find((p) => p.id === novaTransacao.pacienteId);
    if (!paciente) return;

    adicionarTransacao({
      pacienteId: paciente.id,
      pacienteNome: paciente.nomeCompleto,
      pacienteCpf: paciente.cpf,
      profissionalId: 'usr_medico_1',
      profissionalNome: novaTransacao.profissionalNome,
      profissionalRegistro: novaTransacao.profissionalRegistro,
      valor: Number(novaTransacao.valor),
      tipo: 'receita',
      categoria: 'consulta_particular',
      metodoPagamento: novaTransacao.metodoPagamento,
      status: novaTransacao.status,
      dataVencimento: new Date().toISOString().split('T')[0],
      dataPagamento: novaTransacao.status === 'pago' ? new Date().toISOString() : undefined,
      reciboEmitido: false,
      emitirParaCpf: novaTransacao.emitirParaCpf || paciente.cpf,
      discriminacaoServico: novaTransacao.discriminacaoServico,
      agendamentoId: novaTransacao.agendamentoId,
    });

    if (novaTransacao.agendamentoId && novaTransacao.status === 'pago') {
      atualizarAgendamento(novaTransacao.agendamentoId, { pagamentoStatus: 'pago' });
    }

    setIsNewModalOpen(false);
    showToast('Lançamento Registrado', 'Transação salva com sucesso.', 'success');
  };

  const handleRegistrarPagamentoDeAgendamento = (agend: Agendamento) => {
    setNovaTransacao({
      pacienteId: agend.pacienteId,
      valor: agend.valorCobrado || 300,
      metodoPagamento: agend.pagamentoStatus === 'convenio' ? 'convenio' : 'pix',
      status: 'pago',
      profissionalNome: agend.profissionalNome,
      profissionalRegistro: 'CRM/SP 142.890',
      discriminacaoServico: `Consulta com ${agend.profissionalNome}.`,
      emitirParaCpf: '',
      agendamentoId: agend.id,
    });
    setIsNewModalOpen(true);
  };

  const handleCobrarWhatsApp = (trans: TransacaoFinanceira) => {
    const paciente = pacientes.find((p) => p.id === trans.pacienteId);
    const telefone = paciente?.telefone.replace(/\D/g, '') || '';
    const valorTexto = trans.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const primeiroNome = trans.pacienteNome.split(' ')[0];

    const texto = encodeURIComponent(
      `Olá, ${primeiroNome}! Tudo bem?\n\n` +
      `Passando para lembrar sobre a sua consulta. O valor pendente é de R$ ${valorTexto}.\n\n` +
      `Você pode realizar o pagamento via Pix utilizando a chave do consultório. Caso já tenha realizado, por favor desconsidere esta mensagem. Muito obrigado!`
    );

    window.open(`https://api.whatsapp.com/send?phone=${telefone}&text=${texto}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Topo Financeiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Gestão Financeira
            </h2>
            <Badge variant="success">DMED</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de pagamentos, previsão de receita da agenda e recibos médicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botão de Modo Privacidade (Ocultar Valores) */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={ocultarValores ? <Eye className="w-4 h-4 text-brand-600" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
            onClick={toggleOcultarValores}
            className="text-xs border-slate-200 dark:border-slate-700"
            title="Ocultar valores monetários da tela"
          >
            <span>{ocultarValores ? 'Exibir Valores' : 'Ocultar Valores'}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setNovaTransacao((prev) => ({ ...prev, agendamentoId: undefined }));
              setIsNewModalOpen(true);
            }}
          >
            Novo Lançamento
          </Button>
        </div>
      </div>

      {/* Filtro de Períodos Dinâmico */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold px-2">
          <CalendarDays className="w-4 h-4 text-brand-600" />
          <span>Período:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setPeriodo('hoje')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              periodo === 'hoje'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setPeriodo('semana')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              periodo === 'semana'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriodo('mes')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              periodo === 'mes'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setPeriodo('proximos30')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              periodo === 'proximos30'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Próximos 30 dias
          </button>
          <button
            onClick={() => setPeriodo('ano')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              periodo === 'ano'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Este Ano
          </button>
          <button
            onClick={() => setPeriodo('todos')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              periodo === 'todos'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* Cards de Métricas com Previsão Futura da Agenda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Recebido */}
        <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-200 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Recebido
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {formatarMoeda(totalRecebido)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {transacoesPagasCount} consulta(s) quitadas
          </p>
        </Card>

        {/* Valores Pendentes */}
        <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Pendente
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {formatarMoeda(totalPendente)}
            </span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Aguardando quitação
          </p>
        </Card>

        {/* Previsão Futura da Agenda */}
        <Card className="p-5 bg-gradient-to-br from-indigo-500/10 to-brand-500/5 border-indigo-200 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
              Previsão Futura
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {formatarMoeda(receitaFuturaPrevista)}
            </span>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">
            {agendamentosComPrevisao.length} consulta(s) na agenda
          </p>
        </Card>

        {/* Recibos Emitidos */}
        <Card className="p-5 bg-gradient-to-br from-teal-500/10 to-brand-500/5 border-teal-200 dark:border-teal-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-800 dark:text-brand-300">
              Recibos Emitidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {totalRecibos} Documentos
            </span>
          </div>
          <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-1">
            {ticketMedio > 0 ? `Ticket médio: ${formatarMoeda(ticketMedio)}` : 'Pronto para DMED'}
          </p>
        </Card>

      </div>

      {/* Alternância de Abas: Lançamentos vs Previsão da Agenda */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setAbaAtiva('transacoes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            abaAtiva === 'transacoes'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Lançamentos ({transacoesFiltradas.length})</span>
        </button>

        <button
          onClick={() => setAbaAtiva('agenda')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            abaAtiva === 'agenda'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Previsão da Agenda ({agendamentosComPrevisao.length})</span>
        </button>
      </div>

      {/* Aba 1: Histórico de Lançamentos */}
      {abaAtiva === 'transacoes' && (
        <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Histórico de Lançamentos
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Filtrar Método:</span>
              <select
                value={filterMetodo}
                onChange={(e) => setFilterMetodo(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                <option value="todos">Todos</option>
                <option value="pix">Pix</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="convenio">Convênio</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Profissional</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transacoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Nenhum lançamento financeiro neste período.
                    </td>
                  </tr>
                ) : (
                  transacoesFiltradas.map((trans) => (
                    <tr key={trans.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                        {new Date(trans.dataPagamento || trans.dataVencimento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {trans.pacienteNome}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {trans.profissionalNome}
                      </td>
                      <td className="px-4 py-3">
                        <span className="uppercase font-semibold text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {trans.metodoPagamento}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono text-slate-900 dark:text-white">
                        {formatarMoeda(trans.valor)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={trans.status === 'pago' ? 'success' : 'warning'}>
                          {trans.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {trans.status === 'pendente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
                              onClick={() => handleCobrarWhatsApp(trans)}
                              className="text-xs text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              title="Enviar cobrança gentil no WhatsApp"
                            >
                              <span>Cobrar</span>
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Download className="w-3.5 h-3.5" />}
                            onClick={() => handleEmitirRecibo(trans)}
                            className="text-xs"
                          >
                            <span>Recibo</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Aba 2: Previsão da Agenda (Ligação Direta Agenda -> Financeiro) */}
      {abaAtiva === 'agenda' && (
        <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Consultas Agendadas e Receita Prevista
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Valores calculados diretamente a partir dos agendamentos do consultório.
              </p>
            </div>

            <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900">
              Total Previsto: {formatarMoeda(receitaFuturaPrevista)}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Horário</th>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Valor Previsto</th>
                  <th className="px-4 py-3">Status Agenda</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agendamentosComPrevisao.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Nenhuma consulta agendada para este período.
                    </td>
                  </tr>
                ) : (
                  agendamentosComPrevisao.map((agend) => (
                    <tr key={agend.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                        {new Date(agend.dataHoraInicio).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(agend.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {agend.pacienteNome}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-slate-600 dark:text-slate-300">
                          {agend.tipoConsulta}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono text-slate-900 dark:text-white">
                        {formatarMoeda(agend.valorCobrado || 0)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="brand" size="sm">
                          {agend.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={agend.pagamentoStatus === 'pago' ? 'success' : 'warning'} size="sm">
                          {agend.pagamentoStatus === 'pago' ? 'Pago' : agend.pagamentoStatus === 'convenio' ? 'Convênio' : 'Pendente'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {agend.pagamentoStatus !== 'pago' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => handleRegistrarPagamentoDeAgendamento(agend)}
                            className="text-xs"
                          >
                            <span>Dar Baixa</span>
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Quitado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal Novo Lançamento Financeiro */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrar Lançamento Financeiro"
      >
        <form onSubmit={handleSalvarTransacao} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Paciente *
            </label>
            <select
              value={novaTransacao.pacienteId}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, pacienteId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomeCompleto} ({p.cpf})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={novaTransacao.valor}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Método de Pagamento
              </label>
              <select
                value={novaTransacao.metodoPagamento}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, metodoPagamento: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="pix">Pix</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="convenio">Convênio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={novaTransacao.status}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Emitir Recibo para CPF
              </label>
              <input
                type="text"
                placeholder="Mesmo CPF do paciente"
                value={novaTransacao.emitirParaCpf}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, emitirParaCpf: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Discriminação do Serviço
            </label>
            <textarea
              rows={2}
              value={novaTransacao.discriminacaoServico}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, discriminacaoServico: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Salvar Lançamento
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
