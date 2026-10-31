import { Paciente, ProntuarioRegistro, Agendamento, TransacaoFinanceira, UserProfile, RegistroEmocao } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_medico_1',
    nome: 'Dr. Roberto Silveira',
    email: 'dr.roberto@nexai.com',
    role: 'medico',
    especialidade: 'Psiquiatria Clínica e Psicofarmacologia',
    registroProfissional: 'CRM/SP 142.890 - RQE 58912',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    googleCalendarId: 'dr.roberto.nexai@gmail.com'
  },
  {
    id: 'usr_psico_1',
    nome: 'Dra. Camila Nogueira',
    email: 'camila.psico@nexai.com',
    role: 'psicologo',
    especialidade: 'Psicologia Clínica e TCC',
    registroProfissional: 'CRP 06/118.432',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813515-385038c117d9?w=150&auto=format&fit=crop&q=80',
    googleCalendarId: 'camila.nogueira.psi@gmail.com'
  }
];

// ==========================================
// 15 PACIENTES: 5 KIDS, 5 TEEN E 5 ADULTO
// ==========================================
export const INITIAL_PACIENTES: Paciente[] = [
  // ----------------------------------------
  // GRUPO 1: DIÁRIO INFANTIL (KIDS) - 5 PACIENTES
  // ----------------------------------------
  {
    id: 'pac_5',
    nomeCompleto: 'Sophia Martins Ribeiro',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    cpf: '512.304.992-80',
    dataNascimento: '2018-05-14',
    genero: 'F',
    telefone: '+55 11 98234-1122',
    email: 'juliana.martins@email.com',
    endereco: {
      logradouro: 'Rua Pamplona',
      numero: '540, Apto 41',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01405-000'
    },
    contatoEmergencia: {
      nome: 'Juliana Martins Ribeiro',
      parentesco: 'Mãe',
      telefone: '+55 11 98234-1122'
    },
    responsaveis: [
      {
        nome: 'Juliana Martins Ribeiro',
        parentesco: 'Mãe',
        telefone: '+55 11 98234-1122',
        cpf: '231.849.001-44',
        email: 'juliana.martins@email.com'
      }
    ],
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Ansiedade de desempenho escolar', 'Perfeccionismo infantil'],
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'kids',
      tokenAcesso: 'sophia-kids',
      pinAcesso: '2018',
      temaVisual: 'safari',
      mascote: 'leao',
      atualizadoEm: '2026-10-28T10:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-07-15T10:00:00Z',
    atualizadoEm: '2026-10-28T10:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_6',
    nomeCompleto: 'Pedro Henrique Silveira',
    fotoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=300&auto=format&fit=crop&q=80',
    cpf: '614.902.118-05',
    dataNascimento: '2019-02-10',
    genero: 'M',
    telefone: '+55 11 98455-6677',
    email: 'mariana.silveira@email.com',
    endereco: {
      logradouro: 'Rua Harmonia',
      numero: '215',
      bairro: 'Vila Madalena',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '05435-000'
    },
    contatoEmergencia: {
      nome: 'Mariana Silveira',
      parentesco: 'Mãe',
      telefone: '+55 11 98455-6677'
    },
    responsaveis: [
      {
        nome: 'Mariana Silveira',
        parentesco: 'Mãe',
        telefone: '+55 11 98455-6677',
        cpf: '312.981.445-12'
      }
    ],
    dadosConvenio: {
      tipo: 'convenio',
      nomeConvenio: 'Bradesco Saúde'
    },
    alertasMedicos: ['TDAH infantil tipo combinado', 'Agitação psicomotora'],
    totalDocumentosScaneados: 2,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'kids',
      tokenAcesso: 'pedro-kids',
      pinAcesso: '1234',
      temaVisual: 'floresta',
      mascote: 'sapo',
      atualizadoEm: '2026-10-29T11:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-06-10T09:30:00Z',
    atualizadoEm: '2026-10-29T11:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_7',
    nomeCompleto: 'Beatriz Lima Carvalho',
    fotoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80',
    cpf: '723.118.459-20',
    dataNascimento: '2020-07-22',
    genero: 'F',
    telefone: '+55 11 97122-3344',
    contatoEmergencia: {
      nome: 'Carlos Eduardo Carvalho',
      parentesco: 'Pai',
      telefone: '+55 11 97122-3344'
    },
    responsaveis: [
      {
        nome: 'Carlos Eduardo Carvalho',
        parentesco: 'Pai',
        telefone: '+55 11 97122-3344',
        cpf: '198.443.201-90'
      }
    ],
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Ansiedade de separação', 'Medo intenso do escuro e pesadelos'],
    totalDocumentosScaneados: 0,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'kids',
      tokenAcesso: 'beatriz-kids',
      pinAcesso: '2020',
      temaVisual: 'galaxia',
      mascote: 'estrela',
      atualizadoEm: '2026-10-25T14:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-07-02T14:00:00Z',
    atualizadoEm: '2026-10-25T14:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_8',
    nomeCompleto: 'Theo Albuquerque Santos',
    fotoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=300&auto=format&fit=crop&q=80',
    cpf: '834.551.209-66',
    dataNascimento: '2017-11-05',
    genero: 'M',
    telefone: '+55 11 98334-4556',
    contatoEmergencia: {
      nome: 'Renata Albuquerque Santos',
      parentesco: 'Mãe',
      telefone: '+55 11 98334-4556'
    },
    responsaveis: [
      {
        nome: 'Renata Albuquerque Santos',
        parentesco: 'Mãe',
        telefone: '+55 11 98334-4556',
        cpf: '405.123.889-01'
      }
    ],
    dadosConvenio: {
      tipo: 'convenio',
      nomeConvenio: 'SulAmérica Saúde'
    },
    alertasMedicos: ['Suspeita de TEA nível 1', 'Hiperfoco e sensibilidade auditiva'],
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'kids',
      tokenAcesso: 'theo-kids',
      pinAcesso: '1234',
      temaVisual: 'safari',
      mascote: 'urso',
      atualizadoEm: '2026-10-27T16:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-05-18T16:00:00Z',
    atualizadoEm: '2026-10-27T16:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_9',
    nomeCompleto: 'Alice Mendes Vasconcelos',
    fotoUrl: 'https://images.unsplash.com/photo-1595454223600-91fbdd7ce73c?w=300&auto=format&fit=crop&q=80',
    cpf: '945.662.310-77',
    dataNascimento: '2016-03-30',
    genero: 'F',
    telefone: '+55 11 97665-5443',
    contatoEmergencia: {
      nome: 'Fernando Vasconcelos',
      parentesco: 'Pai',
      telefone: '+55 11 97665-5443'
    },
    responsaveis: [
      {
        nome: 'Fernando Vasconcelos',
        parentesco: 'Pai',
        telefone: '+55 11 97665-5443',
        cpf: '340.551.789-33'
      }
    ],
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Somatização gastrintestinal em dias de prova', 'Fobia escolar'],
    totalDocumentosScaneados: 0,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'kids',
      tokenAcesso: 'alice-kids',
      pinAcesso: '2016',
      temaVisual: 'reino',
      mascote: 'dragao',
      atualizadoEm: '2026-10-30T09:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-08-01T09:00:00Z',
    atualizadoEm: '2026-10-30T09:00:00Z',
    criadoPor: 'usr_medico_1'
  },

  // ----------------------------------------
  // GRUPO 2: DIÁRIO JUVENIL (TEEN) - 5 PACIENTES
  // ----------------------------------------
  {
    id: 'pac_2',
    nomeCompleto: 'Gabriel Menezes Castro',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    cpf: '349.882.109-44',
    dataNascimento: '2010-02-14',
    genero: 'M',
    telefone: '+55 11 98765-4320',
    email: 'gabriel.castro@gmail.com',
    contatoEmergencia: {
      nome: 'Amanda Menezes Castro',
      parentesco: 'Mãe',
      telefone: '+55 11 98765-4320'
    },
    responsaveis: [
      {
        nome: 'Amanda Menezes Castro',
        parentesco: 'Mãe',
        telefone: '+55 11 98765-4320',
        cpf: '219.832.441-05'
      }
    ],
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['TDAH tipo desatento', 'Dificuldade de sono com luz de telas'],
    totalDocumentosScaneados: 2,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'teen',
      tokenAcesso: 'gabriel-teen',
      pinAcesso: '2026',
      temaVisual: 'cyberpunk',
      atualizadoEm: '2026-10-30T17:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-06-15T11:00:00Z',
    atualizadoEm: '2026-10-30T17:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_10',
    nomeCompleto: 'Isabela Rocha Fontes',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    cpf: '456.771.890-12',
    dataNascimento: '2009-08-19',
    genero: 'F',
    telefone: '+55 11 99344-5566',
    email: 'isa.fontes@gmail.com',
    contatoEmergencia: {
      nome: 'Roberto Rocha Fontes',
      parentesco: 'Pai',
      telefone: '+55 11 99344-5566'
    },
    responsaveis: [
      {
        nome: 'Roberto Rocha Fontes',
        parentesco: 'Pai',
        telefone: '+55 11 99344-5566',
        cpf: '182.903.441-22'
      }
    ],
    dadosConvenio: {
      tipo: 'convenio',
      nomeConvenio: 'Unimed Seguros'
    },
    alertasMedicos: ['Ansiedade pré-vestibular', 'Crises de choro antes de simulados'],
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'teen',
      tokenAcesso: 'isabela-teen',
      pinAcesso: '2009',
      temaVisual: 'synthwave',
      atualizadoEm: '2026-10-29T20:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-07-20T10:00:00Z',
    atualizadoEm: '2026-10-29T20:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_11',
    nomeCompleto: 'Enzo Fagundes Morais',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    cpf: '567.882.901-23',
    dataNascimento: '2011-04-03',
    genero: 'M',
    telefone: '+55 11 98112-2445',
    contatoEmergencia: {
      nome: 'Cláudia Fagundes Morais',
      parentesco: 'Mãe',
      telefone: '+55 11 98112-2445'
    },
    responsaveis: [
      {
        nome: 'Cláudia Fagundes Morais',
        parentesco: 'Mãe',
        telefone: '+55 11 98112-2445',
        cpf: '290.443.112-98'
      }
    ],
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Fobia social e esquiva de situações coletivas', 'Tempo excessivo de tela'],
    totalDocumentosScaneados: 0,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'teen',
      tokenAcesso: 'enzo-teen',
      pinAcesso: '1234',
      temaVisual: 'matrix',
      atualizadoEm: '2026-10-28T22:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-08-10T14:00:00Z',
    atualizadoEm: '2026-10-28T22:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_12',
    nomeCompleto: 'Manuela Pires Coimbra',
    fotoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    cpf: '678.993.012-34',
    dataNascimento: '2012-09-12',
    genero: 'F',
    telefone: '+55 11 97443-3221',
    contatoEmergencia: {
      nome: 'Patrícia Pires Coimbra',
      parentesco: 'Mãe',
      telefone: '+55 11 97443-3221'
    },
    responsaveis: [
      {
        nome: 'Patrícia Pires Coimbra',
        parentesco: 'Mãe',
        telefone: '+55 11 97443-3221',
        cpf: '311.009.876-54'
      }
    ],
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Oscilações de autoimagem', 'Comparação social em redes'],
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'teen',
      tokenAcesso: 'manuela-teen',
      pinAcesso: '2012',
      temaVisual: 'cyberpunk',
      atualizadoEm: '2026-10-27T18:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-07-28T15:00:00Z',
    atualizadoEm: '2026-10-27T18:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_13',
    nomeCompleto: 'Lucas Nogueira Antunes',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    cpf: '789.004.123-45',
    dataNascimento: '2010-06-25',
    genero: 'M',
    telefone: '+55 11 98554-4332',
    contatoEmergencia: {
      nome: 'Jorge Nogueira Antunes',
      parentesco: 'Pai',
      telefone: '+55 11 98554-4332'
    },
    responsaveis: [
      {
        nome: 'Jorge Nogueira Antunes',
        parentesco: 'Pai',
        telefone: '+55 11 98554-4332',
        cpf: '175.890.332-11'
      }
    ],
    dadosConvenio: {
      tipo: 'convenio',
      nomeConvenio: 'Amil Fácil'
    },
    alertasMedicos: ['Luto recente (falecimento do avô)', 'Irritabilidade reativa'],
    totalDocumentosScaneados: 0,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'teen',
      tokenAcesso: 'lucas-teen',
      pinAcesso: '1234',
      temaVisual: 'dark_minimal',
      atualizadoEm: '2026-10-26T21:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-08-15T11:00:00Z',
    atualizadoEm: '2026-10-26T21:00:00Z',
    criadoPor: 'usr_medico_1'
  },

  // ----------------------------------------
  // GRUPO 3: DIÁRIO ADULTO (ADULTO) - 5 PACIENTES
  // ----------------------------------------
  {
    id: 'pac_1',
    nomeCompleto: 'Helena Vasconcelos Duarte',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    cpf: '128.459.789-02',
    dataNascimento: '1988-04-12',
    genero: 'F',
    telefone: '+55 11 98877-6655',
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
      nome: 'Marcelo Duarte',
      parentesco: 'Cônjuge',
      telefone: '+55 11 97766-5544'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Episódio depressivo moderado em remissão', 'Histórico de pânico em 2023'],
    alergias: ['Penicilina', 'Dipirona'],
    driveFolderId: 'folder_drive_helena_001',
    driveFolderUrl: 'https://drive.google.com/drive/folders/mock_helena_001',
    totalDocumentosScaneados: 3,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'adulto',
      tokenAcesso: 'helena-adulto',
      pinAcesso: '1988',
      temaVisual: 'zen_sage',
      atualizadoEm: '2026-10-31T09:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-05-10T10:00:00Z',
    atualizadoEm: '2026-10-31T09:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_14',
    nomeCompleto: 'Dra. Vanessa Guimarães Costa',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    cpf: '239.012.345-56',
    dataNascimento: '1984-11-20',
    genero: 'F',
    telefone: '+55 11 99887-1122',
    email: 'vanessa.costa@hospital.org.br',
    contatoEmergencia: {
      nome: 'Alexandre Costa',
      parentesco: 'Cônjuge',
      telefone: '+55 11 99887-1122'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Síndrome de Burnout (Z73.0)', 'Insônia inicial e taquicardia por sobrecarga'],
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'adulto',
      tokenAcesso: 'vanessa-adulto',
      pinAcesso: '1984',
      temaVisual: 'zen_sage',
      atualizadoEm: '2026-10-30T22:30:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-06-22T08:00:00Z',
    atualizadoEm: '2026-10-30T22:30:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_15',
    nomeCompleto: 'Rodrigo Meireles Brandão',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    cpf: '350.123.456-67',
    dataNascimento: '1992-03-15',
    genero: 'M',
    telefone: '+55 11 99776-5544',
    email: 'rodrigo.brandao@tech.com',
    contatoEmergencia: {
      nome: 'Camila Brandão',
      parentesco: 'Irmã',
      telefone: '+55 11 99776-5544'
    },
    dadosConvenio: {
      tipo: 'convenio',
      nomeConvenio: 'Omint Saúde'
    },
    alertasMedicos: ['Transtorno de Pânico com Agorafobia (F41.0)', 'Medo de túneis e elevadores'],
    totalDocumentosScaneados: 2,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'adulto',
      tokenAcesso: 'rodrigo-adulto',
      pinAcesso: '1992',
      temaVisual: 'deep_ocean',
      atualizadoEm: '2026-10-29T19:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-07-05T14:30:00Z',
    atualizadoEm: '2026-10-29T19:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_3',
    nomeCompleto: 'Maria de Lourdes Santos',
    fotoUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=300&auto=format&fit=crop&q=80',
    cpf: '019.283.746-88',
    dataNascimento: '1959-11-03',
    genero: 'F',
    telefone: '+55 11 99988-7766',
    email: 'lourdes.santos@email.com',
    contatoEmergencia: {
      nome: 'Cláudia Santos',
      parentesco: 'Filha',
      telefone: '+55 11 98899-0011'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Depressão de início tardio pós-luto', 'Hipertensão arterial controlada'],
    alergias: ['Sulfa'],
    driveFolderId: 'folder_drive_maria_003',
    driveFolderUrl: 'https://drive.google.com/drive/folders/mock_maria_003',
    totalDocumentosScaneados: 4,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'adulto',
      tokenAcesso: 'maria-adulto',
      pinAcesso: '1959',
      temaVisual: 'sunset_calm',
      atualizadoEm: '2026-10-28T16:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-03-20T09:00:00Z',
    atualizadoEm: '2026-10-28T16:00:00Z',
    criadoPor: 'usr_medico_1'
  },
  {
    id: 'pac_4',
    nomeCompleto: 'Lucas Fontes de Albuquerque',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    cpf: '401.554.892-15',
    dataNascimento: '2001-09-18',
    genero: 'M',
    telefone: '+55 11 99112-2334',
    email: 'lucas.fontes@advocacia.com',
    contatoEmergencia: {
      nome: 'Ana Maria Fontes',
      parentesco: 'Mãe',
      telefone: '+55 11 98811-2233'
    },
    dadosConvenio: {
      tipo: 'particular'
    },
    alertasMedicos: ['Transtorno de Ansiedade Generalizada', 'Bruxismo e cefaleia tensional'],
    totalDocumentosScaneados: 1,
    configuracaoDiario: {
      habilitado: true,
      modoInterfaceDefault: 'adulto',
      tokenAcesso: 'lucas-adulto',
      pinAcesso: '2001',
      temaVisual: 'minimal_slate',
      atualizadoEm: '2026-10-31T08:00:00Z'
    },
    status: 'ativo',
    criadoEm: '2026-08-31T08:00:00Z',
    atualizadoEm: '2026-10-31T08:00:00Z',
    criadoPor: 'usr_medico_1'
  }
];

// ==========================================
// HISTÓRICO RICO DE DIÁRIO DE EMOÇÕES
// DISTRIBUÍDO EM AGOSTO, SETEMBRO E OUTUBRO
// ==========================================
export const INITIAL_EMOCOES: RegistroEmocao[] = [
  // ----------------------------------------
  // HELENA (Adulto - Depressão e Ansiedade)
  // ----------------------------------------
  {
    id: 'emo_hel_01',
    pacienteId: 'pac_1',
    dataHora: '2026-08-05T08:30:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Ansiedade', 'Sobrecarga', 'Tristeza'],
    gatilhos: ['Trabalho', 'Sono Insuficiente'],
    qualidadeSono: 'pessimo',
    horasSono: '< 5h',
    tomouMedicacao: true,
    nivelAnsiedade: 7,
    nivelEstresse: 'elevado',
    sintomasFisicos: ['Taquicardia', 'Tensão Muscular'],
    anotacaoLivre: 'Acordei com o coração acelerado antes mesmo do alarme tocar. Medo de não dar conta das demandas no escritório.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_hel_02',
    pacienteId: 'pac_1',
    dataHora: '2026-08-18T20:15:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Calma', 'Cansaço Mental'],
    gatilhos: ['Trabalho', 'Relacionamento Afetivo'],
    qualidadeSono: 'regular',
    horasSono: '5 a 7h',
    tomouMedicacao: true,
    nivelAnsiedade: 5,
    nivelEstresse: 'moderado',
    sintomasFisicos: ['Tensão Muscular'],
    anotacaoLivre: 'Dia cansativo mas consegui aplicar a técnica de respiração diafragmática ensinada na sessão.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_hel_03',
    pacienteId: 'pac_1',
    dataHora: '2026-09-02T19:40:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Esperança', 'Calma', 'Gratidão'],
    gatilhos: ['Exercício Físico', 'Lazer e Descanso'],
    qualidadeSono: 'bom',
    horasSono: '7 a 9h',
    tomouMedicacao: true,
    nivelAnsiedade: 3,
    nivelEstresse: 'baixo',
    sintomasFisicos: ['Sem Sintomas Físicos'],
    anotacaoLivre: 'Ajuste do Escitalopram para 15mg fez muita diferença. Primeira semana sem aperto no peito.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_hel_04',
    pacienteId: 'pac_1',
    dataHora: '2026-09-22T21:10:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Irritação', 'Cansaço Mental'],
    gatilhos: ['Família', 'Cobrança Interna'],
    qualidadeSono: 'regular',
    horasSono: '5 a 7h',
    tomouMedicacao: true,
    nivelAnsiedade: 4,
    nivelEstresse: 'moderado',
    sintomasFisicos: ['Dor de Cabeça'],
    anotacaoLivre: 'Desentendimento familiar no almoço de domingo. Consegui não explodir e me recolhi para me acalmar.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_hel_05',
    pacienteId: 'pac_1',
    dataHora: '2026-10-10T10:00:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Entusiasmo', 'Gratidão', 'Esperança'],
    gatilhos: ['Lazer e Descanso', 'Família'],
    qualidadeSono: 'bom',
    horasSono: '7 a 9h',
    tomouMedicacao: true,
    nivelAnsiedade: 2,
    nivelEstresse: 'baixo',
    sintomasFisicos: ['Sem Sintomas Físicos'],
    anotacaoLivre: 'Fim de semana maravilhoso em família. Sinto que recuperei meu prazer pelas coisas simples.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_hel_06',
    pacienteId: 'pac_1',
    dataHora: '2026-10-29T21:30:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Calma', 'Foco'],
    gatilhos: ['Carreira', 'Saúde Física'],
    qualidadeSono: 'bom',
    horasSono: '7 a 9h',
    tomouMedicacao: true,
    nivelAnsiedade: 2,
    nivelEstresse: 'moderado',
    sintomasFisicos: ['Sem Sintomas Físicos'],
    anotacaoLivre: 'Semana produtiva e com equilíbrio mental. Pronta para a consulta de retorno.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },

  // ----------------------------------------
  // DRA. VANESSA (Adulto - Burnout)
  // ----------------------------------------
  {
    id: 'emo_van_01',
    pacienteId: 'pac_14',
    dataHora: '2026-08-12T22:00:00Z',
    nivelHumor: 1,
    emocoesPrimarias: ['Sobrecarga', 'Sensação de Vazio', 'Tristeza'],
    gatilhos: ['Carreira', 'Cobrança Interna'],
    qualidadeSono: 'pessimo',
    horasSono: '< 5h',
    tomouMedicacao: false,
    nivelAnsiedade: 9,
    nivelEstresse: 'critico',
    sintomasFisicos: ['Fadiga Corporal', 'Taquicardia', 'Aperto Torácico'],
    anotacaoLivre: 'Plantão de 24h devastador. Chorei escondida no vestiário do hospital. Não sinto mais energia pra nada.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_van_02',
    pacienteId: 'pac_14',
    dataHora: '2026-09-05T09:00:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Insegurança', 'Cansaço Mental'],
    gatilhos: ['Carreira', 'Saúde Física'],
    qualidadeSono: 'regular',
    horasSono: '5 a 7h',
    tomouMedicacao: true,
    nivelAnsiedade: 6,
    nivelEstresse: 'elevado',
    sintomasFisicos: ['Tensão Muscular', 'Dor de Cabeça'],
    anotacaoLivre: 'Primeira semana de afastamento recomendada pelo Dr. Roberto. Culpa por não estar trabalhando, mas corpo precisava.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },
  {
    id: 'emo_van_03',
    pacienteId: 'pac_14',
    dataHora: '2026-10-04T18:00:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Calma', 'Alívio', 'Esperança'],
    gatilhos: ['Lazer e Descanso', 'Exercício Físico'],
    qualidadeSono: 'bom',
    horasSono: '7 a 9h',
    tomouMedicacao: true,
    nivelAnsiedade: 3,
    nivelEstresse: 'moderado',
    sintomasFisicos: ['Sem Sintomas Físicos'],
    anotacaoLivre: 'Comecei natação duas vezes por semana. Estou reaprendendo a colocar limites e dizer não a plantões extras.',
    modoUsado: 'adulto',
    temaVisual: 'zen_sage'
  },

  // ----------------------------------------
  // RODRIGO (Adulto - Pânico e Agorafobia)
  // ----------------------------------------
  {
    id: 'emo_rod_01',
    pacienteId: 'pac_15',
    dataHora: '2026-08-20T17:30:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Ansiedade', 'Insegurança'],
    gatilhos: ['Saúde Física', 'Carreira'],
    qualidadeSono: 'regular',
    horasSono: '5 a 7h',
    tomouMedicacao: true,
    nivelAnsiedade: 8,
    nivelEstresse: 'elevado',
    sintomasFisicos: ['Taquicardia', 'Falta de Ar'],
    anotacaoLivre: 'Travei na entrada do metrô. Achei que ia desmaiar e tive que chamar um Uber.',
    modoUsado: 'adulto',
    temaVisual: 'deep_ocean'
  },
  {
    id: 'emo_rod_02',
    pacienteId: 'pac_15',
    dataHora: '2026-09-15T19:00:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Calma', 'Foco'],
    gatilhos: ['Exercício Físico', 'Lazer e Descanso'],
    qualidadeSono: 'bom',
    horasSono: '7 a 9h',
    tomouMedicacao: true,
    nivelAnsiedade: 5,
    nivelEstresse: 'moderado',
    sintomasFisicos: ['Tensão Muscular'],
    anotacaoLivre: 'Consegui andar duas estações de trem com a técnica de ancoragem dos 5 sentidos. Foi uma vitória.',
    modoUsado: 'adulto',
    temaVisual: 'deep_ocean'
  },
  {
    id: 'emo_rod_03',
    pacienteId: 'pac_15',
    dataHora: '2026-10-22T20:30:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Entusiasmo', 'Esperança', 'Gratidão'],
    gatilhos: ['Lazer e Descanso', 'Relacionamento Afetivo'],
    qualidadeSono: 'bom',
    horasSono: '7 a 9h',
    tomouMedicacao: true,
    nivelAnsiedade: 2,
    nivelEstresse: 'baixo',
    sintomasFisicos: ['Sem Sintomas Físicos'],
    anotacaoLivre: 'Fui ao cinema em shopping fechado pela primeira vez em 1 ano e meio! Sem nenhuma crise!',
    modoUsado: 'adulto',
    temaVisual: 'deep_ocean'
  },

  // ----------------------------------------
  // GABRIEL (Teen - TDAH e Desregulação)
  // ----------------------------------------
  {
    id: 'emo_gab_01',
    pacienteId: 'pac_2',
    dataHora: '2026-08-14T17:00:00Z',
    nivelHumor: 1,
    emocoesPrimarias: ['Esgotado'],
    gatilhos: ['Estudos e provas', 'Bateria social zerada'],
    qualidadeSono: 'pessimo',
    tomouMedicacao: false,
    bateriaSocial: 10,
    tempoTela: 'Mais de 6h',
    focoProdutividade: 'Procrastinação',
    anotacaoLivre: 'Esqueci de tomar o remédio pela manhã. Fiquei no TikTok até as 3 da manhã e reprovei no simulado de física.',
    modoUsado: 'teen',
    temaVisual: 'cyberpunk'
  },
  {
    id: 'emo_gab_02',
    pacienteId: 'pac_2',
    dataHora: '2026-09-01T21:40:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Suave', 'Foco excelente hoje'],
    gatilhos: ['Música me salvou', 'Exercício físico'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    bateriaSocial: 75,
    tempoTela: '2 a 4h',
    focoProdutividade: 'Hiperfoco',
    anotacaoLivre: 'Coloquei playlist lofi e estudei 3 horas direto de biologia. O remédio fez total diferença hoje.',
    modoUsado: 'teen',
    temaVisual: 'cyberpunk'
  },
  {
    id: 'emo_gab_03',
    pacienteId: 'pac_2',
    dataHora: '2026-09-28T16:00:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Automático'],
    gatilhos: ['Conversa com amigos', 'Rolando feed por horas'],
    qualidadeSono: 'regular',
    tomouMedicacao: true,
    bateriaSocial: 50,
    tempoTela: '4 a 6h',
    focoProdutividade: 'Foco Estável',
    anotacaoLivre: 'Dia neutro. Nem triste nem super animado. Consegui não me isolar no recreio.',
    modoUsado: 'teen',
    temaVisual: 'cyberpunk'
  },
  {
    id: 'emo_gab_04',
    pacienteId: 'pac_2',
    dataHora: '2026-10-25T19:20:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['No Topo', 'Orgulho'],
    gatilhos: ['Estudos e provas', 'Música me salvou'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    bateriaSocial: 100,
    tempoTela: 'Menos de 2h',
    focoProdutividade: 'Foco Estável',
    anotacaoLivre: 'Tirei 8,5 na prova de química! Minha mãe ficou super orgulhosa e me elogiou bastante.',
    modoUsado: 'teen',
    temaVisual: 'cyberpunk'
  },

  // ----------------------------------------
  // ISABELA (Teen - Pré-vestibular)
  // ----------------------------------------
  {
    id: 'emo_isa_01',
    pacienteId: 'pac_10',
    dataHora: '2026-08-25T23:30:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Desanimado', 'Pensamentos acelerados'],
    gatilhos: ['Estudos e provas', 'Insônia de madrugada'],
    qualidadeSono: 'pessimo',
    tomouMedicacao: true,
    bateriaSocial: 25,
    tempoTela: '2 a 4h',
    focoProdutividade: 'Disperso',
    anotacaoLivre: 'Sensação de que todo mundo estuda mais do que eu. Não consigo desligar a cabeça ao deitar.',
    modoUsado: 'teen',
    temaVisual: 'synthwave'
  },
  {
    id: 'emo_isa_02',
    pacienteId: 'pac_10',
    dataHora: '2026-09-19T20:00:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Suave', 'Alívio'],
    gatilhos: ['Conversa com amigos', 'Música me salvou'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    bateriaSocial: 75,
    tempoTela: '2 a 4h',
    focoProdutividade: 'Foco Estável',
    anotacaoLivre: 'Conversei com meu pai sobre a pressão que eu sentia. Ele foi super compreensivo e tirou um peso das minhas costas.',
    modoUsado: 'teen',
    temaVisual: 'synthwave'
  },
  {
    id: 'emo_isa_03',
    pacienteId: 'pac_10',
    dataHora: '2026-10-27T18:45:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['No Topo', 'Energia alta'],
    gatilhos: ['Estudos e provas', 'Exercício físico'],
    qualidadeSono: 'bom',
    tomouMedicacao: true,
    bateriaSocial: 100,
    tempoTela: 'Menos de 2h',
    focoProdutividade: 'Hiperfoco',
    anotacaoLivre: 'Fiz a redação do simulado em 50 minutos com nota 960! Muito confiante para o ENEM.',
    modoUsado: 'teen',
    temaVisual: 'synthwave'
  },

  // ----------------------------------------
  // SOPHIA (Kids - 8 anos)
  // ----------------------------------------
  {
    id: 'emo_sop_01',
    pacienteId: 'pac_5',
    dataHora: '2026-08-10T16:30:00Z',
    nivelHumor: 1,
    emocoesPrimarias: ['Zangado'],
    gatilhos: ['Lição da escola'],
    qualidadeSono: 'regular',
    atividadesLudicas: ['Lição da escola'],
    mascoteEscolhido: 'leao',
    anotacaoLivre: 'Errei a conta de matemática e rasguei a folha com raiva. O Leo Leão mandou eu respirar fundo.',
    modoUsado: 'kids',
    temaVisual: 'safari'
  },
  {
    id: 'emo_sop_02',
    pacienteId: 'pac_5',
    dataHora: '2026-08-28T18:00:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Contente'],
    gatilhos: ['Desenhei ou pintei', 'Brinquei com amigos'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🎨 Desenhei ou pintei', '⚽ Brinquei com amigos'],
    mascoteEscolhido: 'leao',
    anotacaoLivre: 'Fiz um desenho bem colorido de uma girafa com asas para dar de presente pro Dr. Roberto!',
    modoUsado: 'kids',
    temaVisual: 'safari'
  },
  {
    id: 'emo_sop_03',
    pacienteId: 'pac_5',
    dataHora: '2026-09-14T20:10:00Z',
    nivelHumor: 3,
    emocoesPrimarias: ['Neutro'],
    gatilhos: ['Brinquei com meu pet'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🐾 Brinquei com meu pet'],
    mascoteEscolhido: 'leao',
    anotacaoLivre: 'Fiquei abraçada com meu cachorrinho Bob depois da escola assistindo desenho.',
    modoUsado: 'kids',
    temaVisual: 'safari'
  },
  {
    id: 'emo_sop_04',
    pacienteId: 'pac_5',
    dataHora: '2026-10-08T17:40:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Super Feliz'],
    gatilhos: ['Passeio no parque', 'Brinquei com amigos'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🌳 Passeio no parque', '🎨 Desenhei ou pintei'],
    mascoteEscolhido: 'leao',
    anotacaoLivre: 'Tirei nota 10 na apresentação sobre os animais do safári e ganhei estrelinha da professora!',
    modoUsado: 'kids',
    temaVisual: 'safari'
  },
  {
    id: 'emo_sop_05',
    pacienteId: 'pac_5',
    dataHora: '2026-10-30T19:00:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Super Feliz'],
    gatilhos: ['Brinquei com amigos'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🎮 Joguei no videogame', '🧩 Montei quebra-cabeça'],
    mascoteEscolhido: 'leao',
    anotacaoLivre: 'Montei um castelo de blocos gigante sem desanimar quando ele caiu na primeira vez!',
    modoUsado: 'kids',
    temaVisual: 'safari'
  },

  // ----------------------------------------
  // PEDRO HENRIQUE (Kids - 7 anos - TDAH)
  // ----------------------------------------
  {
    id: 'emo_ped_01',
    pacienteId: 'pac_6',
    dataHora: '2026-08-16T17:20:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Chateado'],
    gatilhos: ['Lição da escola'],
    qualidadeSono: 'regular',
    atividadesLudicas: ['Lição da escola'],
    mascoteEscolhido: 'sapo',
    anotacaoLivre: 'Tomei bronca da tia porque não consegui ficar sentado na cadeira.',
    modoUsado: 'kids',
    temaVisual: 'floresta'
  },
  {
    id: 'emo_ped_02',
    pacienteId: 'pac_6',
    dataHora: '2026-09-20T18:30:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Contente'],
    gatilhos: ['Passeio no parque', 'Brinquei com amigos'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['⚽ Brinquei com amigos', '🌳 Passeio no parque'],
    mascoteEscolhido: 'sapo',
    anotacaoLivre: 'Gastei muita energia jogando futebol no parque com o Pepe Sapo!',
    modoUsado: 'kids',
    temaVisual: 'floresta'
  },
  {
    id: 'emo_ped_03',
    pacienteId: 'pac_6',
    dataHora: '2026-10-24T19:15:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Super Feliz'],
    gatilhos: ['Lição da escola', 'Desenhei ou pintei'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🎨 Desenhei ou pintei', '🧩 Montei quebra-cabeça'],
    mascoteEscolhido: 'sapo',
    anotacaoLivre: 'Consegui terminar toda a lição de casa em 20 minutos com o cronômetro do Pepe!',
    modoUsado: 'kids',
    temaVisual: 'floresta'
  },

  // ----------------------------------------
  // BEATRIZ (Kids - 6 anos - Fobia do Escuro)
  // ----------------------------------------
  {
    id: 'emo_bea_01',
    pacienteId: 'pac_7',
    dataHora: '2026-08-19T07:30:00Z',
    nivelHumor: 2,
    emocoesPrimarias: ['Chateado'],
    gatilhos: ['Pesadelo'],
    qualidadeSono: 'pessimo',
    atividadesLudicas: ['Desenho na TV'],
    mascoteEscolhido: 'estrela',
    anotacaoLivre: 'Acordei chorando no meio da noite com medo de monstro e fui pra cama do papai.',
    modoUsado: 'kids',
    temaVisual: 'galaxia'
  },
  {
    id: 'emo_bea_02',
    pacienteId: 'pac_7',
    dataHora: '2026-09-25T08:00:00Z',
    nivelHumor: 4,
    emocoesPrimarias: ['Contente'],
    gatilhos: ['Sono bom'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🎨 Desenhei ou pintei'],
    mascoteEscolhido: 'estrela',
    anotacaoLivre: 'Deixei o abajur de estrelinha aceso e a Luna Estrela me protegeu a noite toda!',
    modoUsado: 'kids',
    temaVisual: 'galaxia'
  },
  {
    id: 'emo_bea_03',
    pacienteId: 'pac_7',
    dataHora: '2026-10-28T08:30:00Z',
    nivelHumor: 5,
    emocoesPrimarias: ['Super Feliz'],
    gatilhos: ['Dormi a noite toda'],
    qualidadeSono: 'bom',
    atividadesLudicas: ['🧩 Montei quebra-cabeça'],
    mascoteEscolhido: 'estrela',
    anotacaoLivre: 'Dormi na minha própria caminha a noite todinha sem acordar ninguém! Fui muito corajosa!',
    modoUsado: 'kids',
    temaVisual: 'galaxia'
  }
];

