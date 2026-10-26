import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Sparkles, RefreshCw, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { processarAudioComGemini, GeminiSOAPResponse } from '../../services/geminiService';
import { useToast } from '../../context/ToastContext';

interface AudioConsultationRecorderProps {
  pacienteNome?: string;
  especialidade?: string;
  onSOAPGenerated: (soap: GeminiSOAPResponse, audioBlob: Blob | null, duracaoSegundos: number) => void;
}

export const AudioConsultationRecorder: React.FC<AudioConsultationRecorderProps> = ({
  pacienteNome = 'Paciente',
  especialidade = 'Psiquiatria',
  onSOAPGenerated,
}) => {
  const { showToast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Iniciar Gravação de Áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200); // Coleta dados a cada 200ms
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      showToast('Gravação iniciada', 'Fale naturalmente ou dite o resumo da consulta.', 'info');
    } catch (err) {
      console.error('Erro no microfone:', err);
      showToast('Microfone indisponível', 'Permita o acesso ao microfone no navegador.', 'warning');
    }
  };

  // Pausar / Continuar
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerIntervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      clearInterval(timerIntervalRef.current);
      setIsPaused(true);
    }
  };

  // Parar Gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerIntervalRef.current);
      setIsRecording(false);
      setIsPaused(false);
      showToast('Áudio gravado com sucesso!', 'Clique em "Gerar Prontuário com IA" para estruturar.', 'success');
    }
  };

  // Resetar
  const resetAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setSeconds(0);
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(timerIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Formatar Segundos em mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Disparar IA Google Gemini
  const handleProcessWithGemini = async () => {
    setIsProcessingAI(true);
    try {
      // Se tiver áudio real gravado, usa ele; senão cria blob simulado
      const blobToProcess = audioBlob || new Blob(['mock audio'], { type: 'audio/webm' });
      const soapResult = await processarAudioComGemini(blobToProcess, pacienteNome, especialidade);
      
      onSOAPGenerated(soapResult, audioBlob, seconds || 120);
      showToast('Evolução SOAP gerada com IA!', 'Revise os dados abaixo e clique em Validar.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao processar com Gemini', 'Tente novamente ou insira os dados manualmente.', 'error');
    } finally {
      setIsProcessingAI(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-brand-50/30 dark:from-slate-900 dark:to-brand-950/20 border-brand-200 dark:border-brand-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Gravação de Voz & Inteligência Artificial (Google Gemini Flash)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Gera automaticamente o formato clínico SOAP a partir da conversa ou do ditado médico.
            </p>
          </div>
        </div>
        <Badge variant="brand" dot>Gemini 1.5 / 2.0 Flash</Badge>
      </div>

      {/* Caixa Central do Gravador */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center space-y-4 shadow-sm">
        
        {/* Visualizador de Ondas / Timer */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white tracking-wider">
            {formatTime(seconds)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isRecording
              ? isPaused
                ? 'Gravação Pausada'
                : 'Gravando consulta... fale claramente'
              : audioBlob
              ? 'Áudio pronto para estruturação'
              : 'Clique no microfone para iniciar a gravação'}
          </span>
        </div>

        {/* Animação de Onda Sonora */}
        {isRecording && !isPaused && (
          <div className="flex items-center gap-1.5 h-10 py-2">
            {[40, 75, 90, 50, 85, 100, 60, 95, 45, 80, 65, 30].map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-brand-500 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDuration: `${0.6 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Player se já gravou */}
        {audioUrl && !isRecording && (
          <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 p-3 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-slate-800">
            <Volume2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <audio src={audioUrl} controls className="w-full h-8" />
          </div>
        )}

        {/* Controles do Gravador */}
        <div className="flex items-center gap-3 pt-2">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-teal-400 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="Iniciar Gravação"
            >
              <Mic className="w-7 h-7 animate-pulse" />
            </button>
          )}

          {isRecording && (
            <>
              <button
                onClick={togglePause}
                className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                title={isPaused ? 'Continuar' : 'Pausar'}
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>

              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-500/30 flex items-center justify-center hover:bg-rose-700 active:scale-95 transition-all"
                title="Concluir Gravação"
              >
                <Square className="w-6 h-6 fill-current" />
              </button>
            </>
          )}

          {audioBlob && !isRecording && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={resetAudio}
              >
                Gravar Novamente
              </Button>

              <Button
                variant="primary"
                size="md"
                leftIcon={<Sparkles className="w-5 h-5" />}
                onClick={handleProcessWithGemini}
                isLoading={isProcessingAI}
                className="shadow-md shadow-brand-500/20"
              >
                Gerar Prontuário com IA (Gemini SOAP)
              </Button>
            </div>
          )}

          {/* Atalho de Demonstração Rápida caso o médico queira simular sem microfone */}
          {!isRecording && !audioBlob && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-brand-600" />}
              onClick={handleProcessWithGemini}
              isLoading={isProcessingAI}
              className="text-xs text-slate-600"
            >
              Simular Processamento com IA
            </Button>
          )}
        </div>

      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
        <span>
          <strong>Privacidade e Sigilo Médico:</strong> O áudio é processado de forma criptografada e você pode editar qualquer ponto do relatório antes de salvar.
        </span>
      </div>
    </Card>
  );
};
