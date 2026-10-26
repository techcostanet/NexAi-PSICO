import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lock, Camera, Activity, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSaasPlan, MODULE_PRICES, SaasModulesState } from '../../context/SaasPlanContext';

interface ModuleUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleKey: keyof SaasModulesState | null;
  onGoToSaasAdmin: () => void;
}

export const ModuleUpsellModal: React.FC<ModuleUpsellModalProps> = ({
  isOpen,
  onClose,
  moduleKey,
  onGoToSaasAdmin,
}) => {
  if (!moduleKey) return null;

  const getModuleDetails = () => {
    switch (moduleKey) {
      case 'scannerFichas':
        return {
          title: 'Scanner de Fichas Físicas',
          badge: 'Módulo Opcional',
          icon: Camera,
          iconColor: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60',
          price: MODULE_PRICES.scannerFichas,
          description:
            'Digitalize pilhas de prontuários antigos de papel pelo smartphone sem fechar a câmera. O sistema compila tudo em 1 único arquivo PDF compacto com upload instantâneo para sua pasta no Google Drive.',
          benefits: [
            'Digitalização contínua com captura rápida de páginas',
            'Compilação automática em padrão A4 de prontuário',
            'Upload em tempo real para a pasta da clínica no Google Drive',
            'Vínculo direto com o histórico digital do paciente',
          ],
        };
      case 'consultaIa':
        return {
          title: 'Consulta Inteligente com IA',
          badge: 'Módulo Opcional',
          icon: Activity,
          iconColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60',
          price: MODULE_PRICES.consultaIa,
          description:
            'Grave a conversa da consulta ou dite as anotações clínicas. O Google Gemini Flash estrutura em segundos a evolução médica completa no rigoroso padrão SOAP.',
          benefits: [
            'Transcrição e interpretação clínica avançada',
            'Preenchimento automático das 4 seções do SOAP',
            'Sugestão de CID-10 e hipótese diagnóstica',
            'Assinatura eletrônica e integração com a timeline clínica',
          ],
        };
      case 'diarioHumor':
      default:
        return {
          title: 'Diário de Emoções do Paciente',
          badge: 'Módulo Opcional',
          icon: Heart,
          iconColor: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60',
          price: MODULE_PRICES.diarioHumor,
          description:
            'Aplicativo web PWA seguro para o paciente registrar diariamente humor, sono, crises e gatilhos emocionais entre as sessões.',
          benefits: [
            'Interface adaptada para crianças, adolescentes e adultos',
            'Gráficos de oscilação do humor entre as sessões',
            'Análise de síntese clínica orientada por IA',
            'Acesso restrito e sigiloso protegido por link seguro',
          ],
        };
    }
  };

  const details = getModuleDetails();
  const IconComponent = details.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Módulo Opcional"
      subtitle="Recurso adicional disponível para contratação"
      maxWidth="lg"
    >
      <div className="space-y-6">
        
        {/* Cabeçalho do Módulo */}
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${details.iconColor}`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {details.title}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                <Lock className="w-3 h-3" /> {details.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {details.description}
            </p>
          </div>
        </div>

        {/* Lista de Vantagens */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            O que está incluso neste módulo:
          </span>
          <div className="space-y-2">
            {details.benefits.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preço e Chamada para Ação */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-900 dark:text-amber-300 font-medium block">
              Valor Adicional
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                R$ {details.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[11px] text-slate-500">/mês</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onGoToSaasAdmin();
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none shadow-md shadow-amber-500/20 text-xs"
          >
            Habilitar no Painel SaaS
          </Button>
        </div>

        {/* Rodapé com Fechar */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>

      </div>
    </Modal>
  );
};
