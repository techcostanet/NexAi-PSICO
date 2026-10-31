import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Paciente,
  ProntuarioRegistro,
  Agendamento,
  TransacaoFinanceira,
  StatusAgendamento,
  RegistroEmocao,
  ConfiguracaoDiarioPaciente,
} from '../types';
import {
  INITIAL_PACIENTES,
  INITIAL_PRONTUARIOS,
  INITIAL_AGENDAMENTOS,
  INITIAL_TRANSACOES,
  INITIAL_EMOCOES,
} from '../services/mockData';

interface DatabaseContextType {
  pacientes: Paciente[];
  prontuarios: ProntuarioRegistro[];
  agendamentos: Agendamento[];
  transacoes: TransacaoFinanceira[];
  registrosEmocoes: RegistroEmocao[];
  
  // Métodos de Pacientes
  adicionarPaciente: (paciente: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm' | 'totalDocumentosScaneados'>) => Paciente;
  atualizarPaciente: (id: string, dados: Partial<Paciente>) => void;
  obterPacientePorId: (id: string) => Paciente | undefined;
  removerPaciente: (id: string) => void;
  obterPacientePorCpfOuToken: (termo: string) => Paciente | undefined;
  atualizarConfiguracaoDiario: (pacienteId: string, config: Partial<ConfiguracaoDiarioPaciente>) => void;
  
  // Métodos de Prontuário
  adicionarProntuario: (prontuario: Omit<ProntuarioRegistro, 'id' | 'criadoEm' | 'atualizadoEm'>) => ProntuarioRegistro;
  atualizarProntuario: (id: string, dados: Partial<ProntuarioRegistro>) => void;
  obterProntuariosDoPaciente: (pacienteId: string) => ProntuarioRegistro[];

  // Métodos do Diário de Emoções / Portal do Paciente
  adicionarRegistroEmocao: (registro: Omit<RegistroEmocao, 'id'>) => RegistroEmocao;
  obterEmocoesDoPaciente: (pacienteId: string) => RegistroEmocao[];
  
  // Métodos de Agendamento
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id' | 'criadoEm' | 'atualizadoEm'>) => Agendamento;
  atualizarStatusAgendamento: (id: string, status: StatusAgendamento) => void;
  atualizarAgendamento: (id: string, dados: Partial<Agendamento>) => void;
  
  // Métodos Financeiros
  adicionarTransacao: (transacao: Omit<TransacaoFinanceira, 'id' | 'criadoEm' | 'atualizadoEm'>) => TransacaoFinanceira;
  atualizarTransacao: (id: string, dados: Partial<TransacaoFinanceira>) => void;
  
  // Utilitários de Reset
  restaurarDadosIniciais: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const NEXAI_DATA_VERSION_KEY = 'nexai_data_version_tag';
export const NEXAI_CURRENT_DATA_VERSION = 'v1.0.13_15_pacientes_completo';

function carregarColecao<T>(key: string, initialData: T[], minItemsExpected = 0): T[] {
  try {
    const versionSaved = localStorage.getItem(NEXAI_DATA_VERSION_KEY);
    // Se a versão de dados for diferente ou não existir, substitui pelo mock atualizado
    if (versionSaved !== NEXAI_CURRENT_DATA_VERSION) {
      localStorage.setItem(NEXAI_DATA_VERSION_KEY, NEXAI_CURRENT_DATA_VERSION);
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || (minItemsExpected > 0 && parsed.length < minItemsExpected)) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return parsed;
  } catch (err) {
    console.error('Falha ao ler colecao ' + key + ':', err);
    return initialData;
  }
}

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pacientes, setPacientes] = useState<Paciente[]>(() =>
    carregarColecao('nexai_pacientes', INITIAL_PACIENTES, 15)
  );

