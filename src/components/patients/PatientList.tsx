import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { useToast } from '../../context/ToastContext';
import { Paciente, ModoInterfaceEmocao, Responsavel } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Users,
  Search,
  Plus,
  Camera,
  Mic,
  FolderSync,
  AlertTriangle,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  AlignJustify,
  User,
  Heart,
  Edit2,
  Trash2,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

interface PatientListProps {
  onSelectPaciente: (pacienteId: string) => void;
  onOpenScannerForPaciente: (pacienteId: string) => void;
  onOpenConsultationForPaciente: (pacienteId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onSelectPaciente,
  onOpenScannerForPaciente,
  onOpenConsultationForPaciente,
}) => {
  const { pacientes, adicionarPaciente, atualizarPaciente, removerPaciente } = useDatabase();
  const { isProfissionalSaude, currentUser } = useAuth();
  const { modules } = useSaasPlan();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'digitalizados' | 'pendentes'>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'compact'>('grid');

  // Modais de CRUD
  const [isModalNovoPacienteOpen, setIsModalNovoPacienteOpen] = useState(false);
  const [pacienteEmEdicao, setPacienteEmEdicao] = useState<Paciente | null>(null);
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<Paciente | null>(null);

  // Estado do formulário de Novo Paciente
  const [novoPaciente, setNovoPaciente] = useState({
    nomeCompleto: '',
    cpf: '',
    fotoUrl: '',
    dataNascimento: '2015-05-10',
    genero: 'F' as 'M' | 'F' | 'Outro' | 'NaoInformado',
    telefone: '+55 11 9',
    email: '',
    convenioTipo: 'particular' as 'particular' | 'convenio',
    nomeConvenio: '',
    habilitarDiario: true,
    modoDiario: 'kids' as ModoInterfaceEmocao,
    responsavelNome: '',
    responsavelParentesco: 'Mãe',
    responsavelTelefone: '+55 11 9',
    responsavelCpf: '',
  });

  // Estado do formulário de Edição
  const [editForm, setEditForm] = useState({
    nomeCompleto: '',
    cpf: '',
    fotoUrl: '',
    dataNascimento: '',
    genero: 'F' as 'M' | 'F' | 'Outro' | 'NaoInformado',
    telefone: '',
    email: '',
    status: 'ativo' as 'ativo' | 'inativo',
    convenioTipo: 'particular' as 'particular' | 'convenio',
    nomeConvenio: '',
    habilitarDiario: true,
    modoDiario: 'adulto' as ModoInterfaceEmocao,
    responsavelNome: '',
    responsavelParentesco: 'Mãe',
    responsavelTelefone: '',
    responsavelCpf: '',
  });

  // Cálculo de Idade
  const calcularIdade = (dataNascimento: string): number => {
    if (!dataNascimento) return 30;
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return isNaN(idade) ? 30 : idade;
  };

  const handleFotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'novo' | 'edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande', 'Selecione uma imagem de até 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'novo') {
          setNovoPaciente((prev) => ({ ...prev, fotoUrl: reader.result as string }));
        } else {
          setEditForm((prev) => ({ ...prev, fotoUrl: reader.result as string }));
        }
        showToast('Foto carregada', 'Pré-visualização disponível.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Abrir Modal de Edição
  const handleAbrirEdicao = (paciente: Paciente) => {
    setPacienteEmEdicao(paciente);
    const respPrincipal = paciente.responsaveis?.[0];
    setEditForm({
      nomeCompleto: paciente.nomeCompleto,
      cpf: paciente.cpf,
      fotoUrl: paciente.fotoUrl || '',
      dataNascimento: paciente.dataNascimento,
      genero: paciente.genero,
      telefone: paciente.telefone,
      email: paciente.email || '',
      status: paciente.status,
      convenioTipo: paciente.dadosConvenio?.tipo || 'particular',
      nomeConvenio: paciente.dadosConvenio?.nomeConvenio || '',
      habilitarDiario: Boolean(paciente.configuracaoDiario?.habilitado),
      modoDiario: paciente.configuracaoDiario?.modoInterfaceDefault || 'adulto',
      responsavelNome: respPrincipal?.nome || paciente.contatoEmergencia?.nome || '',
      responsavelParentesco: respPrincipal?.parentesco || paciente.contatoEmergencia?.parentesco || 'Mãe',
      responsavelTelefone: respPrincipal?.telefone || paciente.contatoEmergencia?.telefone || '',
      responsavelCpf: respPrincipal?.cpf || '',
    });
  };

  // Salvar Novo Paciente
  const handleCadastrarPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPaciente.nomeCompleto || !novoPaciente.cpf) {
      showToast('Campos obrigatórios', 'Nome e CPF são necessários.', 'warning');
      return;
    }

    const idade = calcularIdade(novoPaciente.dataNascimento);
    const isMenor = idade < 18 || novoPaciente.modoDiario === 'kids' || novoPaciente.modoDiario === 'teen';

    const responsaveis: Responsavel[] = isMenor && novoPaciente.responsavelNome ? [
      {
        nome: novoPaciente.responsavelNome,
        parentesco: novoPaciente.responsavelParentesco,
        telefone: novoPaciente.responsavelTelefone || novoPaciente.telefone,
        cpf: novoPaciente.responsavelCpf || undefined,
      }
    ] : [];

    const pacienteCriado = adicionarPaciente({
      nomeCompleto: novoPaciente.nomeCompleto,
      cpf: novoPaciente.cpf,
      fotoUrl: novoPaciente.fotoUrl || undefined,
      dataNascimento: novoPaciente.dataNascimento,
      genero: novoPaciente.genero,
      telefone: novoPaciente.telefone,
      email: novoPaciente.email || undefined,
      contatoEmergencia: {
        nome: novoPaciente.responsavelNome || 'Contato de Confiança',
        parentesco: novoPaciente.responsavelParentesco || 'Responsável',
        telefone: novoPaciente.responsavelTelefone || novoPaciente.telefone,
      },
      responsaveis,
      dadosConvenio: {
        tipo: novoPaciente.convenioTipo,
        nomeConvenio: novoPaciente.nomeConvenio || undefined,
      },
      configuracaoDiario: {
        habilitado: novoPaciente.habilitarDiario,
        modoInterfaceDefault: novoPaciente.modoDiario,
        tokenAcesso: `pac-${Date.now().toString().slice(-6)}`,
        pinAcesso: '1234',
        atualizadoEm: new Date().toISOString(),
      },
      status: 'ativo',
      criadoPor: currentUser.id,
    });

    setIsModalNovoPacienteOpen(false);
    showToast('Paciente Cadastrado', 'Ficha criada com sucesso no sistema.', 'success');
    onSelectPaciente(pacienteCriado.id);
  };

  // Salvar Edição de Paciente
  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteEmEdicao) return;

    const idade = calcularIdade(editForm.dataNascimento);
    const isMenor = idade < 18 || editForm.modoDiario === 'kids' || editForm.modoDiario === 'teen';

    const responsaveis: Responsavel[] = isMenor && editForm.responsavelNome ? [
      {
        nome: editForm.responsavelNome,
        parentesco: editForm.responsavelParentesco,
        telefone: editForm.responsavelTelefone || editForm.telefone,
        cpf: editForm.responsavelCpf || undefined,
      }
    ] : [];

    atualizarPaciente(pacienteEmEdicao.id, {
      nomeCompleto: editForm.nomeCompleto,
      cpf: editForm.cpf,
      fotoUrl: editForm.fotoUrl || undefined,
      dataNascimento: editForm.dataNascimento,
      genero: editForm.genero,
      telefone: editForm.telefone,
      email: editForm.email || undefined,
      status: editForm.status,
      responsaveis,
      contatoEmergencia: {
        nome: editForm.responsavelNome || pacienteEmEdicao.contatoEmergencia?.nome || 'Contato',
        parentesco: editForm.responsavelParentesco || 'Responsável',
        telefone: editForm.responsavelTelefone || editForm.telefone,
      },
      dadosConvenio: {
        tipo: editForm.convenioTipo,
        nomeConvenio: editForm.nomeConvenio || undefined,
      },
      configuracaoDiario: {
        ...(pacienteEmEdicao.configuracaoDiario || {
          tokenAcesso: `pac-${pacienteEmEdicao.id.slice(-6)}`,
          atualizadoEm: new Date().toISOString(),
        }),
        habilitado: editForm.habilitarDiario,
        modoInterfaceDefault: editForm.modoDiario,
        atualizadoEm: new Date().toISOString(),
      },
    });

    setPacienteEmEdicao(null);
    showToast('Paciente Atualizado', 'Dados salvos com sucesso.', 'success');
  };

  // Confirmar Exclusão
  const handleConfirmarExclusao = () => {
    if (!pacienteParaExcluir) return;
    removerPaciente(pacienteParaExcluir.id);
    showToast('Paciente Removido', `O paciente ${pacienteParaExcluir.nomeCompleto} foi excluído.`, 'info');
    setPacienteParaExcluir(null);
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const matchesSearch =
      p.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm) ||
      p.telefone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (modules.scannerFichas) {
      if (filterType === 'digitalizados') return p.totalDocumentosScaneados > 0;
      if (filterType === 'pendentes') return p.totalDocumentosScaneados === 0;
    }

    return true;
  });

  const getIniciais = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho da Lista e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            Cadastro de Pacientes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total de {pacientes.length} pacientes cadastrados na clínica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor dos 3 Tipos de Visualização */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Grade</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden md:inline">Tabela</span>
            </button>

            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Visualização Compacta"
            >
              <AlignJustify className="w-4 h-4" />
              <span className="hidden md:inline">Compacto</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalNovoPacienteOpen(true)}
          >
            Novo Paciente
          </Button>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por Nome, CPF ou Telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {modules.scannerFichas && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'todos' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('digitalizados')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'digitalizados' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Com Scan Drive
            </button>
            <button
              onClick={() => setFilterType('pendentes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'pendentes' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Pendente Scan
            </button>
          </div>
        )}
      </div>

      {/* Visualização 1: MODO GRADE (CARDS) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientesFiltrados.map((paciente) => {
            const idade = calcularIdade(paciente.dataNascimento);
            const isMenor = idade < 18 || paciente.configuracaoDiario?.modoInterfaceDefault === 'kids' || paciente.configuracaoDiario?.modoInterfaceDefault === 'teen';
            const resp = paciente.responsaveis?.[0];

            return (
              <Card
                key={paciente.id}
                className="p-5 flex flex-col justify-between hover:border-brand-300 dark:hover:border-brand-800 transition-all hover:shadow-md group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {paciente.fotoUrl ? (
                        <img
                          src={paciente.fotoUrl}
                          alt={paciente.nomeCompleto}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold text-sm flex items-center justify-center border border-brand-200 dark:border-brand-800 shrink-0">
                          {getIniciais(paciente.nomeCompleto)}
                        </div>
                      )}
                      <div>
                        <h3
                          onClick={() => onSelectPaciente(paciente.id)}
                          className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors cursor-pointer"
                        >
                          {paciente.nomeCompleto}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {idade} anos • CPF: {paciente.cpf}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {paciente.telefone}
                        </p>
                      </div>
                    </div>
                    <Badge variant={paciente.status === 'ativo' ? 'success' : 'neutral'} size="sm">
                      {paciente.status}
                    </Badge>
                  </div>

                  {/* Informação de Responsável se Menor */}
                  {isMenor && resp && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Responsável: {resp.nome} ({resp.parentesco})</span>
                      </div>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        WhatsApp: {resp.telefone} {resp.cpf ? `• CPF: ${resp.cpf}` : ''}
                      </p>
                    </div>
                  )}

                  {/* Badge do Diário */}
                  {paciente.configuracaoDiario?.habilitado && (
                    <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-lg border border-teal-200/50 dark:border-teal-900/40">
                      <Heart className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>
                        Diário{' '}
                        {paciente.configuracaoDiario.modoInterfaceDefault === 'kids'
                          ? 'Kids'
                          : paciente.configuracaoDiario.modoInterfaceDefault === 'teen'
                          ? 'Teen'
                          : 'Adulto'}
                      </span>
                    </div>
                  )}

                  {/* Status do Scan Google Drive */}
                  {modules.scannerFichas && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FolderSync className="w-4 h-4 text-brand-600" />
                        <span className="text-slate-600 dark:text-slate-300">
                          {paciente.totalDocumentosScaneados > 0
                            ? `${paciente.totalDocumentosScaneados} Ficha(s) no Drive`
                            : 'Ficha ainda não digitalizada'}
                        </span>
                      </div>
                      {paciente.totalDocumentosScaneados > 0 ? (
                        <Badge variant="brand" size="sm">Sincronizado</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Pendente</Badge>
                      )}
                    </div>
                  )}

                  {/* Alertas Médicos */}
                  {paciente.alertasMedicos && paciente.alertasMedicos.length > 0 && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-100 dark:border-rose-900/40 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{paciente.alertasMedicos[0]}</span>
                    </div>
                  )}
                </div>

                {/* Ações da Ficha: CRUD Completo */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAbrirEdicao(paciente)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar Paciente"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setPacienteParaExcluir(paciente)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Excluir Paciente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {modules.scannerFichas && (
                      <button
                        onClick={() => onOpenScannerForPaciente(paciente.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Digitalizar Fichas"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}

                    {modules.consultaIa && isProfissionalSaude && (
                      <button
                        onClick={() => onOpenConsultationForPaciente(paciente.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Iniciar Consulta"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectPaciente(paciente.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 py-1.5 px-2.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                  >
                    <span>Prontuário</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Visualização 2: MODO TABELA */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Paciente</th>
                  <th className="py-3.5 px-4">Idade</th>
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4">Responsável</th>
                  <th className="py-3.5 px-4">Diário</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pacientesFiltrados.map((paciente) => {
                  const idade = calcularIdade(paciente.dataNascimento);
                  const resp = paciente.responsaveis?.[0];

                  return (
                    <tr
                      key={paciente.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {paciente.fotoUrl ? (
                            <img
                              src={paciente.fotoUrl}
                              alt={paciente.nomeCompleto}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {getIniciais(paciente.nomeCompleto)}
                            </div>
                          )}
                          <div>
                            <p
                              onClick={() => onSelectPaciente(paciente.id)}
                              className="font-bold text-slate-900 dark:text-white hover:text-brand-600 cursor-pointer"
                            >
                              {paciente.nomeCompleto}
                            </p>
                            <p className="text-[11px] text-slate-400">CPF: {paciente.cpf}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {idade} anos
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {paciente.telefone}
                      </td>

                      <td className="py-3 px-4">
                        {resp ? (
                          <div className="text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {resp.nome}
                            </span>
                            <span className="text-slate-400">{resp.parentesco} • {resp.telefone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Próprio Paciente</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {paciente.configuracaoDiario?.habilitado ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-900/40">
                            <Heart className="w-3 h-3 text-teal-500" />
                            {paciente.configuracaoDiario.modoInterfaceDefault === 'kids'
                              ? 'Kids'
                              : paciente.configuracaoDiario.modoInterfaceDefault === 'teen'
                              ? 'Teen'
                              : 'Adulto'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Desativado</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={paciente.status === 'ativo' ? 'success' : 'neutral'} size="sm">
                          {paciente.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleAbrirEdicao(paciente)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Editar Paciente"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPacienteParaExcluir(paciente)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Excluir Paciente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectPaciente(paciente.id)}
                            className="text-xs font-bold text-brand-600"
                          >
                            Prontuário
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Visualização 3: MODO COMPACTO */}
      {viewMode === 'compact' && (
        <div className="space-y-2">
          {pacientesFiltrados.map((paciente) => {
            const idade = calcularIdade(paciente.dataNascimento);
            const resp = paciente.responsaveis?.[0];

            return (
              <Card
                key={paciente.id}
                className="p-3.5 flex items-center justify-between hover:border-brand-300 dark:hover:border-brand-800 transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {paciente.fotoUrl ? (
                    <img
                      src={paciente.fotoUrl}
                      alt={paciente.nomeCompleto}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {getIniciais(paciente.nomeCompleto)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onSelectPaciente(paciente.id)}
                        className="text-xs font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-brand-600"
                      >
                        {paciente.nomeCompleto}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">({idade} anos)</span>
                      <Badge variant={paciente.status === 'ativo' ? 'success' : 'neutral'} size="sm">
                        {paciente.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      CPF: {paciente.cpf} • {paciente.telefone}
                      {resp ? ` • Resp: ${resp.nome} (${resp.telefone})` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleAbrirEdicao(paciente)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Editar Paciente"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPacienteParaExcluir(paciente)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Excluir Paciente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectPaciente(paciente.id)}
                    className="text-xs font-bold text-brand-600"
                  >
                    Prontuário
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL 1: NOVO PACIENTE (CREATE) */}
      <Modal
        isOpen={isModalNovoPacienteOpen}
        onClose={() => setIsModalNovoPacienteOpen(false)}
        title="Cadastrar Novo Paciente"
      >
        <form onSubmit={handleCadastrarPaciente} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Upload de Foto */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="relative">
              {novoPaciente.fotoUrl ? (
                <img
                  src={novoPaciente.fotoUrl}
                  alt="Pré-visualização"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Foto do Paciente
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Formatos JPG ou PNG de até 2MB.
              </p>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                <Camera className="w-3.5 h-3.5 text-brand-600" />
                <span>Escolher Imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFotoUpload(e, 'novo')}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={novoPaciente.nomeCompleto}
              onChange={(e) => setNovoPaciente({ ...novoPaciente, nomeCompleto: e.target.value })}
              placeholder="Ex: Mariana Albuquerque Santos"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                CPF *
              </label>
              <input
                type="text"
                required
                value={novoPaciente.cpf}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={novoPaciente.dataNascimento}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, dataNascimento: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Telefone WhatsApp *
              </label>
              <input
                type="text"
                required
                value={novoPaciente.telefone}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
                placeholder="+55 11 9..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Gênero
              </label>
              <select
                value={novoPaciente.genero}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, genero: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="Outro">Outro</option>
                <option value="NaoInformado">Não Informar</option>
              </select>
            </div>
          </div>

          {/* Configuração Integrada do Diário de Emoções */}
          <div className="p-3 bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Diário de Emoções
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={novoPaciente.habilitarDiario}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, habilitarDiario: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            {novoPaciente.habilitarDiario && (
              <div className="space-y-1.5 pt-2 border-t border-teal-200/50 dark:border-teal-900/40">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                  Perfil de Idade do Paciente
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNovoPaciente({ ...novoPaciente, modoDiario: 'kids' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      novoPaciente.modoDiario === 'kids'
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    Infantil
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoPaciente({ ...novoPaciente, modoDiario: 'teen' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      novoPaciente.modoDiario === 'teen'
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    Jovem
                  </button>
                  <button
                    type="button"
                    onClick={() => setNovoPaciente({ ...novoPaciente, modoDiario: 'adulto' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      novoPaciente.modoDiario === 'adulto'
                        ? 'bg-teal-100 dark:bg-teal-950/60 border-teal-400 text-teal-900 dark:text-teal-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    Adulto
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DADOS DOS RESPONSÁVEIS (Para Crianças e Adolescentes) */}
          {(calcularIdade(novoPaciente.dataNascimento) < 18 || novoPaciente.modoDiario === 'kids' || novoPaciente.modoDiario === 'teen') && (
            <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    Dados do Responsável Legal (Menor de 18 anos)
                  </h4>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                    Necessário para consentimento de atendimento e emissão de recibos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoPaciente.responsavelNome}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, responsavelNome: e.target.value })}
                    placeholder="Ex: Cláudia Vasconcelos"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    Parentesco *
                  </label>
                  <select
                    value={novoPaciente.responsavelParentesco}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, responsavelParentesco: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Avó">Avó</option>
                    <option value="Avô">Avô</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    Telefone WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoPaciente.responsavelTelefone}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, responsavelTelefone: e.target.value })}
                    placeholder="+55 11 9..."
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    CPF do Responsável (Recibo)
                  </label>
                  <input
                    type="text"
                    value={novoPaciente.responsavelCpf}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, responsavelCpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalNovoPacienteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Salvar Paciente
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDITAR PACIENTE (UPDATE) */}
      <Modal
        isOpen={Boolean(pacienteEmEdicao)}
        onClose={() => setPacienteEmEdicao(null)}
        title="Editar Dados do Paciente"
      >
        <form onSubmit={handleSalvarEdicao} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Upload / Troca de Foto */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="relative">
              {editForm.fotoUrl ? (
                <img
                  src={editForm.fotoUrl}
                  alt="Pré-visualização"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Foto do Paciente
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                <Camera className="w-3.5 h-3.5 text-brand-600" />
                <span>Alterar Imagem</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFotoUpload(e, 'edit')}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={editForm.nomeCompleto}
              onChange={(e) => setEditForm({ ...editForm, nomeCompleto: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                CPF *
              </label>
              <input
                type="text"
                required
                value={editForm.cpf}
                onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={editForm.dataNascimento}
                onChange={(e) => setEditForm({ ...editForm, dataNascimento: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Telefone WhatsApp *
              </label>
              <input
                type="text"
                required
                value={editForm.telefone}
                onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Gênero
              </label>
              <select
                value={editForm.genero}
                onChange={(e) => setEditForm({ ...editForm, genero: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="Outro">Outro</option>
                <option value="NaoInformado">Não Informar</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Configuração do Diário */}
          <div className="p-3 bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Diário de Emoções
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.habilitarDiario}
                  onChange={(e) => setEditForm({ ...editForm, habilitarDiario: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            {editForm.habilitarDiario && (
              <div className="space-y-1.5 pt-2 border-t border-teal-200/50 dark:border-teal-900/40">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                  Perfil de Idade do Paciente
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, modoDiario: 'kids' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      editForm.modoDiario === 'kids'
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    Infantil
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, modoDiario: 'teen' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      editForm.modoDiario === 'teen'
                        ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    Jovem
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, modoDiario: 'adulto' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      editForm.modoDiario === 'adulto'
                        ? 'bg-teal-100 dark:bg-teal-950/60 border-teal-400 text-teal-900 dark:text-teal-200 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    Adulto
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DADOS DOS RESPONSÁVEIS NO MODAL DE EDIÇÃO */}
          {(calcularIdade(editForm.dataNascimento) < 18 || editForm.modoDiario === 'kids' || editForm.modoDiario === 'teen') && (
            <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    Dados do Responsável Legal (Menor de 18 anos)
                  </h4>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                    Necessário para consentimento de atendimento e emissão de recibos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    Nome do Responsável *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.responsavelNome}
                    onChange={(e) => setEditForm({ ...editForm, responsavelNome: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    Parentesco *
                  </label>
                  <select
                    value={editForm.responsavelParentesco}
                    onChange={(e) => setEditForm({ ...editForm, responsavelParentesco: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Avó">Avó</option>
                    <option value="Avô">Avô</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    Telefone WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.responsavelTelefone}
                    onChange={(e) => setEditForm({ ...editForm, responsavelTelefone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                    CPF do Responsável (Recibo)
                  </label>
                  <input
                    type="text"
                    value={editForm.responsavelCpf}
                    onChange={(e) => setEditForm({ ...editForm, responsavelCpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPacienteEmEdicao(null)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: EXCLUSÃO DE PACIENTE (DELETE) */}
      <Modal
        isOpen={Boolean(pacienteParaExcluir)}
        onClose={() => setPacienteParaExcluir(null)}
        title="Confirmar Exclusão de Paciente"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Atenção ao excluir paciente
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                Você está prestes a remover a ficha de{' '}
                <strong className="font-bold underline">{pacienteParaExcluir?.nomeCompleto}</strong>.
                Esta ação remove o cadastro da lista principal.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPacienteParaExcluir(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmarExclusao}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Confirmar Exclusão
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
