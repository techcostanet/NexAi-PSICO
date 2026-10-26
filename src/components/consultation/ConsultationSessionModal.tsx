import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { AudioConsultationRecorder } from './AudioConsultationRecorder';
import { SoapEvolutionEditor } from './SoapEvolutionEditor';
import { ConteudoClinicoSOAP } from '../../types';
import { GeminiSOAPResponse } from '../../services/geminiService';
import { Card } from '../ui/Card';
import { Sparkles, CheckCircle2, User } from 'lucide-react';

interface ConsultationSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPacienteId?: string;
  onFinishedSession?: (pacienteId: string) => void;
}

export const ConsultationSessionModal: React.FC<ConsultationSessionModalProps> = ({
  isOpen,
  onClose,
  initialPacienteId,
  onFinishedSession,
}) => {
  const { pacientes, adicionarProntuario } = useDatabase();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedPacienteId, setSelectedPacienteId] = useState<string>(
    initialPacienteId || (pacientes.length > 0 ? pacientes[0].id : '')
  );

  const [soapData, setSoapData] = useState<ConteudoClinicoSOAP | null>(null);
  const [transcricao, setTranscricao] = useState<string | undefined>(undefined);
  const [audioDuracao, setAudioDuracao] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPaciente = pacientes.find((p) => p.id === selectedPacienteId);

  const handleSOAPGenerated = (
    result: GeminiSOAPResponse,
    audioBlob: Blob | null,
    duracaoSegundos: number
  ) => {
    setSoapData({
      subjetivo: result.subjetivo,
      objetivo: result.objetivo,
      avaliacao: result.avaliacao,
      planoTerapeutico: result.planoTerapeutico,
      medicacoesPrescritas: result.medicacoesPrescritas || [],
      alertasRisco: result.alertasRisco,
    });
    setTranscricao(result.transcricaoDetectada);
    setAudioDuracao(duracaoSegundos);
  };

  const handleSalvarEvolucao = async (finalSoap: ConteudoClinicoSOAP) => {
    if (!selectedPaciente) return;

    setIsSaving(true);
    try {
      adicionarProntuario({
        pacienteId: selectedPaciente.id,
        profissionalId: currentUser.id,
        profissionalNome: currentUser.nome,
        profissionalRegistro: currentUser.registroProfissional || 'CRM/CRP',
        especialidade: (currentUser.especialidade as any) || 'Psiquiatria',
        dataAtendimento: new Date().toISOString(),
        tipoRegistro: 'evolucao_ia',
        conteudoClinico: finalSoap,
        audioMetadados: {
          duracaoSegundos: audioDuracao,
          transcricaoBruta: transcricao,
          resumoGeradoPorIA: true,
          aprovadoPeloMedico: true,
          editadoAposIA: true,
        },
      });

      showToast('Evolução Clínica Salva no Prontuário!', 'Assinada digitalmente e vinculada à ficha do paciente.', 'success');

      // Reset
      setSoapData(null);
      setTranscricao(undefined);
      onClose();

      if (onFinishedSession) {
        onFinishedSession(selectedPaciente.id);
      }
    } catch (e) {
      console.error(e);
      showToast('Erro ao salvar evolução', 'Tente novamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Atendimento Clínico com Áudio IA (Gemini Flash)"
      subtitle="Geração instantânea da evolução médica no padrão SOAP"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        
        {/* Seletor do Paciente */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Paciente em Consulta:
            </span>
          </div>

          <select
            value={selectedPacienteId}
            onChange={(e) => {
              setSelectedPacienteId(e.target.value);
              setSoapData(null); // Reseta estado ao trocar paciente
            }}
            className="px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-semibold"
          >
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nomeCompleto} ({p.cpf})
              </option>
            ))}
          </select>
        </div>

        {/* 1. Gravador & IA */}
        <AudioConsultationRecorder
          pacienteNome={selectedPaciente?.nomeCompleto}
          especialidade={currentUser.especialidade || 'Psiquiatria'}
          onSOAPGenerated={handleSOAPGenerated}
        />

        {/* 2. Editor Estruturado SOAP (Aparece após processar) */}
        {soapData && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <SoapEvolutionEditor
              initialSoap={soapData}
              transcricao={transcricao}
              onSave={handleSalvarEvolucao}
              isSaving={isSaving}
            />
          </div>
        )}

      </div>
    </Modal>
  );
};