  const [prontuarios, setProntuarios] = useState<ProntuarioRegistro[]>(() =>
    carregarColecao('nexai_prontuarios', INITIAL_PRONTUARIOS, 1)
  );

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() =>
    carregarColecao('nexai_agendamentos', INITIAL_AGENDAMENTOS, 10)
  );

  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>(() =>
    carregarColecao('nexai_transacoes', INITIAL_TRANSACOES, 5)
  );

  const [registrosEmocoes, setRegistrosEmocoes] = useState<RegistroEmocao[]>(() =>
    carregarColecao('nexai_emocoes', INITIAL_EMOCOES, 25)
  );

  // Verificação na montagem para garantir sincronização de navegadores antigos
  useEffect(() => {
    const versionSaved = localStorage.getItem(NEXAI_DATA_VERSION_KEY);
    if (versionSaved !== NEXAI_CURRENT_DATA_VERSION || pacientes.length < 15) {
      console.log('🔄 Sincronizando base com os 15 pacientes e histórico completo...');
      localStorage.setItem(NEXAI_DATA_VERSION_KEY, NEXAI_CURRENT_DATA_VERSION);
      setPacientes(INITIAL_PACIENTES);
      setProntuarios(INITIAL_PRONTUARIOS);
      setAgendamentos(INITIAL_AGENDAMENTOS);
      setTransacoes(INITIAL_TRANSACOES);
      setRegistrosEmocoes(INITIAL_EMOCOES);
      localStorage.setItem('nexai_pacientes', JSON.stringify(INITIAL_PACIENTES));
      localStorage.setItem('nexai_prontuarios', JSON.stringify(INITIAL_PRONTUARIOS));
      localStorage.setItem('nexai_agendamentos', JSON.stringify(INITIAL_AGENDAMENTOS));
      localStorage.setItem('nexai_transacoes', JSON.stringify(INITIAL_TRANSACOES));
      localStorage.setItem('nexai_emocoes', JSON.stringify(INITIAL_EMOCOES));
    }
  }, []);

  // Salvar no localStorage sempre que houver modificações
  useEffect(() => {
    localStorage.setItem('nexai_pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem('nexai_prontuarios', JSON.stringify(prontuarios));
  }, [prontuarios]);

  useEffect(() => {
    localStorage.setItem('nexai_agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem('nexai_transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem('nexai_emocoes', JSON.stringify(registrosEmocoes));
  }, [registrosEmocoes]);

  // Funções de Paciente
  const adicionarPaciente = (dados: Omit<Paciente, 'id' | 'criadoEm' | 'atualizadoEm' | 'totalDocumentosScaneados'>) => {
    const now = new Date().toISOString();
    const novoPaciente: Paciente = {
      ...dados,
      id: `pac_${Date.now()}`,
      totalDocumentosScaneados: 0,
      criadoEm: now,
      atualizadoEm: now,
    };
    setPacientes((prev) => [novoPaciente, ...prev]);
    return novoPaciente;
  };

  const atualizarPaciente = (id: string, dados: Partial<Paciente>) => {
    const now = new Date().toISOString();
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...dados, atualizadoEm: now } : p))
    );
  };

  const obterPacientePorId = (id: string) => {
    return pacientes.find((p) => p.id === id);
  };

  const removerPaciente = (id: string) => {
    setPacientes((prev) => prev.filter((p) => p.id !== id));
  };

  // Funções de Prontuário
  const adicionarProntuario = (dados: Omit<ProntuarioRegistro, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const now = new Date().toISOString();
    const novoProntuario: ProntuarioRegistro = {
      ...dados,
      id: `pront_${Date.now()}`,
      criadoEm: now,
      atualizadoEm: now,
    };
    setProntuarios((prev) => [novoProntuario, ...prev]);

    // Se for scan histórico, incrementa contador no paciente
    if (dados.tipoRegistro === 'scan_historico_drive') {
      setPacientes((prev) =>
        prev.map((p) =>
          p.id === dados.pacienteId
            ? { ...p, totalDocumentosScaneados: (p.totalDocumentosScaneados || 0) + 1, atualizadoEm: now }
            : p
        )
      );
    }

    return novoProntuario;
  };

  const atualizarProntuario = (id: string, dados: Partial<ProntuarioRegistro>) => {
    const now = new Date().toISOString();
    setProntuarios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...dados, atualizadoEm: now } : p))
    );
  };

  const obterProntuariosDoPaciente = (pacienteId: string) => {
    return prontuarios
      .filter((p) => p.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.dataAtendimento).getTime() - new Date(a.dataAtendimento).getTime());
  };

  // Funções de Agendamento
  const adicionarAgendamento = (dados: Omit<Agendamento, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const now = new Date().toISOString();
    const novoAgendamento: Agendamento = {
      ...dados,
      id: `agend_${Date.now()}`,
      criadoEm: now,
      atualizadoEm: now,
    };
    setAgendamentos((prev) => [novoAgendamento, ...prev]);

    // Cria automaticamente registro financeiro correspondente
    if (dados.valorCobrado > 0) {
      const novaTransacao: TransacaoFinanceira = {
        id: `trans_${Date.now()}`,
        agendamentoId: novoAgendamento.id,
        pacienteId: dados.pacienteId,
        pacienteNome: dados.pacienteNome,
        pacienteCpf: '',
        profissionalId: dados.profissionalId,
        profissionalNome: dados.profissionalNome,
        profissionalRegistro: '',
        valor: dados.valorCobrado,
        tipo: 'receita',
        categoria: 'consulta_particular',
        metodoPagamento: dados.pagamentoStatus === 'convenio' ? 'convenio' : 'pix',
        status: dados.pagamentoStatus === 'pago' ? 'pago' : 'pendente',
        dataVencimento: dados.dataHoraInicio.split('T')[0],
        dataPagamento: dados.pagamentoStatus === 'pago' ? now : undefined,
        reciboEmitido: false,
        emitirParaCpf: '',
        discriminacaoServico: `Consulta médica / psicológica (${dados.tipoConsulta}) com ${dados.profissionalNome}`,
        criadoEm: now,
        atualizadoEm: now,
      };
      setTransacoes((prev) => [novaTransacao, ...prev]);
    }

    return novoAgendamento;
  };

  const atualizarStatusAgendamento = (id: string, status: StatusAgendamento) => {
    const now = new Date().toISOString();
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, atualizadoEm: now } : a))
    );
  };

  const atualizarAgendamento = (id: string, dados: Partial<Agendamento>) => {
    const now = new Date().toISOString();
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...dados, atualizadoEm: now } : a))
    );
  };

  // Funções Financeiras
  const adicionarTransacao = (dados: Omit<TransacaoFinanceira, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const now = new Date().toISOString();
    const novaTransacao: TransacaoFinanceira = {
      ...dados,
      id: `trans_${Date.now()}`,
      criadoEm: now,
      atualizadoEm: now,
    };
    setTransacoes((prev) => [novaTransacao, ...prev]);
    return novaTransacao;
  };

  const atualizarTransacao = (id: string, dados: Partial<TransacaoFinanceira>) => {
    const now = new Date().toISOString();
    setTransacoes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...dados, atualizadoEm: now } : t))
    );
  };

  // Funções do Portal do Paciente & Diário de Emoções
  const obterPacientePorCpfOuToken = (termo: string): Paciente | undefined => {
    if (!termo) return undefined;
    const termoLimpo = termo.trim().toLowerCase().replace(/\D/g, '');
    const termoOriginal = termo.trim().toLowerCase();

    return pacientes.find((p) => {
      // Comparação por CPF (apenas dígitos)
      const cpfLimpo = p.cpf.replace(/\D/g, '');
      if (termoLimpo && cpfLimpo === termoLimpo) return true;

      // Comparação por Token de acesso direto
      if (p.configuracaoDiario?.tokenAcesso && p.configuracaoDiario.tokenAcesso.toLowerCase() === termoOriginal) {
        return true;
      }

      // Comparação por ID
      if (p.id.toLowerCase() === termoOriginal) return true;

      return false;
    });
  };

  const atualizarConfiguracaoDiario = (pacienteId: string, config: Partial<ConfiguracaoDiarioPaciente>) => {
    const now = new Date().toISOString();
    setPacientes((prev) =>
      prev.map((p) => {
        if (p.id !== pacienteId) return p;
        const configAtual: ConfiguracaoDiarioPaciente = p.configuracaoDiario || {
          habilitado: false,
          modoInterfaceDefault: 'adulto',
          tokenAcesso: `pac-${p.id.substring(4)}`,
          atualizadoEm: now,
        };
        return {
          ...p,
          configuracaoDiario: {
            ...configAtual,
            ...config,
            atualizadoEm: now,
          },
          atualizadoEm: now,
        };
      })
    );
  };

  const adicionarRegistroEmocao = (registro: Omit<RegistroEmocao, 'id'>) => {
    const novoRegistro: RegistroEmocao = {
      ...registro,
      id: `emo_${Date.now()}`,
    };
    setRegistrosEmocoes((prev) => [novoRegistro, ...prev]);

    // Atualiza o último acesso na configuração do paciente
    atualizarConfiguracaoDiario(registro.pacienteId, {
      ultimoAcesso: registro.dataHora || new Date().toISOString(),
    });

    return novoRegistro;
  };

  const obterEmocoesDoPaciente = (pacienteId: string) => {
    return registrosEmocoes
      .filter((e) => e.pacienteId === pacienteId)
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
  };

  const restaurarDadosIniciais = () => {
    localStorage.setItem(NEXAI_DATA_VERSION_KEY, NEXAI_CURRENT_DATA_VERSION);
    setPacientes(INITIAL_PACIENTES);
    setProntuarios(INITIAL_PRONTUARIOS);
    setAgendamentos(INITIAL_AGENDAMENTOS);
    setTransacoes(INITIAL_TRANSACOES);
    setRegistrosEmocoes(INITIAL_EMOCOES);
    localStorage.setItem('nexai_pacientes', JSON.stringify(INITIAL_PACIENTES));
    localStorage.setItem('nexai_prontuarios', JSON.stringify(INITIAL_PRONTUARIOS));
    localStorage.setItem('nexai_agendamentos', JSON.stringify(INITIAL_AGENDAMENTOS));
    localStorage.setItem('nexai_transacoes', JSON.stringify(INITIAL_TRANSACOES));
    localStorage.setItem('nexai_emocoes', JSON.stringify(INITIAL_EMOCOES));
  };

  return (
    <DatabaseContext.Provider
      value={{
        pacientes,
        prontuarios,
        agendamentos,
        transacoes,
        registrosEmocoes,
        adicionarPaciente,
        atualizarPaciente,
        obterPacientePorId,
        removerPaciente,
        obterPacientePorCpfOuToken,
        atualizarConfiguracaoDiario,
        adicionarProntuario,
        atualizarProntuario,
        obterProntuariosDoPaciente,
        adicionarRegistroEmocao,
        obterEmocoesDoPaciente,
        adicionarAgendamento,
        atualizarStatusAgendamento,
        atualizarAgendamento,
        adicionarTransacao,
        atualizarTransacao,
        restaurarDadosIniciais,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase deve ser usado dentro de um DatabaseProvider');
  }
  return context;
};
