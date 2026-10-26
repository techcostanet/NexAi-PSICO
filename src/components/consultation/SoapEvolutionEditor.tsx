import React, { useState } from 'react';
import { ConteudoClinicoSOAP, Medicacao } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  FileText,
  Activity,
  Stethoscope,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Lock,
} from 'lucide-react';

interface SoapEvolutionEditorProps {
  initialSoap: ConteudoClinicoSOAP;
  transcricao?: string;
  onSave: (soap: ConteudoClinicoSOAP) => void;
  isSaving?: boolean;
}

export const SoapEvolutionEditor: React.FC<SoapEvolutionEditorProps> = ({
  initialSoap,
  transcricao,
  onSave,
  isSaving = false,
}) => {
  const [soap, setSoap] = useState<ConteudoClinicoSOAP>(initialSoap);
  const [activeTab, setActiveTab] = useState<'soap' | 'transcricao'>('soap');

  // Adicionar Medicação rápida
  const [novaMed, setNovaMed] = useState<Medicacao>({
    nome: '',
    dosagem: '',
    posologia: '',
    controlada: true,
    usoContinuo: true,
  });
  const [mostrarAddMed, setMostrarAddMed] = useState(false);

  const handleAddMed = () => {
    if (!novaMed.nome) return;
    setSoap((prev) => ({
      ...prev,
      medicacoesPrescritas: [...prev.medicacoesPrescritas, novaMed],
    }));
    setNovaMed({
      nome: '',
      dosagem: '',
      posologia: '',
      controlada: true,
      usoContinuo: true,
    });
    setMostrarAddMed(false);
  };

  const handleRemoveMed = (index: number) => {
    setSoap((prev) => ({
      ...prev,
      medicacoesPrescritas: prev.medicacoesPrescritas.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Abas Superiores */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'soap'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            📋 Evolução SOAP Estruturada
          </button>
          {transcricao && (
            <button
              onClick={() => setActiveTab('transcricao')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transcricao'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              🎙️ Transcrição Completa do Áudio
            </button>
          )}
        </div>

        <Badge variant="success" dot>IA Google Gemini Concluída</Badge>
      </div>

      {activeTab === 'transcricao' && transcricao ? (
        <Card className="bg-slate-50 dark:bg-slate-800/50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Registro Bruto do Ditado / Consulta
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-mono text-xs">
            {transcricao}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          
          {/* S - SUBJETIVO */}
          <Card className="space-y-2 border-l-4 border-l-brand-500">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-black text-xs flex items-center justify-center">
                S
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Subjetivo (Relato do Paciente & Queixa Principal)
              </h4>
            </div>
            <textarea
              rows={3}
              value={soap.subjetivo}
              onChange={(e) => setSoap({ ...soap, subjetivo: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              placeholder="Queixa principal, humor relatado, alterações de sono e apetite..."
            />
          </Card>

          {/* O - OBJETIVO */}
          <Card className="space-y-2 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                O
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Objetivo (Exame do Estado Mental - EEM)
              </h4>
            </div>
            <textarea
              rows={3}
              value={soap.objetivo}
              onChange={(e) => setSoap({ ...soap, objetivo: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              placeholder="Aparência, contato, humor, afeto, psicomotricidade, pensamento, sensopercepção..."
            />
          </Card>

          {/* A - AVALIAÇÃO */}
          <Card className="space-y-2 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                A
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Avaliação & Hipótese Diagnóstica (CID-10 / CID-11 / DSM-5)
              </h4>
            </div>
            <input
              type="text"
              value={soap.avaliacao}
              onChange={(e) => setSoap({ ...soap, avaliacao: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-brand-900 dark:text-brand-300 focus:ring-2 focus:ring-brand-500"
              placeholder="Ex: F32.1 - Episódio depressivo moderado em melhora parcial"
            />
          </Card>

          {/* P - PLANO TERAPÊUTICO */}
          <Card className="space-y-2 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                P
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Plano Terapêutico & Condutas
              </h4>
            </div>
            <textarea
              rows={3}
              value={soap.planoTerapeutico}
              onChange={(e) => setSoap({ ...soap, planoTerapeutico: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
              placeholder="Condutas, orientações de higiene do sono, encaminhamentos e data do próximo retorno..."
            />
          </Card>

          {/* MEDICAÇÕES PRESCRITAS & PSICOFÁRMACOS */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-brand-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Prescrição de Psicofármacos & Medicações Ativas ({soap.medicacoesPrescritas.length})
                </h4>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setMostrarAddMed(!mostrarAddMed)}
              >
                Adicionar Remédio
              </Button>
            </div>

            {/* Formulário inline para adicionar medicamento */}
            {mostrarAddMed && (
              <div className="p-3 bg-brand-50/50 dark:bg-brand-950/20 rounded-xl border border-brand-200 dark:border-brand-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nome (Ex: Escitalopram)"
                    value={novaMed.nome}
                    onChange={(e) => setNovaMed({ ...novaMed, nome: e.target.value })}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Dosagem (Ex: 15mg)"
                    value={novaMed.dosagem}
                    onChange={(e) => setNovaMed({ ...novaMed, dosagem: e.target.value })}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Posologia (Ex: 1x pela manhã)"
                    value={novaMed.posologia}
                    onChange={(e) => setNovaMed({ ...novaMed, posologia: e.target.value })}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={novaMed.controlada}
                      onChange={(e) => setNovaMed({ ...novaMed, controlada: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Receita de Controle Especial (Portaria 344/98)</span>
                  </label>
                  <Button variant="primary" size="sm" onClick={handleAddMed}>
                    Incluir na Prescrição
                  </Button>
                </div>
              </div>
            )}

            {/* Lista de Medicamentos */}
            {soap.medicacoesPrescritas.length > 0 ? (
              <div className="space-y-2">
                {soap.medicacoesPrescritas.map((med, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {med.nome} {med.dosagem}
                        </span>
                        {med.controlada && (
                          <Badge variant="warning" size="sm">Controle Especial C1/B1</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {med.posologia}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMed(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remover medicamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Nenhum medicamento prescrito nesta sessão.</p>
            )}
          </Card>

          {/* ALERTAS DE RISCO CLÍNICO */}
          {soap.alertasRisco && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <strong>Triagem de Risco:</strong> {soap.alertasRisco}
              </div>
            </div>
          )}

          {/* BOTÃO DE VALIDAÇÃO E ASSINATURA DIGITAL */}
          <div className="pt-3 flex justify-end gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
              onClick={() => onSave(soap)}
              isLoading={isSaving}
              className="shadow-md shadow-brand-500/20"
            >
              Validar & Assinar Evolução Clínica
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};
