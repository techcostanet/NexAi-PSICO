import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { useToast } from '../../context/ToastContext';
import { Paciente, ModoInterfaceEmocao } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Users,
  Search,
  Plus,
  Phone,
  Camera,
  Mic,
  FolderSync,
  AlertTriangle,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  AlignJustify,
  User,
  X,
  Heart,
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
  const { pacientes, adicionarPaciente } = useDatabase();
  const { isProfissionalSaude, currentUser } = useAuth();
  const { modules } = useSaasPlan();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'digitalizados' | 'pendentes'>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'compact'>('grid');
  const [isModalNovoPacienteOpen, setIsModalNovoPacienteOpen] = useState(false);

  const [novoPaciente, setNovoPaciente] = useState<{
    nomeCompleto: string;
    cpf: string;
    fotoUrl: string;
    dataNascimento: string;
    genero: 'M' | 'F' | 'Outro' | 'NaoInformado';
    telefone: string;
    email: string;
    contatoEmergenciaNome: string;
    contatoEmergenciaTel: string;
    convenioTipo: 'particular' | 'convenio';
    nomeConvenio: string;
    habilitarDiario: boolean;
    modoDiario: ModoInterfaceEmocao;
  }>({
    nomeCompleto: '',
    cpf: '',
    fotoUrl: '',
    dataNascimento: '1990-01-01',
    genero: 'F',
    telefone: '+55119',
    email: '',
    contatoEmergenciaNome: '',
    contatoEmergenciaTel: '',
    convenioTipo: 'particular',
    nomeConvenio: '',
    habilitarDiario: true,
    modoDiario: 'adulto',
  });

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Imagem muito grande', 'Selecione uma imagem de até 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNovoPaciente((prev) => ({ ...prev, fotoUrl: reader.result as string }));
        showToast('Foto carregada', 'Pré-visualização disponível no formulário.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCadastrarPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPaciente.nomeCompleto || !novoPaciente.cpf) {
      showToast('Campos obrigatórios', 'Nome e CPF são necessários.', 'warning');
      return;
    }

    const pacienteCriado = adicionarPaciente({
      nomeCompleto: novoPaciente.nomeCompleto,
      cpf: novoPaciente.cpf,
      fotoUrl: novoPaciente.fotoUrl || undefined,
      dataNascimento: novoPaciente.dataNascimento,
      genero: novoPaciente.genero,
      telefone: novoPaciente.telefone,
      email: novoPaciente.email || undefined,
      contatoEmergencia: {
        nome: novoPaciente.contatoEmergenciaNome || 'Não informado',
        parentesco: 'Responsável',
        telefone: novoPaciente.contatoEmergenciaTel || novoPaciente.telefone,
      },
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
    showToast('Paciente Cadastrado', 'Ficha criada com sucesso.', 'success');
    onSelectPaciente(pacienteCriado.id);
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
          {pacientesFiltrados.map((paciente) => (
            <Card
              key={paciente.id}
              className="p-5 flex flex-col justify-between hover:border-brand-300 dark:hover:border-brand-800 transition-all hover:shadow-md group"
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
                        CPF: {paciente.cpf}
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

              {/* Ações da Ficha */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {modules.scannerFichas && (
                    <button
                      onClick={() => onOpenScannerForPaciente(paciente.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Digitalizar fichas no Drive"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}

                  {modules.consultaIa && isProfissionalSaude && (
                    <button
                      onClick={() => onOpenConsultationForPaciente(paciente.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
          ))}
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
                  <th className="py-3.5 px-4">Contato</th>
                  <th className="py-3.5 px-4">Convênio</th>
                  <th className="py-3.5 px-4">Diário</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pacientesFiltrados.map((paciente) => (
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
                      {paciente.telefone}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-700 dark:text-slate-300">
                        {paciente.dadosConvenio?.nomeConvenio || 'Particular'}
                      </span>
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
                        {modules.scannerFichas && (
                          <button
                            onClick={() => onOpenScannerForPaciente(paciente.id)}
                            className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Digitalizar"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Visualização 3: MODO COMPACTO */}
      {viewMode === 'compact' && (
        <div className="space-y-2">
          {pacientesFiltrados.map((paciente) => (
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
                    <Badge variant={paciente.status === 'ativo' ? 'success' : 'neutral'} size="sm">
                      {paciente.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    CPF: {paciente.cpf} • {paciente.telefone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {paciente.configuracaoDiario?.habilitado && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded-full border border-teal-200/50">
                    <Heart className="w-3 h-3 text-teal-500" />
                    {paciente.configuracaoDiario.modoInterfaceDefault === 'kids'
                      ? 'Kids'
                      : paciente.configuracaoDiario.modoInterfaceDefault === 'teen'
                      ? 'Teen'
                      : 'Adulto'}
                  </span>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectPaciente(paciente.id)}
                  className="text-xs"
                >
                  Prontuário
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Cadastro de Novo Paciente com Foto e Diário */}
      <Modal
        isOpen={isModalNovoPacienteOpen}
        onClose={() => setIsModalNovoPacienteOpen(false)}
        title="Cadastrar Novo Paciente"
      >
        <form onSubmit={handleCadastrarPaciente} className="space-y-4">
          
          {/* Campo de Foto do Paciente */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="relative shrink-0">
              {novoPaciente.fotoUrl ? (
                <img
                  src={novoPaciente.fotoUrl}
                  alt="Foto do Paciente"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
              )}
              {novoPaciente.fotoUrl && (
                <button
                  type="button"
                  onClick={() => setNovoPaciente({ ...novoPaciente, fotoUrl: '' })}
                  className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 shadow hover:bg-rose-600 transition-colors"
                  title="Remover Foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Foto do Paciente
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-1.5 shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-brand-600" />
                  <span>Carregar Imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFotoUpload}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-400">JPG, PNG ou WEBP até 2MB</p>
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
                Nascimento
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
                Telefone (WhatsApp) *
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

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Contato de Emergência
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nome do Responsável"
                value={novoPaciente.contatoEmergenciaNome}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, contatoEmergenciaNome: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="text"
                placeholder="Telefone"
                value={novoPaciente.contatoEmergenciaTel}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, contatoEmergenciaTel: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

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

    </div>
  );
};