// ==========================================
// PRONTUÁRIOS CLÍNICOS E EVOLUÇÕES
// ==========================================
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
      subjetivo: 'Paciente comparece para retorno clínico. Relata estabilidade do humor e redução significativa das crises de ansiedade após aumento de Escitalopram para 15mg. Nega episódios de taquicardia ou agorafobia no último mês.',
      objetivo: 'Exame Psíquico: Lúcida, orientada globalmente, eutímica, afeto congruente, pensamento com curso e conteúdo preservados. Ausência de ideação suicida.',
      avaliacao: 'F32.1 - Episódio depressivo moderado em remissão clínica sustentada.',
      planoTerapeutico: '1. Manter Escitalopram 15mg/dia pela manhã.\n2. Manter psicoterapia semanal.\n3. Retorno em 60 dias.',
      medicacoesPrescritas: [
        {
          nome: 'Oxalato de Escitalopram',
          dosagem: '15mg',
          posologia: '1 comprimido pela manhã após café',
          controlada: true,
          usoContinuo: true
        }
      ],
      alertasRisco: 'Risco zero de autoagressão no momento.'
    },
    audioMetadados: {
      duracaoSegundos: 412,
      resumoGeradoPorIA: true,
      aprovadoPeloMedico: true,
      editadoAposIA: false
    },
    criadoEm: '2026-08-15T16:15:00Z',
    atualizadoEm: '2026-08-15T16:15:00Z'
  },
  {
    id: 'pront_2',
    pacienteId: 'pac_2',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    especialidade: 'Psiquiatria',
    dataAtendimento: '2026-08-20T14:00:00Z',
    tipoRegistro: 'evolucao_ia',
    conteudoClinico: {
      subjetivo: 'Gabriel comparece acompanhado da genitora. Relata melhora no rendimento escolar nas disciplinas de exatas com uso de Metilfenidato. Queixa-se de desatenção em matérias com muita leitura.',
      objetivo: 'Paciente colaborativo, contato visual adequado, irrequietude motora discreta, sem alterações de sensopercepção.',
      avaliacao: 'F90.0 - Transtorno do déficit de atenção com hiperatividade predominante.',
      planoTerapeutico: '1. Cloridrato de Metilfenidato 10mg (1 comprimido às 07h e 1 às 12h).\n2. Orientações de higiene do sono e pausa de telas às 21h.\n3. Acompanhamento com psicopedagoga.',
      medicacoesPrescritas: [
        {
          nome: 'Cloridrato de Metilfenidato',
          dosagem: '10mg',
          posologia: '1 comprimido pela manhã e 1 após almoço',
          controlada: true,
          usoContinuo: true
        }
      ]
    },
    audioMetadados: {
      duracaoSegundos: 530,
      resumoGeradoPorIA: true,
      aprovadoPeloMedico: true,
      editadoAposIA: false
    },
    criadoEm: '2026-08-20T14:45:00Z',
    atualizadoEm: '2026-08-20T14:45:00Z'
  },
  {
    id: 'pront_3',
    pacienteId: 'pac_5',
    profissionalId: 'usr_psico_1',
    profissionalNome: 'Dra. Camila Nogueira',
    profissionalRegistro: 'CRP 06/118.432',
    especialidade: 'Psicologia',
    dataAtendimento: '2026-09-02T15:00:00Z',
    tipoRegistro: 'evolucao_manual',
    conteudoClinico: {
      subjetivo: 'Sessão de ludoterapia com Sophia. Criança desenhou sua família e a escola, expressando angústia em relação à cobrança de tirar notas máximas.',
      objetivo: 'Boa capacidade simbólica, engajamento afetuoso nas brincadeiras com o mascote de pelúcia (leãozinho).',
      avaliacao: 'F93.0 - Transtorno de ansiedade de separação na infância com perfeccionismo reativo.',
      planoTerapeutico: '1. Reestruturação cognitiva adaptada para crianças com o Diário das Emoções NexAi.\n2. Orientação aos pais sobre validação emocional e redução de cobranças de desempenho.',
      medicacoesPrescritas: [],
      alertasRisco: 'Criança acolhida, ambiente familiar protetivo.'
    },
    criadoEm: '2026-09-02T15:50:00Z',
    atualizadoEm: '2026-09-02T15:50:00Z'
  }
];

