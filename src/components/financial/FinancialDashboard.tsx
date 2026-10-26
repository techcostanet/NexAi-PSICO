import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { TransacaoFinanceira } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  DollarSign,
  Receipt,
  FileCheck,
  Download,
  CreditCard,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { gerarReciboPdf } from '../../services/pdfService';

export const FinancialDashboard: React.FC = () => {
  const { transacoes, pacientes, adicionarTransacao, atualizarTransacao } = useDatabase();
  const { showToast } = useToast();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [filterMetodo, setFilterMetodo] = useState<string>('todos');

  // Nova Transação Form
  const [novaTransacao, setNovaTransacao] = useState({
    pacienteId: pacientes[0]?.id || '',
    valor: 450.00,
    metodoPagamento: 'pix' as const,
    status: 'pago' as const,
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    discriminacaoServico: 'Consulta psiquiátrica especializada com prescrição de psicofármacos.',
    emitirParaCpf: '',
  });

  // Métricas
  const totalRecebido = transacoes
    .filter((t) => t.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalPendente = transacoes
    .filter((t) => t.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalRecibos = transacoes.filter((t) => t.reciboEmitido).length;

  const handleEmitirRecibo = (transacao: TransacaoFinanceira) => {
    try {
      gerarReciboPdf(transacao);
      atualizarTransacao(transacao.id, { reciboEmitido: true });
      showToast('Recibo Gerado com Sucesso!', 'PDF baixado pronto para envio ao paciente ou DMED.', 'success');
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
      valor: novaTransacao.valor,
      tipo: 'receita',
      categoria: 'consulta_particular',
      metodoPagamento: novaTransacao.metodoPagamento,
      status: novaTransacao.status,
      dataVencimento: new Date().toISOString().split('T')[0],
      dataPagamento: novaTransacao.status === 'pago' ? new Date().toISOString() : undefined,
      reciboEmitido: false,
      emitirParaCpf: novaTransacao.emitirParaCpf || paciente.cpf,
      discriminacaoServico: novaTransacao.discriminacaoServico,
    });

    setIsNewModalOpen(false);
    showToast('Lançamento Financeiro Criado!', '', 'success');
  };

  const transacoesFiltradas = transacoes.filter((t) => {
    if (filterMetodo === 'todos') return true;
    return t.metodoPagamento === filterMetodo;
  });

  return (
    <div className="space-y-6">
      
      {/* Topo Financeiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Gestão Financeira
            </h2>
            <Badge variant="success">Declaração DMED</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de pagamentos por consulta (Pix, Cartão, Dinheiro) e emissão de recibos médicos em PDF.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Novo Lançamento
        </Button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-200 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Total Recebido
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              R$ {totalRecebido.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Consultas pagas este mês
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Valores Pendentes
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              R$ {totalPendente.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Aguardando quitação ou repasse
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-brand-500/10 to-teal-500/5 border-brand-200 dark:border-brand-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-800 dark:text-brand-300">
              Recibos Médicos Emitidos
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
            Emitidos com Registro Profissional
          </p>
        </Card>
      </div>

      {/* Tabela de Transações e Emissão de Recibos */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Histórico de Lançamentos
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filtrar:</span>
            <select
              value={filterMetodo}
              onChange={(e) => setFilterMetodo(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="todos">Todos os Métodos</option>
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
                <th className="px-4 py-3 text-right">Recibo Oficial (PDF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transacoesFiltradas.map((trans) => (
                <tr key={trans.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
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
                    R$ {trans.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={trans.status === 'pago' ? 'success' : 'warning'}>
                      {trans.status === 'pago' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => handleEmitirRecibo(trans)}
                      className="text-xs"
                    >
                      {trans.reciboEmitido ? 'Reemitir Recibo' : 'Gerar Recibo'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Novo Lançamento */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrar Lançamento Financeiro"
        subtitle="Entrada de consulta particular ou repasse de convênio"
      >
        <form onSubmit={handleSalvarTransacao} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paciente:
            </label>
            <select
              value={novaTransacao.pacienteId}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, pacienteId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              required
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomeCompleto} ({p.cpf})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor (R$):
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={novaTransacao.valor}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Forma de Pagamento:
              </label>
              <select
                value={novaTransacao.metodoPagamento}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, metodoPagamento: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="pix">Pix</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="transferencia">Transferência Bancária</option>
                <option value="convenio">Convênio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discriminação do Serviço (Para o Recibo):
            </label>
            <input
              type="text"
              value={novaTransacao.discriminacaoServico}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, discriminacaoServico: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar Transação
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
