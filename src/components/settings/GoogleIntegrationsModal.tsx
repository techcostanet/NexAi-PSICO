import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { useDatabase } from '../../context/DatabaseContext';
import { testarConexaoGemini, getGeminiApiKey } from '../../services/geminiService';
import {
  Sparkles,
  FolderSync,
  Calendar,
  Key,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  ExternalLink,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface GoogleIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleIntegrationsModal: React.FC<GoogleIntegrationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const { pacientes, prontuarios, agendamentos, transacoes, restaurarDadosIniciais } = useDatabase();

  // Estados das chaves
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [driveFolderId, setDriveFolderId] = useState<string>('');
  const [calendarEmail, setCalendarEmail] = useState<string>('');
  
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ sucesso: boolean; mensagem: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem('nexai_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
      setDriveFolderId(localStorage.getItem('nexai_drive_root_folder_id') || import.meta.env.VITE_GOOGLE_DRIVE_ROOT_FOLDER_ID || '');
      setCalendarEmail(localStorage.getItem('nexai_calendar_email') || 'dr.roberto.nexai@gmail.com');
      setGeminiTestResult(null);
    }
  }, [isOpen]);

  const handleSalvarConfiguracoes = () => {
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

    showToast('Configurações Salvas!', 'As integrações do Google foram atualizadas.', 'success');
    onClose();
  };

  const handleTestarGemini = async () => {
    setIsTestingGemini(true);
    setGeminiTestResult(null);
    const res = await testarConexaoGemini(geminiKey);
    setGeminiTestResult(res);
    setIsTestingGemini(false);
  };

  // Exportar Backup JSON
  const handleExportarBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      versao: '1.0.0',
      pacientes,
      prontuarios,
      agendamentos,
      transacoes,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_NexAi_PSICO_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Backup Exportado com Sucesso!', 'Arquivo JSON salvo no seu dispositivo.', 'success');
  };

  const handleRestaurar = () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados de exemplo padrão?')) {
      restaurarDadosIniciais();
      showToast('Dados Restaurados!', 'Dados de exemplo carregados novamente.', 'info');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Integrações Google & Configurações"
      subtitle="Configure suas chaves da nuvem Google diretamente pela interface"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* 1. GOOGLE GEMINI AI */}
        <Card className="p-4 space-y-3 bg-brand-50/20 dark:bg-brand-950/10 border-brand-200 dark:border-brand-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Google Gemini Flash (Inteligência Artificial de Áudio)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Usado para processar a voz da consulta e gerar automaticamente a evolução clínica SOAP.
                </p>
              </div>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Criar Chave Grátis <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Chave de API do Gemini (API Key):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="Ex: AIzaSyD..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestarGemini}
                isLoading={isTestingGemini}
                disabled={!geminiKey}
              >
                Testar Chave
              </Button>
            </div>
          </div>

          {/* Resultado do Teste */}
          {geminiTestResult && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                geminiTestResult.sucesso
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
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
        </Card>

        {/* 2. GOOGLE DRIVE */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <FolderSync className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Google Drive (Armazenamento dos Prontuários Escaneados)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Crie uma pasta no seu Google Drive (ex: "Prontuários NexAi") e cole o ID aqui.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ID da Pasta Raiz no Google Drive:
            </label>
            <input
              type="text"
              placeholder="Ex: 1A2b3C4d5E6F7g8H9..."
              value={driveFolderId}
              onChange={(e) => setDriveFolderId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              💡 O ID da pasta é a parte final do link da pasta no navegador (ex: drive.google.com/drive/folders/<strong>ID_DA_PASTA</strong>).
            </p>
          </div>
        </Card>

        {/* 3. GOOGLE CALENDAR */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Google Agenda (Sincronização de Consultas)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                E-mail da conta Google onde os agendamentos são criados automaticamente.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              E-mail do Google Calendar:
            </label>
            <input
              type="email"
              placeholder="dr.roberto.nexai@gmail.com"
              value={calendarEmail}
              onChange={(e) => setCalendarEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>
        </Card>

        {/* 4. BACKUP & SEGURANÇA */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportarBackup}
            >
              Exportar Backup (JSON)
            </Button>

            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-500" />}
              onClick={handleRestaurar}
              className="text-rose-600 hover:bg-rose-50"
            >
              Restaurar Padrão
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" onClick={handleSalvarConfiguracoes}>
              Salvar Configurações
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
