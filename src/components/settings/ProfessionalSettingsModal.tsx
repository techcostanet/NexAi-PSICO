import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { useAuth, ProfessionalProfile } from '../../context/AuthContext';
import { useTheme, ThemeColorId } from '../../context/ThemeContext';
import { testarConexaoGemini } from '../../services/geminiService';
import {
  User,
  Palette,
  Sparkles,
  FolderSync,
  Calendar,
  Key,
  CheckCircle2,
  AlertCircle,
  Check,
  Shield,
} from 'lucide-react';

interface ProfessionalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'perfil' | 'cores' | 'google';
}

export const ProfessionalSettingsModal: React.FC<ProfessionalSettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'perfil',
}) => {
  const { showToast } = useToast();
  const { professionalProfile, updateProfessionalProfile } = useAuth();
  const { activeThemeId, setThemeId, options: themeOptions } = useTheme();

  const [activeTab, setActiveTab] = useState<'perfil' | 'cores' | 'google'>(defaultTab);

  // Formulário de Dados Cadastrais
  const [formData, setFormData] = useState<ProfessionalProfile>(professionalProfile);

  // Estados do Google
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [driveFolderId, setDriveFolderId] = useState<string>('');
  const [calendarEmail, setCalendarEmail] = useState<string>('');
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ sucesso: boolean; mensagem: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(professionalProfile);
      setGeminiKey(localStorage.getItem('nexai_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
      setDriveFolderId(localStorage.getItem('nexai_drive_root_folder_id') || import.meta.env.VITE_GOOGLE_DRIVE_ROOT_FOLDER_ID || '');
      setCalendarEmail(localStorage.getItem('nexai_calendar_email') || 'consultorio.nexai@gmail.com');
      setGeminiTestResult(null);
      if (defaultTab) setActiveTab(defaultTab);
    }
  }, [isOpen, professionalProfile, defaultTab]);

  const handleSalvarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfessionalProfile(formData);
    showToast('Dados Salvos!', 'Os dados cadastrais do consultório foram atualizados.', 'success');
  };

  const handleSalvarGoogle = () => {
    if (geminiKey) {
      localStorage.setItem('nexai_gemini_api_key', geminiKey.trim());
    } else {
      localStorage.removeItem('nexai_gemini_api_key');
    }

    if (driveFolderId) {
      localStorage.setItem('nexai_drive_root_folder_id', driveFolderId.trim());
    }

    if (calendarEmail) {
      localStorage.setItem('nexai_calendar_email', calendarEmail.trim());
    }

    showToast('Configurações Salvas!', 'As integrações Google foram atualizadas.', 'success');
  };

  const handleTestarGemini = async () => {
    setIsTestingGemini(true);
    setGeminiTestResult(null);
    const res = await testarConexaoGemini(geminiKey);
    setGeminiTestResult(res);
    setIsTestingGemini(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações do Consultório"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* Barra de Abas (Termos únicos) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'perfil'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cores')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cores'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Cores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'google'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Google</span>
          </button>
        </div>

        {/* ABA 1: DADOS CADASTRAIS DO PROFISSIONAL */}
        {activeTab === 'perfil' && (
          <form onSubmit={handleSalvarPerfil} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nome do Profissional
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Dr. Roberto Silveira"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Especialidade
                </label>
                <input
                  type="text"
                  required
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  placeholder="Ex: Médico Psiquiatra ou Psicólogo Clínico"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Registro Profissional
                </label>
                <input
                  type="text"
                  required
                  value={formData.registroProfissional}
                  onChange={(e) => setFormData({ ...formData, registroProfissional: e.target.value })}
                  placeholder="Ex: CRM/SP 142.890 ou CRP 06/118.432"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nome do Consultório
              </label>
              <input
                type="text"
                value={formData.nomeConsultorio}
                onChange={(e) => setFormData({ ...formData, nomeConsultorio: e.target.value })}
                placeholder="Ex: Consultório de Psiquiatria Integrada"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="roberto.silveira@nexai.com"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Telefone (WhatsApp)
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="+55 11 98765-4321"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Salvar
              </Button>
            </div>
          </form>
        )}

        {/* ABA 2: PERSONALIZAÇÃO DE CORES */}
        {activeTab === 'cores' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Tema Visual do Sistema
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Selecione a paleta de cores para o seu consultório. A mudança é aplicada imediatamente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themeOptions.map((theme) => {
                const isSelected = activeThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl shadow-inner flex items-center justify-center text-white"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {theme.label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {theme.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>A cor selecionada é salva automaticamente no seu dispositivo.</span>
            </div>
          </div>
        )}

        {/* ABA 3: INTEGRAÇÕES GOOGLE */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            
            {/* 1. Google Gemini Flash AI */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-500/10 text-brand-600 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Google Gemini AI
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Estruturação SOAP e Transcrição Clínica
                    </p>
                  </div>
                </div>
                <Badge variant={geminiKey ? 'success' : 'neutral'}>
                  {geminiKey ? 'Ativo' : 'Pendente'}
                </Badge>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Chave API Gemini
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestarGemini}
                    disabled={isTestingGemini || !geminiKey}
                  >
                    {isTestingGemini ? 'Testando...' : 'Testar'}
                  </Button>
                </div>
              </div>

              {geminiTestResult && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    geminiTestResult.sucesso
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {geminiTestResult.sucesso ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{geminiTestResult.mensagem}</span>
                </div>
              )}
            </div>

            {/* 2. Google Drive */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                    <FolderSync className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Google Drive
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Armazenamento de Fichas e PDFs
                    </p>
                  </div>
                </div>
                <Badge variant={driveFolderId ? 'success' : 'neutral'}>
                  {driveFolderId ? 'Conectado' : 'Automático'}
                </Badge>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  ID da Pasta Raiz no Drive
                </label>
                <input
                  type="text"
                  value={driveFolderId}
                  onChange={(e) => setDriveFolderId(e.target.value)}
                  placeholder="Ex: 1A2b3C4d5E..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* 3. Google Calendar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Google Calendar
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Sincronização de Consultas na Agenda
                    </p>
                  </div>
                </div>
                <Badge variant="info">Online</Badge>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Email da Agenda Google
                </label>
                <input
                  type="email"
                  value={calendarEmail}
                  onChange={(e) => setCalendarEmail(e.target.value)}
                  placeholder="consultorio@gmail.com"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSalvarGoogle}
              >
                Salvar
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
