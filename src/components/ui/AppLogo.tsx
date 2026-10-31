import React from 'react';
import { APP_VERSION } from '../../version';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showVersionBelow?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Ícone Oficial da Marca NexAi-PSICO
 * Conceito Central: Fusão da Mente Humana (Cérebro) com o Diário Aberto de Emoções (Psicoterapia)
 */
export const BrainJournalIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. Diário Aberto de Emoções na Base */}
      {/* Capa e Páginas Abertas com Curvatura Acolhedora */}
      <path
        d="M24 37.5C19.5 34.5 13.5 34 6 35V20.5C13.5 19.5 19.5 20 24 23C28.5 20 34.5 19.5 42 20.5V35C34.5 34 28.5 34.5 24 37.5Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lombada Central do Diário */}
      <path
        d="M24 23V37.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Linhas Escritas na Página Esquerda (Anotações dos Sentimentos) */}
      <path
        d="M10.5 25C14.5 24.2 18 24.8 20.5 26"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M10.5 29.5C14.5 28.7 18 29.3 20.5 30.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Linhas Escritas na Página Direita */}
      <path
        d="M27.5 26C30 24.8 33.5 24.2 37.5 25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M27.5 30.5C30 29.3 33.5 28.7 37.5 29.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      {/* Marcador de Páginas / Fitilho Pendurado no Centro */}
      <path
        d="M23 37.5V43.5L24 42.2L25 43.5V37.5H23Z"
        fill="currentColor"
      />

      {/* 2. Cérebro Clínico Emanando do Diário (Hemisférios & Sulcos Cognitivos) */}
      {/* Hemisfério Esquerdo */}
      <path
        d="M22.5 21C20.5 21 15 20 13 16.5C10.8 12.8 12.5 8.5 16 7.5C18.2 6.8 21 7.8 22.5 9.5C23.2 7 24 5 24 5V21H22.5Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Giros / Sulcos do Hemisfério Esquerdo */}
      <path
        d="M14 12C16 11 19 12.2 20 14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 17C17.5 16 19.5 16.5 21 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Hemisfério Direito */}
      <path
        d="M25.5 21C27.5 21 33 20 35 16.5C37.2 12.8 35.5 8.5 32 7.5C29.8 6.8 27 7.8 25.5 9.5C24.8 7 24 5 24 5V21H25.5Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Giros / Sulcos do Hemisfério Direito */}
      <path
        d="M34 12C32 11 29 12.2 28 14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M32 17C30.5 16 28.5 16.5 27 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Brilhos / Pontos de Conexão Neural no Topo */}
      <circle cx="24" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="9.5" cy="8.5" r="1.2" fill="currentColor" fillOpacity="0.9" />
      <circle cx="38.5" cy="8.5" r="1.2" fill="currentColor" fillOpacity="0.9" />
    </svg>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  showVersionBelow = false,
  subtitle,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      icon: 'w-5 h-5',
      title: 'text-base',
      sub: 'text-[9px]',
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      icon: 'w-6 h-6',
      title: 'text-lg',
      sub: 'text-[10px]',
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl',
      icon: 'w-9 h-9',
      title: 'text-2xl',
      sub: 'text-xs',
    },
    xl: {
      box: 'w-16 h-16 rounded-3xl',
      icon: 'w-11 h-11',
      title: 'text-3xl',
      sub: 'text-sm',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Box com Gradiente e a Nova Logomarca (Cérebro + Diário Aberto) */}
      <div
        className={`${sizeClasses.box} bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 shrink-0 relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={sizeClasses.icon}>
          <BrainJournalIcon />
        </div>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white ${sizeClasses.title}`}>
              NexAi<span className="text-brand-600 dark:text-brand-400 font-extrabold">-PSICO</span>
            </span>
            {!showVersionBelow && (
              <span
                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                title={`Versão: v${APP_VERSION}`}
              >
                v{APP_VERSION}
              </span>
            )}
          </div>

          {showVersionBelow ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-2xs"
                title={`Versão ativa do sistema: v${APP_VERSION}`}
              >
                v{APP_VERSION}
              </span>
              <span className={`text-slate-400 dark:text-slate-500 ${sizeClasses.sub}`}>
                {subtitle || 'Gestão Clínica & Diário de Emoções'}
              </span>
            </div>
          ) : (
            subtitle && (
              <p className={`text-slate-400 dark:text-slate-500 ${sizeClasses.sub}`}>
                {subtitle}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