// ==========================================
// AGENDAMENTOS PASSADOS, DE HOJE E FUTUROS
// ==========================================
export const INITIAL_AGENDAMENTOS: Agendamento[] = [
  // ----------------------------------------
  // HOJE (Kanban: diferentes status)
  // ----------------------------------------
  {
    id: 'agend_hoje_1',
    pacienteId: 'pac_1',
    pacienteNome: 'Helena Vasconcelos Duarte',
    pacienteTelefone: '+55 11 98877-6655',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(new Date().setHours(10, 50, 0, 0)).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'realizado',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pago',
    notasRecepcao: 'Retorno para avaliação semestral de medicação.',
    criadoEm: '2026-10-15T09:00:00Z',
    atualizadoEm: '2026-10-31T10:50:00Z'
  },
  {
    id: 'agend_hoje_2',
    pacienteId: 'pac_2',
    pacienteNome: 'Gabriel Menezes Castro',
    pacienteTelefone: '+55 11 98765-4320',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(new Date().setHours(14, 50, 0, 0)).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'telemedicina',
    status: 'em_atendimento',
    googleMeetLink: 'https://meet.google.com/nexai-gabriel-tdah',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pago',
    notasRecepcao: 'Teleconsulta com a mãe e o jovem para avaliar TDAH.',
    criadoEm: '2026-10-20T11:00:00Z',
    atualizadoEm: '2026-10-31T14:00:00Z'
  },
  {
    id: 'agend_hoje_3',
    pacienteId: 'pac_5',
    pacienteNome: 'Sophia Martins Ribeiro',
    pacienteTelefone: '+55 11 98234-1122',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria Infantil',
    dataHoraInicio: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    dataHoraFim: new Date(new Date().setHours(16, 20, 0, 0)).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'em_espera',
    sincronizadoGoogle: true,
    valorCobrado: 500.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Mãe e filha aguardando na recepção.',
    criadoEm: '2026-10-22T14:00:00Z',
    atualizadoEm: '2026-10-31T15:20:00Z'
  },
  {
    id: 'agend_hoje_4',
    pacienteId: 'pac_14',
    pacienteNome: 'Dra. Vanessa Guimarães Costa',
    pacienteTelefone: '+55 11 99887-1122',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(new Date().setHours(17, 50, 0, 0)).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'confirmado',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Consulta presencial confirmada por WhatsApp.',
    criadoEm: '2026-10-24T16:00:00Z',
    atualizadoEm: '2026-10-31T09:00:00Z'
  },
  {
    id: 'agend_hoje_5',
    pacienteId: 'pac_15',
    pacienteNome: 'Rodrigo Meireles Brandão',
    pacienteTelefone: '+55 11 99776-5544',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    dataHoraFim: new Date(new Date().setHours(18, 50, 0, 0)).toISOString(),
    tipoConsulta: 'retorno',
    modalidade: 'telemedicina',
    status: 'agendado',
    googleMeetLink: 'https://meet.google.com/nexai-rodrigo-panico',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Horário solicitado após expediente comercial.',
    criadoEm: '2026-10-25T18:00:00Z',
    atualizadoEm: '2026-10-25T18:00:00Z'
  },

  // ----------------------------------------
  // AGENDAMENTOS FUTUROS (PRÓXIMAS SEMANAS DE NOVEMBRO 2026)
  // ----------------------------------------
  {
    id: 'agend_fut_1',
    pacienteId: 'pac_6',
    pacienteNome: 'Pedro Henrique Silveira',
    pacienteTelefone: '+55 11 98455-6677',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria Infantil',
    dataHoraInicio: '2026-11-04T14:00:00Z',
    dataHoraFim: '2026-11-04T14:50:00Z',
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'confirmado',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Acompanhamento do ajuste de dosagem.',
    criadoEm: '2026-10-26T10:00:00Z',
    atualizadoEm: '2026-10-26T10:00:00Z'
  },
  {
    id: 'agend_fut_2',
    pacienteId: 'pac_10',
    pacienteNome: 'Isabela Rocha Fontes',
    pacienteTelefone: '+55 11 99344-5566',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria da Adolescência',
    dataHoraInicio: '2026-11-05T16:00:00Z',
    dataHoraFim: '2026-11-05T16:50:00Z',
    tipoConsulta: 'retorno',
    modalidade: 'telemedicina',
    status: 'agendado',
    googleMeetLink: 'https://meet.google.com/nexai-isabela-vestibular',
    sincronizadoGoogle: true,
    valorCobrado: 450.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Avaliação pré-provas de vestibular.',
    criadoEm: '2026-10-27T11:00:00Z',
    atualizadoEm: '2026-10-27T11:00:00Z'
  },
  {
    id: 'agend_fut_3',
    pacienteId: 'pac_3',
    pacienteNome: 'Maria de Lourdes Santos',
    pacienteTelefone: '+55 11 99988-7766',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psicogeriatria',
    dataHoraInicio: '2026-11-06T10:30:00Z',
    dataHoraFim: '2026-11-06T11:20:00Z',
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'confirmado',
    sincronizadoGoogle: true,
    valorCobrado: 400.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Acompanhada da filha Cláudia.',
    criadoEm: '2026-10-28T09:00:00Z',
    atualizadoEm: '2026-10-28T09:00:00Z'
  },
  {
    id: 'agend_fut_4',
    pacienteId: 'pac_4',
    pacienteNome: 'Lucas Fontes de Albuquerque',
    pacienteTelefone: '+55 11 99112-2334',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria',
    dataHoraInicio: '2026-11-10T15:00:00Z',
    dataHoraFim: '2026-11-10T15:50:00Z',
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'agendado',
    sincronizadoGoogle: true,
    valorCobrado: 400.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Checagem de ansiedade no ambiente de trabalho.',
    criadoEm: '2026-10-29T14:00:00Z',
    atualizadoEm: '2026-10-29T14:00:00Z'
  },
  {
    id: 'agend_fut_5',
    pacienteId: 'pac_8',
    pacienteNome: 'Theo Albuquerque Santos',
    pacienteTelefone: '+55 11 98334-4556',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    especialidade: 'Psiquiatria Infantil',
    dataHoraInicio: '2026-11-12T11:00:00Z',
    dataHoraFim: '2026-11-12T11:50:00Z',
    tipoConsulta: 'retorno',
    modalidade: 'presencial',
    status: 'agendado',
    sincronizadoGoogle: true,
    valorCobrado: 500.00,
    pagamentoStatus: 'pendente',
    notasRecepcao: 'Avaliação neuropediátrica e psicológica conjunta.',
    criadoEm: '2026-10-30T10:00:00Z',
    atualizadoEm: '2026-10-30T10:00:00Z'
  }
];

