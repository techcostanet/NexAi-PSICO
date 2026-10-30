import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useSaasPlan } from '../../context/SaasPlanContext';
import { useToast } from '../../context/ToastContext';
import { Paciente } from '../../types';
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
  const [isModalNovoPacienteOpen, setIsModalNovoPacienteOpen] = useState(false);

  const [novoPaciente, setNovoPaciente] = useState<{
    nomeCompleto: string;
    cpf: string;
    dataNascimento: string;
    genero: 'M' | 'F' | 'Outro' | 'NaoInformado';
    telefone: string;
    email: string;
    contatoEmergenciaNome: string;
    contatoEmergenciaTel: string;
    convenioTipo: 'particular' | 'convenio';
    nomeConvenio: string;
  }>({
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '1990-01-01',
    genero: 'F',
    telefone: '+55119',
    email: '',
    contatoEmergenciaNome: '',
    contatoEmergenciaTel: '',
    convenioTipo: 'particular',
    nomeConvenio: '',
  });

  const handleCadastrarPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPaciente.nomeCompleto || !novoPaciente.cpf) {
      showToast('Preencha os campos obrigatórios', 'Nome e CPF são necessários.', 'warning');
      return;
    }

    const pacienteCriado = adicionarPaciente({
      nomeCompleto: novoPaciente.nomeCompleto,
      cpf: novoPaciente.cpf,
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
      status: 'ativo',
      criadoPor: currentUser.id,
    });

    setIsModalNovoPacienteOpen(false);
    showToast('Paciente Cadastrado com Sucesso!', 'Ficha criada com sucesso.', 'success');
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

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho da Lista */}
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

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalNovoPacienteOpen(true)}
        >
          Novo Paciente
        </Button>
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

      {/* Lista de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pacientesFiltrados.map((paciente) => (
          <Card
            key={paciente.id}
            className="p-5 flex flex-col justify-between hover:border-brand-300 dark:hover:border-brand-800 transition-all hover:shadow-md group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    onClick={() => onSelectPaciente(paciente.id)}
                    className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors cursor-pointer"
                  >
                    {paciente.nomeCompleto}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    CPF: {paciente.cpf} • {paciente.telefone}
                  </p>
                </div>
                <Badge variant={paciente.status === 'ativo' ? 'success' : 'neutral'}>
                  {paciente.status}
                </Badge>
              </div>

              {/* Status do Passivo Físico no Google Drive (se módulo ativo) */}
              {modules.scannerFichas && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FolderSync className="w-4 h-4 text-brand-600" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {paciente.totalDocumentosScaneados > 0
                        ? `${paciente.totalDocumentosScaneados} Prontuário(s) no Drive`
                        : 'Ficha física ainda não escaneada'}
                    </span>
                  </div>
                  {paciente.totalDocumentosScaneados > 0 ? (
                    <Badge variant="brand" size="sm">Sincronizado</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">Pendente</Badge>
                  )}
                </div>
              )}

              {/* Alertas Médicos Rápidos */}
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
                {/* Botão Scanner (se ativo) */}
                {modules.scannerFichas && (
                  <button
                    onClick={() => onOpenScannerForPaciente(paciente.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Digitalizar fichas no Drive"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}

                {/* Botão Consulta IA (se ativo e profissional de saúde) */}
                {modules.consultaIa && isProfissionalSaude && (
                  <button
                    onClick={() => onOpenConsultationForPaciente(paciente.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Iniciar Consulta IA"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Ver Prontuário */}
              <button
                onClick={() => onSelectPaciente(paciente.id)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 py-1.5 px-2.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
              >
                <span>Ver Prontuário</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Cadastro de Novo Paciente */}
      <Modal
        isOpen={isModalNovoPacienteOpen}
        onClose={() => setIsModalNovoPacienteOpen(false)}
        title="Cadastrar Novo Paciente"
      >
        <form onSubmit={handleCadastrarPaciente} className="space-y-4">
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
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Gênero
              </label>
              <select
                value={novoPaciente.genero}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, genero: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="Outro">Outro</option>
                <option value="NaoInformado">Não Informar</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Contato de Emergência (Responsável)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nome do Responsável"
                value={novoPaciente.contatoEmergenciaNome}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, contatoEmergenciaNome: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <input
                type="text"
                placeholder="Telefone"
                value={novoPaciente.contatoEmergenciaTel}
                onChange={(e) => setNovoPaciente({ ...novoPaciente, contatoEmergenciaTel: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
