import React, { useState } from 'react';
import { Smartphone, Share, PlusSquare, X } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-600 to-brand-700 text-white p-3.5 rounded-2xl shadow-lg mb-5 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight">Use como App no seu Celular!</p>
            <p className="text-[11px] text-teal-100 leading-snug">
              Sem baixar da loja: adicione à tela inicial com 1 clique.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-[11px] font-semibold bg-white text-teal-800 px-3 py-1.5 rounded-lg shadow-sm hover:bg-teal-50 transition-colors"
          >
            {showInstructions ? 'Fechar' : 'Como instalar?'}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-teal-200 hover:text-white rounded-md transition-colors"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="mt-3 pt-3 border-t border-white/20 text-xs space-y-2">
          <div className="bg-black/20 p-2.5 rounded-xl">
            <p className="font-bold flex items-center gap-1.5 text-amber-200">
              <Share className="w-3.5 h-3.5" /> No iPhone (Safari):
            </p>
            <p className="text-[11px] text-teal-50 mt-0.5">
              1. Toque no botão <strong>Compartilhar</strong> (ícone do quadrado com seta para cima no rodapé).
              <br />
              2. Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
            </p>
          </div>

          <div className="bg-black/20 p-2.5 rounded-xl">
            <p className="font-bold flex items-center gap-1.5 text-emerald-200">
              <PlusSquare className="w-3.5 h-3.5" /> No Android (Chrome):
            </p>
            <p className="text-[11px] text-teal-50 mt-0.5">
              1. Toque nos <strong>três pontinhos (⋮)</strong> no canto superior direito.
              <br />
              2. Selecione <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar aplicativo"</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
