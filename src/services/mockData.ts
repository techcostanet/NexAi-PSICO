import { Paciente, ProntuarioRegistro, Agendamento, TransacaoFinanceira, UserProfile, RegistroEmocao } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_medico_1',
    nome: 'Dr. Roberto Silveira',
    email: 'dr.roberto@nexai-psico.com.br',
    role: 'medico',
    especialidade: 'Psiquiatria Clínica e Psicofarmacologia',
    registroProfissional: 'CRM/SP 142.890 - RQE 58912',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    googleCalendarId: 'dr.roberto.nexai@gmail.com'
  },
  {
    id: 'usr_psico_1',
    nome: 'Dra. Camila Nogueira',
    email: 'camila.psico@nexai-psico.com.br',
    role: 'psicologo',
    especialidade: 'Psicologia Clínica & TCC',
    registroProfissional: 'CRP 06/118.432',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813515-385038c117d9?w=150&auto=format&fit=crop&q=80',
    googleCalendarId: 'camila.nogueira.psi@gmail.com'
  },
  {
    id: 'usr_recepcao_1',
    nome: 'Juliana Mendes',
    email: 'recepcao@nexai-psico.com.br',
    role: 'recepcao',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_admin_1',
    nome: 'Administração NexAi',
    email: 'gestao@nexai-psico.com.br',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PACIENTES: Paciente[] = [
  {
    id: 'pac_1',
    nomeCompleto: 'Helena Vasconcelos Duarte',
    cpf: '128.459.789-02',
    dataNascimento: '1988-04-12',
    genero: 'F',
    telefone: '+5511988776655',
    email: 'helena.duarte@email.com',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1200, Apto 82',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100'
    },
    contatoEmergencia: {
      nome: 'Marcelo Duarte (Esposo)',
      parentesco: 'Cônjuge',
      telefone: '+5511977665544'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Histórico de crise de pânico aguda em 2023', 'Alergia severa a Penicilina'],
    alergias: ['Penicilina', 'Dipirona'],
    driveFolderId: 'folder_drive_helena_001',
    driveFolderUrl: 'https://drive.google.com/drive/folders/mock_helena_001',
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'adulto',
      tokenAcesso: 'helena-2026',
      pinAcesso: '1234',
      atualizadoEm: '2026-08-30T10:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2023-01-15T10:00:00Z',
    atualizadoEm: '2026-08-30T14:20:00Z',
    criadoPor: 'usr_recepcao_1'
  },
  {
    id: 'pac_2',
    nomeCompleto: 'Gabriel Menezes Castro',
    cpf: '349.812.678-44',
    dataNascimento: '1995-11-23',
    genero: 'M',
    telefone: '+5511994321876',
    email: 'gabriel.castro@tech.io',
    endereco: {
      logradouro: 'Rua dos Pinheiros',
      numero: '450',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '05422-000'
    },
    contatoEmergencia: {
      nome: 'Renata Menezes (Mãe)',
      parentesco: 'Mãe',
      telefone: '+5511981239876'
    },
    dadosConvenio: {
      tipo: 'convenio',
      nomeConvenio: 'Bradesco Saúde Top Nacional',
      numeroCarteirinha: '839210984712093'
    },
    alertasMedicos: ['Transtorno de Déficit de Atenção e Hiperatividade (TDAH)', 'Em uso de psicoestimulante controlado'],
    alergias: [],
    driveFolderId: 'folder_drive_gabriel_002',
    driveFolderUrl: 'https://drive.google.com/drive/folders/mock_gabriel_002',
    totalDocumentosScaneados: 2,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'teen',
      tokenAcesso: 'gabriel-tdah',
      pinAcesso: '4321',
      atualizadoEm: '2026-08-30T10:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2023-08-10T11:30:00Z',
    atualizadoEm: '2026-08-31T09:15:00Z',
    criadoPor: 'usr_recepcao_1'
  },
  {
    id: 'pac_3',
    nomeCompleto: 'Maria Aparecida Santos',
    cpf: '043.912.338-91',
    dataNascimento: '1962-07-05',
    genero: 'F',
    telefone: '+5511976543210',
    endereco: {
      logradouro: 'Rua Domingos de Morais',
      numero: '890',
      bairro: 'Vila Mariana',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04010-100'
    },
    contatoEmergencia: {
      nome: 'Cláudia Santos (Filha)',
      parentesco: 'Filha',
      telefone: '+5511988990011'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Paciente idosa com insônia crônica e luto recente', 'Hipertensão arterial controlada'],
    alergias: ['Sulfa'],
    driveFolderId: 'folder_drive_maria_003',
    driveFolderUrl: 'https://drive.google.com/drive/folders/mock_maria_003',
    totalDocumentosScaneados: 1,
    status: 'ativo',
    criadoEm: '2022-03-20T09:00:00Z',
    atualizadoEm: '2026-08-28T16:00:00Z',
    criadoPor: 'usr_recepcao_1'
  },
  {
    id: 'pac_4',
    nomeCompleto: 'Lucas Fontes de Albuquerque',
    cpf: '401.554.892-15',
    dataNascimento: '2001-09-18',
    genero: 'M',
    telefone: '+5511991122334',
    email: 'lucas.fontes@albuquerque.adv.br',
    contatoEmergencia: {
      nome: 'Ana Maria Fontes',
      parentesco: 'Mãe',
      telefone: '+5511988112233'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Passivo em papel pendente de digitalização completa'],
    totalDocumentosScaneados: 0,
    status: 'ativo',
    criadoEm: '2026-08-31T08:00:00Z',
    atualizadoEm: '2026-08-31T08:00:00Z',
    criadoPor: 'usr_recepcao_1'
  },
  {
    id: 'pac_5',
    nomeCompleto: 'Sophia Martins Ribeiro (Criança - 8 anos)',
    cpf: '512.304.992-80',
    dataNascimento: '2018-05-14',
    genero: 'F',
    telefone: '+5511982341122',
    contatoEmergencia: {
      nome: 'Juliana Martins (Mãe)',
      parentesco: 'Mãe',
      telefone: '+5511982341122'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Acompanhamento psicológico infantil - ansiedade escolar e regulação das emoções'],
    totalDocumentosScaneados: 0,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'kids',
      tokenAcesso: 'sophia-kids',
      pinAcesso: '2018',
      atualizadoEm: '2026-08-20T10:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-08-20T10:00:00Z',
    atualizadoEm: '2026-08-20T10:00:00Z',
    criadoPor: 'usr_psico_1'
  }
];

export const INITIAL_PRONTUARIOS: ProntuarioRegistro[] = [
  {
    id: 'pront_1',
    pacienteId: 'pac_1',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    especialidade: 'Psiquiatria',
    dataAtendimento: '2026-08-15T15:30:00Z',
    tipoRegistro: 'evolucao_ia',
    conteudoClinico: {
      subjetivo: 'Paciente comparece acompanhada do esposo para consulta de seguimento. Relata melhora substancial do humor nas últimas 3 semanas após aumento do Escitalopram para 15mg. Padrão de sono regularizado (7h ininterruptas). Nega ataques de pânico recentes ou episódios de taquicardia paroxística. Refere que voltou a praticar atividade física aeróbica 3x/semana.',
      objetivo: 'Exame do Estado Mental: Paciente lúcida, orientada no tempo e espaço (LOTE). Aparência cuidada, contato visual espontâneo e empático. Humor eutímico, afeto modulado e congruente com o conteúdo do discurso. Pensamento com curso e forma preservados, sem delírios ou alterações da sensopercepção. Psicomotricidade normal. Juízo crítico preservado.',
      avaliacao: 'F32.1 - Episódio depressivo moderado em remissão clínica parcial/avançada. Boa tolerância aos psicofármacos atuais.',
      planoTerapeutico: '1. Manter Escitalopram 15mg/dia pela manhã.\n2. Manter Zolpidem 5mg se insônia pontual (máx. 2x por semana).\n3. Continuar psicoterapia semanal com foco em TCC.\n4. Retorno agendado para 60 dias para reavaliação clínica.',
      medicacoesPrescritas: [
        {
          nome: 'Oxalato de Escitalopram',
          dosagem: '15mg',
          posologia: 'Tomar 1 comprimido pela manhã após café',
          controlada: true,
          usoContinuo: true
        },
        {
          nome: 'Hemitartarato de Zolpidem',
          dosagem: '5mg',
          posologia: 'Tomar 1 comprimido 30 min antes de deitar em caso de insônia',
          controlada: true,
          usoContinuo: false
        }
      ],
      alertasRisco: 'Nenhum risco de ideação autolítica ou heteroagressividade detectado.'
    },
    audioMetadados: {
      duracaoSegundos: 142,
      transcricaoBruta: 'Paciente relata que está muito melhor, dormindo bem com 15mg de escitalopram, sem crises de ansiedade. Esposo confirma melhora no cotidiano. Mantido tratamento e orientado retorno em 2 meses.',
      resumoGeradoPorIA: true,
      aprovadoPeloMedico: true,
      editadoAposIA: true
    },
    criadoEm: '2026-08-15T16:00:00Z',
    atualizadoEm: '2026-08-15T16:05:00Z'
  },
  {
    id: 'pront_scan_1',
    pacienteId: 'pac_1',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    especialidade: 'Psiquiatria',
    dataAtendimento: '2024-02-10T10:00:00Z',
    tipoRegistro: 'scan_historico_drive',
    scanDriveMetadados: {
      driveFileId: 'drive_file_helena_scan_pdf_1998',
      driveWebViewLink: 'https://drive.google.com/file/d/mock_scan_helena_pdf/view',
      driveDownloadLink: 'https://drive.google.com/uc?id=mock_scan_helena_pdf',
      nomeArquivo: 'Prontuario_Fisico_Historico_Helena_Duarte.pdf',
      quantidadePaginas: 8,
      dataOriginalDocumento: '2018 a 2024',
      observacoes: 'Digitalização das fichas manuscritas de papel antigas da paciente (Anamnese inicial + 7 fichas de evolução manual).'
    },
    criadoEm: '2026-08-10T11:00:00Z',
    atualizadoEm: '2026-08-10T11:00:00Z'
  },
  {
    id: 'pront_2',
    pacienteId: 'pac_2',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    especialidade: 'Psiquiatria',
    dataAtendimento: '2026-08-20T11:00:00Z',
    tipoRegistro: 'evolucao_ia',
    conteudoClinico: {
      subjetivo: 'Paciente relata excelente resposta atencional com Cloridrato de Metilfenidato no trabalho como desenvolvedor de software. Nega taquicardia ou perda de apetite significativa. Refere que a organização de tarefas melhorou sensivelmente.',
      objetivo: 'LOTE, discurso coeso e bem articulado. Sem sinais de agitação psicomotora. Afeto e humor sem alterações.',
      avaliacao: 'F90.0 - Transtorno hipercinético com déficit de atenção predominantemente desatento.',
      planoTerapeutico: 'Manter Metilfenidato 20mg pela manhã nos dias de trabalho. Receita de controle especial entregue.',
      medicacoesPrescritas: [
        {
          nome: 'Cloridrato de Metilfenidato (Ritalina LA)',
          dosagem: '20mg',
          posologia: '1 cápsula às 08h pela manhã',
          controlada: true,
          usoContinuo: true
        }
      ],
      alertasRisco: 'Sem riscos identificados.'
    },
    audioMetadados: {
      duracaoSegundos: 95,
      resumoGeradoPorIA: true,
      aprovadoPeloMedico: true,
      editadoAposIA: false
    },
    criadoEm: '2026-08-20T11:30:00Z',
    atualizadoEm: '2026-08-20T11:30:00Z'
  }
];

export const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: 'agend_1',
    pacienteId: 'pac_1',
    pacienteNome: 'Helena Vasconcelos Duarte',
    pacienteTelefone: '+5511988776655',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    dataHoraFim: new Date(Date.now() + 80 * 60 * 1000).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'confirmado',
    googleCalendarEventId: 'gcal_event_001_helena',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pago',
    notasRecepcao: 'Chegou pontualmente. Aguardando na sala de espera.',
    criadoEm: '2026-08-25T10:00:00Z',
    atualizadoEm: '2026-08-31T14:00:00Z'
  },
  {
    id: 'agend_2',
    pacienteId: 'pac_2',
    pacienteNome: 'Gabriel Menezes Castro',
    pacienteTelefone: '+5511994321876',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    dataHoraFim: new Date(Date.now() + 170 * 60 * 1000).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'telemedicina',
    status: 'agendado',
    googleCalendarEventId: 'gcal_event_002_gabriel',
    googleMeetLink: 'https://meet.google.com/abc-nexai-psi',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'convenio',
    notasRecepcao: 'Teleconsulta via Google Meet.',
    criadoEm: '2026-08-26T11:00:00Z',
    atualizadoEm: '2026-08-26T11:00:00Z'
  },
  {
    id: 'agend_3',
    pacienteId: 'pac_4',
    pacienteNome: 'Lucas Fontes de Albuquerque',
    pacienteTelefone: '+5511991122334',
    profissionalId: 'usr_psico_1',
    profissionalNome: 'Dra. Camila Nogueira',
    especialidade: 'Psicologia TCC',
    dataHoraInicio: new Date(Date.now() + 240 * 60 * 1000).toISOString(),
    dataHoraFim: new Date(Date.now() + 290 * 60 * 1000).toISOString(),
    tipoConsulta: 'primeira_consulta',
    modalidade: 'presencial',
    status: 'em_espera',
    googleCalendarEventId: 'gcal_event_003_lucas',
    sincronizadoGoogle: true,
    valorCobrado: 300.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Primeira consulta de avaliação psicológica.',
    criadoEm: '2026-08-28T14:30:00Z',
    atualizadoEm: '2026-08-31T15:00:00Z'
  }
];

export const INITIAL_TRANSACOES: TransacaoFinanceira[] = [
  {
    id: 'trans_1',
    agendamentoId: 'agend_1',
    pacienteId: 'pac_1',
    pacienteNome: 'Helena Vasconcelos Duarte',
    pacienteCpf: '128.459.789-02',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    valor: 450.00,
    tipo: 'receita',
    categoria: 'consulta_particular',
    metodoPagamento: 'pix',
    status: 'pago',
    dataVencimento: '2026-08-31',
    dataPagamento: '2026-08-31T14:05:00Z',
    reciboEmitido: true,
    numeroRecibo: 'REC-2026-0842',
    emitirParaCpf: '128.459.789-02',
    discriminacaoServico: 'Consulta médica psiquiátrica especializada individual.',
    criadoEm: '2026-08-31T14:05:00Z',
    atualizadoEm: '2026-08-31T14:05:00Z'
  },
  {
    id: 'trans_2',
    agendamentoId: 'agend_3',
    pacienteId: 'pac_4',
    pacienteNome: 'Lucas Fontes de Albuquerque',
    pacienteCpf: '401.554.892-15',
    profissionalId: 'usr_psico_1',
    profissionalNome: 'Dra. Camila Nogueira',
    profissionalRegistro: 'CRP 06/118.432',
    valor: 300.00,
    tipo: 'receita',
    categoria: 'consulta_particular',
    metodoPagamento: 'cartao_credito',
    status: 'pendente',
    dataVencimento: '2026-08-31',
    reciboEmitido: false,
    emitirParaCpf: '401.554.892-15',
    discriminacaoServico: 'Sessão de Psicoterapia Individual (Terapia Cognitivo-Comportamental).',
    criadoEm: '2026-08-31T09:00:00Z',
    atualizadoEm: '2026-08-31T09:00:00Z'
  }
];

export const INITIAL_EMOCOES: RegistroEmocao[] = [
  // Helena (Adulto - Acompanhamento TCC / Psiquiatria)
  {
    id: 'emo_1',
    pacienteId: 'pac_1',
    dataHora: '2026-08-24T08:30:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Calma', 'Esperança', 'Disposição'],
    gatilhos: ['Exercício', 'Sono'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    anotacaoLivre: 'Dormi 8 horas direto. Acordei disposta e fiz caminhada de 30min no parque.',
    modoUsado: 'adulto'
  },
  {
    id: 'emo_2',
    pacienteId: 'pac_1',
    dataHora: '2026-08-25T19:00:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Cansaço', 'Ansiedade leve'],
    gatilhos: ['Trabalho', 'Prazo'],
    qualidadeSono: 'regular',
    tomouMedicacao: true,
    anotacaoLivre: 'Muitas reuniões no trabalho hoje, mas apliquei a respiração diafragmática e não tive crise.',
    modoUsado: 'adulto'
  },
  {
    id: 'emo_3',
    pacienteId: 'pac_1',
    dataHora: '2026-08-26T21:40:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Angústia', 'Tristeza', 'Sobrecarga'],
    gatilhos: ['Família', 'Insônia'],
    qualidadeSono: 'pessimo',
    tomouMedicacao: true,
    anotacaoLivre: 'Discussão familiar ontem me deixou sem dormir. Senti o peito apertado à tarde.',
    modoUsado: 'adulto'
  },
  {
    id: 'emo_4',
    pacienteId: 'pac_1',
    dataHora: '2026-08-28T10:00:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Alívio', 'Paz'],
    gatilhos: ['Terapia', 'Sono'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    anotacaoLivre: 'Conversamos na sessão sobre limites interpessoais e me senti muito mais leve.',
    modoUsado: 'adulto'
  },
  {
    id: 'emo_5',
    pacienteId: 'pac_1',
    dataHora: '2026-08-30T11:30:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Alegria', 'Gratidão', 'Energia'],
    gatilhos: ['Família', 'Lazer'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    anotacaoLivre: 'Passeio incrível de fim de semana com a família. Me senti conectada e feliz.',
    modoUsado: 'adulto'
  },

  // Gabriel (Teen / Jovem - TDAH)
  {
    id: 'emo_6',
    pacienteId: 'pac_2',
    dataHora: '2026-08-25T17:00:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Frustração', 'Inquietação', 'Desmotivado'],
    gatilhos: ['Estudos / Faculdade', 'Foco'],
    qualidadeSono: 'regular',
    tomouMedicacao: false,
    anotacaoLivre: 'Esqueci de tomar o remédio de manhã e perdi o foco o dia todo. Bateu culpa.',
    modoUsado: 'teen'
  },
  {
    id: 'emo_7',
    pacienteId: 'pac_2',
    dataHora: '2026-08-27T21:00:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Foco', 'Orgulho', 'Produtivo'],
    gatilhos: ['Medicação', 'Música'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    anotacaoLivre: 'Entreguei o projeto de programação a tempo! Usei a técnica Pomodoro.',
    modoUsado: 'teen'
  },
  {
    id: 'emo_8',
    pacienteId: 'pac_2',
    dataHora: '2026-08-29T16:20:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Tédio', 'Ansioso'],
    gatilhos: ['Celular / Redes', 'Sono'],
    qualidadeSono: 'regular',
    tomouMedicacao: true,
    anotacaoLivre: 'Fiquei preso no feed muito tempo sem querer, mas saí pra correr no fim da tarde.',
    modoUsado: 'teen'
  },

  // Sophia (Kids - 8 anos)
  {
    id: 'emo_9',
    pacienteId: 'pac_5',
    dataHora: '2026-08-28T16:00:00Z',
    nivelHumor: 1,
    emocoesPrimarias: ['Brava / Zangada', 'Vontade de chorar'],
    gatilhos: ['Escola', 'Briga com colega'],
    qualidadeSono: 'regular',
    anotacaoLivre: 'Um colega pegou meu estojo sem pedir e quebrou minha caneta roxa.',
    modoUsado: 'kids'
  },
  {
    id: 'emo_10',
    pacienteId: 'pac_5',
    dataHora: '2026-08-29T11:00:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Calma', 'Pensativa'],
    gatilhos: ['Família', 'Desenho / Arte'],
    qualidadeSono: 'bom',
    anotacaoLivre: 'Pintei um desenho de borboleta com minha mãe e conversei sobre o estojo.',
    modoUsado: 'kids'
  },
  {
    id: 'emo_11',
    pacienteId: 'pac_5',
    dataHora: '2026-08-30T15:00:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Super Feliz', 'Brincalhona'],
    gatilhos: ['Parque', 'Amigos'],
    qualidadeSono: 'bom',
    anotacaoLivre: 'Fui no parque andar de patins e tomei sorvete de morango!',
    modoUsado: 'kids'
  }
];