// ==========================================
// TRANSAÇÕES FINANCEIRAS
// ==========================================
export const INITIAL_TRANSACOES: TransacaoFinanceira[] = [
  {
    id: 'trans_1',
    agendamentoId: 'agend_hoje_1',
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
    dataVencimento: '2026-10-31',
    dataPagamento: '2026-10-31T10:45:00Z',
    reciboEmitido: true,
    numeroRecibo: 'REC-2026-1092',
    emitirParaCpf: '128.459.789-02',
    discriminacaoServico: 'Consulta médica psiquiátrica individualizada.',
    criadoEm: '2026-10-31T10:45:00Z',
    atualizadoEm: '2026-10-31T10:45:00Z'
  },
  {
    id: 'trans_2',
    agendamentoId: 'agend_hoje_2',
    pacienteId: 'pac_2',
    pacienteNome: 'Gabriel Menezes Castro',
    pacienteCpf: '349.882.109-44',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    valor: 450.00,
    tipo: 'receita',
    categoria: 'consulta_particular',
    metodoPagamento: 'cartao_credito',
    status: 'pago',
    dataVencimento: '2026-10-31',
    dataPagamento: '2026-10-31T13:50:00Z',
    reciboEmitido: true,
    numeroRecibo: 'REC-2026-1093',
    emitirParaCpf: '219.832.441-05',
    discriminacaoServico: 'Teleconsulta médica em psiquiatria da infância e adolescência.',
    criadoEm: '2026-10-31T13:50:00Z',
    atualizadoEm: '2026-10-31T13:50:00Z'
  },
  {
    id: 'trans_3',
    agendamentoId: 'agend_hoje_3',
    pacienteId: 'pac_5',
    pacienteNome: 'Sophia Martins Ribeiro',
    pacienteCpf: '512.304.992-80',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    valor: 500.00,
    tipo: 'receita',
    categoria: 'consulta_particular',
    metodoPagamento: 'pix',
    status: 'pendente',
    dataVencimento: '2026-10-31',
    reciboEmitido: false,
    emitirParaCpf: '231.849.001-44',
    discriminacaoServico: 'Consulta médica psiquiátrica infantil especializada.',
    criadoEm: '2026-10-31T15:00:00Z',
    atualizadoEm: '2026-10-31T15:00:00Z'
  },
  {
    id: 'trans_4',
    agendamentoId: 'agend_fut_1',
    pacienteId: 'pac_6',
    pacienteNome: 'Pedro Henrique Silveira',
    pacienteCpf: '614.902.118-05',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    valor: 450.00,
    tipo: 'receita',
    categoria: 'consulta_particular',
    metodoPagamento: 'pix',
    status: 'pendente',
    dataVencimento: '2026-11-04',
    reciboEmitido: false,
    emitirParaCpf: '312.981.445-12',
    discriminacaoServico: 'Consulta médica de retorno em psiquiatria infantil.',
    criadoEm: '2026-10-26T10:00:00Z',
    atualizadoEm: '2026-10-26T10:00:00Z'
  },
  {
    id: 'trans_5',
    agendamentoId: 'agend_fut_2',
    pacienteId: 'pac_10',
    pacienteNome: 'Isabela Rocha Fontes',
    pacienteCpf: '456.771.890-12',
    profissionalId: 'usr_medico_1',
    profissionalNome: 'Dr. Roberto Silveira',
    profissionalRegistro: 'CRM/SP 142.890',
    valor: 450.00,
    tipo: 'receita',
    categoria: 'consulta_particular',
    metodoPagamento: 'cartao_credito',
    status: 'pendente',
    dataVencimento: '2026-11-05',
    reciboEmitido: false,
    emitirParaCpf: '182.903.441-22',
    discriminacaoServico: 'Teleconsulta médica psiquiátrica para jovem.',
    criadoEm: '2026-10-27T11:00:00Z',
    atualizadoEm: '2026-10-27T11:00:00Z'
  }
];
