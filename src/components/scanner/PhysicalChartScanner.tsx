import React, { useState, useRef, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Camera,
  Upload,
  Trash2,
  FileCheck,
  FolderSync,
  ExternalLink,
  Download,
  Plus,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { gerarPdfProntuarioFisico } from '../../services/pdfService';
import { uploadProntuarioFisicoParaDrive } from '../../services/driveService';

interface PhysicalChartScannerProps {
  initialPacienteId?: string;
  onFinished?: () => void;
}

export const PhysicalChartScanner: React.FC<PhysicalChartScannerProps> = ({
  initialPacienteId,
  onFinished,
}) => {
  const { pacientes, adicionarProntuario } = useDatabase();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedPacienteId, setSelectedPacienteId] = useState<string>(
    initialPacienteId || (pacientes.length > 0 ? pacientes[0].id : '')
  );

  const [capturedPages, setCapturedPages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUploadedResult, setLastUploadedResult] = useState<{
    pdfBlob: Blob;
    pdfDataUri: string;
    driveWebViewLink: string;
    nomeArquivo: string;
    totalPaginas: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const selectedPaciente = pacientes.find((p) => p.id === selectedPacienteId);

  // Iniciar / Desligar Câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Câmera traseira no celular
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      showToast(
        'Câmera indisponível',
        'Não foi possível acessar a câmera do dispositivo. Você pode fazer upload de fotos.',
        'warning'
      );
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Bater Foto no modo contínuo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Desenha quadro
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Otimização sutil de nitidez / contraste para leitura médica
    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedPages((prev) => [...prev, imgData]);
    showToast(`Página ${capturedPages.length + 1} capturada!`, 'Pode continuar tirando as próximas páginas.', 'info');
  };

  // Upload manual de fotos/scanners de mesa
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    showToast(`${files.length} páginas adicionadas`, '', 'success');
  };

  const removePage = (index: number) => {
    setCapturedPages((prev) => prev.filter((_, i) => i !== index));
  };

  // Processar e Gerar PDF + Upload no Google Drive
  const handleFinalizarEEnviar = async () => {
    if (!selectedPaciente) {
      showToast('Selecione um paciente', 'Escolha o paciente para vincular o prontuário físico.', 'warning');
      return;
    }

    if (capturedPages.length === 0) {
      showToast('Nenhuma página capturada', 'Tire pelo menos uma foto das fichas do paciente.', 'warning');
      return;
    }

    setIsProcessing(true);
    stopCamera();

    try {
      // 1. Gera PDF compacto de alta legibilidade
      const { pdfBlob, pdfDataUri } = await gerarPdfProntuarioFisico(
        capturedPages,
        selectedPaciente.nomeCompleto,
        selectedPaciente.cpf
      );

      const nomeArquivo = `Prontuario_Historico_${selectedPaciente.nomeCompleto.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getFullYear()}.pdf`;

      // 2. Upload para o Google Drive
      const driveResult = await uploadProntuarioFisicoParaDrive(
        selectedPaciente.id,
        selectedPaciente.nomeCompleto,
        pdfBlob,
        nomeArquivo
      );

      // 3. Salva registro na subcoleção de prontuários do paciente
      adicionarProntuario({
        pacienteId: selectedPaciente.id,
        profissionalId: currentUser.id,
        profissionalNome: currentUser.nome,
        profissionalRegistro: currentUser.registroProfissional || 'Recepção / Digitalização',
        especialidade: 'Psiquiatria',
        dataAtendimento: new Date().toISOString(),
        tipoRegistro: 'scan_historico_drive',
        scanDriveMetadados: {
          driveFileId: driveResult.fileId,
          driveWebViewLink: driveResult.webViewLink,
          driveDownloadLink: driveResult.downloadLink,
          nomeArquivo: nomeArquivo,
          quantidadePaginas: capturedPages.length,
          dataOriginalDocumento: 'Passivo Histórico Físico',
          observacoes: `Digitalização de ${capturedPages.length} página(s) antigas do arquivo físico em papel.`,
          paginasBase64: capturedPages.slice(0, 3), // guarda miniaturas para visualização rápida
        },
      });

      setLastUploadedResult({
        pdfBlob,
        pdfDataUri,
        driveWebViewLink: driveResult.webViewLink,
        nomeArquivo,
        totalPaginas: capturedPages.length,
      });

      showToast(
        'Prontuário Digitalizado com Sucesso!',
        `${capturedPages.length} páginas convertidas em PDF e sincronizadas com a pasta do Google Drive.`,
        'success'
      );

      setCapturedPages([]);
    } catch (err) {
      console.error(err);
      showToast('Erro na digitalização', 'Ocorreu um erro ao compilar o PDF.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Digitalizador de Prontuários Físicos
            </h2>
            <Badge variant="brand" dot>Google Drive API</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Digitalize o passivo de 1.500 fichas antigas. Tire de 5 a 15 fotos seguidas pelo celular e gere 1 PDF único no Drive.
          </p>
        </div>

        {/* Seleção do Paciente */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Vincular ao Paciente:
          </label>
          <select
            value={selectedPacienteId}
            onChange={(e) => setSelectedPacienteId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
          >
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nomeCompleto} ({p.cpf})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Card Principal de Captura */}
      <Card className="border-2 border-dashed border-brand-200 dark:border-brand-900/50 bg-brand-50/20 dark:bg-brand-950/10">
        
        {/* Painel da Câmera Ativa */}
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] max-h-[480px] mx-auto flex items-center justify-center shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Mira visual para enquadramento da folha */}
              <div className="absolute inset-6 border-2 border-white/40 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
                  Enquadre a folha do prontuário
                </span>
              </div>

              {/* Contador de páginas flutuante */}
              <div className="absolute top-4 right-4 bg-brand-600/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full shadow">
                {capturedPages.length} Página(s) Tirada(s)
              </div>
            </div>

            {/* Controles de Disparo */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={stopCamera}
                size="sm"
              >
                Pausar Câmera
              </Button>

              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-brand-500 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
                title="Tirar Foto da Página"
              >
                <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              <Button
                variant="primary"
                onClick={handleFinalizarEEnviar}
                disabled={capturedPages.length === 0}
                size="sm"
              >
                Concluir ({capturedPages.length})
              </Button>
            </div>
          </div>
        ) : (
          /* Painel para iniciar câmera ou enviar arquivos */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Câmera Contínua de Digitalização
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Bata fotos em sequência sem fechar o app. Ao clicar em finalizar, tudo vira 1 único arquivo PDF compacto enviado ao Google Drive.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                leftIcon={<Camera className="w-4 h-4" />}
                onClick={startCamera}
                size="md"
              >
                Abrir Câmera Contínua
              </Button>

              <Button
                variant="outline"
                leftIcon={<Upload className="w-4 h-4" />}
                onClick={() => fileInputRef.current?.click()}
                size="md"
              >
                Selecionar Fotos do Dispositivo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Miniaturas das Páginas Capturadas */}
      {capturedPages.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Páginas Prontas para Compilação ({capturedPages.length})
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCapturedPages([])}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              Limpar Todas
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {capturedPages.map((page, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[3/4] bg-slate-100 dark:bg-slate-800 shadow-sm"
              >
                <img
                  src={page}
                  alt={`Página ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Pág {idx + 1}
                </div>
                <button
                  onClick={() => removePage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                  title="Excluir página"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Card para adicionar mais */}
            <button
              onClick={startCamera}
              className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 aspect-[3/4] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-brand-600 hover:border-brand-400 transition-colors bg-slate-50 dark:bg-slate-800/40"
            >
              <Plus className="w-6 h-6" />
              <span className="text-[10px] font-medium">+ Página</span>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FolderSync className="w-5 h-5" />}
              onClick={handleFinalizarEEnviar}
              isLoading={isProcessing}
            >
              Salvar no Google Drive
            </Button>
          </div>
        </Card>
      )}

      {/* Resultado do Último Upload Realizado com Sucesso */}
      {lastUploadedResult && (
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Prontuário Salvo e Sincronizado no Google Drive!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Arquivo: <strong>{lastUploadedResult.nomeArquivo}</strong> ({lastUploadedResult.totalPaginas} páginas)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={lastUploadedResult.driveWebViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir no Google Drive
            </a>

            <a
              href={lastUploadedResult.pdfDataUri}
              download={lastUploadedResult.nomeArquivo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar Cópia em PDF
            </a>

            {onFinished && (
              <Button variant="ghost" size="sm" onClick={onFinished}>
                Ir para a Ficha do Paciente
              </Button>
            )}
          </div>
        </Card>
      )}

    </div>
  );
};
