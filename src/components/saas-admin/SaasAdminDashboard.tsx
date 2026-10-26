import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Heart,
  Camera,
  Activity,
  Check,
  X,
  ArrowLeft,
  DollarSign,
  Layers,
  Save,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useSaasPlan, MODULE_PRICES } from '../../context/SaasPlanContext';
import { APP_VERSION } from '../../version';

interface SaasAdminDashboardProps {
  onBackToClinic: () => void;
}

export const SaasAdminDashboard: React.FC<SaasAdminDashboardProps> = ({ onBackToClinic }) => {
  const {
    config,
    modules,
    toggleModule,
    calculateTotalMonthly,
    logoutSaasAdmin,
    updateClinicInfo,
  } = useSaasPlan();

  const [nomeClinica, setNomeClinica] = useState(config.nomeClinica);
  const [cnpj, setCnpj] = useState(config.cnpj);
  const [feedbackSalvo, setFeedbackSalvo] = useState(false);

  const handleSalvar = () => {
    updateClinicInfo(nomeClinica, cnpj);
    setFeedbackSalvo(true);
    setTimeout(() => setFeedbackSalvo(false), 2500);
  };

  const totalMensal = calculateTotalMonthly();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Topo do Painel Master */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Painel SaaS Master
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-1.5 py-0.5 rounded border border-amber-500/30">
                v{APP_VERSION}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Gestão de Assinaturas e Módulos Opcionais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBackToClinic}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs"
          >
            Abrir Sistema Clínico
          </Button>

          <button
            onClick={() => {
              logoutSaasAdmin();
              onBackToClinic();
            }}
            className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Encerrar Sessão Master"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Banner Informativo */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Configuração Comercial do Cliente
              </h2>
              <Badge variant="warning">Ambiente de Testes</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Os módulos opcionais contratados pela clínica são ativados aqui. O cliente só acessa as funcionalidades adquiridas no plano.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Faturamento Mensal
              </span>
              <span className="text-xl font-bold text-amber-400 font-mono">
                R$ {totalMensal.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Identificação do Cliente / Clínica */}
        <Card className="bg-slate-900 border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Dados da Clínica Contratante
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nome da Clínica
              </label>
              <input
                type="text"
                value={nomeClinica}
                onChange={(e) => setNomeClinica(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                CNPJ Cadastrado
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSalvar}
              className="border-slate-700 hover:bg-slate-800 text-slate-200"
            >
              {feedbackSalvo ? 'Salvo com Sucesso!' : 'Salvar Dados'}
            </Button>
          </div>
        </Card>

        {/* Gestão dos 3 Módulos Opcionais */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Módulos Opcionais Adquiridos
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Clique nos seletores para ativar ou desativar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. DIÁRIO DE HUMOR (ATIVO POR PADRÃO) */}
            <Card
              className={`p-5 rounded-3xl border transition-all duration-200 ${
                modules.diarioHumor
                  ? 'bg-slate-900 border-teal-500/50 shadow-lg shadow-teal-500/5'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => toggleModule('diarioHumor')}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    modules.diarioHumor ? 'bg-teal-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      modules.diarioHumor ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">
                    Diário de Humor
                  </h4>
                  <span className="text-xs font-mono font-semibold text-teal-400">
                    + R$ {MODULE_PRICES.diarioHumor.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Aplicativo PWA para registro diário de emoções e humor pelo próprio paciente no smartphone.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status no Cliente:</span>
                {modules.diarioHumor ? (
                  <span className="text-teal-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ativado
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Bloqueado
                  </span>
                )}
              </div>
            </Card>

            {/* 2. SCANNER DE FICHAS (DESATIVADO POR PADRÃO) */}
            <Card
              className={`p-5 rounded-3xl border transition-all duration-200 ${
                modules.scannerFichas
                  ? 'bg-slate-900 border-brand-500/50 shadow-lg shadow-brand-500/5'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => toggleModule('scannerFichas')}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    modules.scannerFichas ? 'bg-brand-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      modules.scannerFichas ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">
                    Scanner de Fichas
                  </h4>
                  <span className="text-xs font-mono font-semibold text-brand-400">
                    + R$ {MODULE_PRICES.scannerFichas.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Câmera contínua para digitalizar prontuários físicos em PDF com upload automático no Google Drive.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status no Cliente:</span>
                {modules.scannerFichas ? (
                  <span className="text-brand-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ativado
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Bloqueado
                  </span>
                )}
              </div>
            </Card>

            {/* 3. CONSULTA IA (DESATIVADO POR PADRÃO) */}
            <Card
              className={`p-5 rounded-3xl border transition-all duration-200 ${
                modules.consultaIa
                  ? 'bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/5'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => toggleModule('consultaIa')}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    modules.consultaIa ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      modules.consultaIa ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">
                    Consulta IA
                  </h4>
                  <span className="text-xs font-mono font-semibold text-purple-400">
                    + R$ {MODULE_PRICES.consultaIa.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  Processamento de voz e evolução automática no formato SOAP médico utilizando Google Gemini.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status no Cliente:</span>
                {modules.consultaIa ? (
                  <span className="text-purple-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ativado
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Bloqueado
                  </span>
                )}
              </div>
            </Card>

          </div>
        </div>

        {/* Ação Direta para Testar no Cliente */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Testar no Ambiente da Clínica
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Ao alternar as chaves acima, a interface do cliente reflete as permissões instantaneamente.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBackToClinic}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none"
          >
            Voltar para Clínica
          </Button>
        </div>

      </main>
    </div>
  );
};
