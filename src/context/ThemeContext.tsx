import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColorId = 'emerald' | 'blue' | 'purple' | 'rose' | 'amber';

export interface ThemeOption {
  id: ThemeColorId;
  label: string;
  primaryColor: string; // Exibição no seletor
  description: string;
  vars: Record<string, string>;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'emerald',
    label: 'Verde Esmeralda',
    primaryColor: '#0d9488',
    description: 'Equilíbrio e Saúde',
    vars: {
      '--brand-50': '240 253 249',
      '--brand-100': '204 251 239',
      '--brand-200': '153 246 223',
      '--brand-300': '94 234 212',
      '--brand-400': '45 212 191',
      '--brand-500': '20 184 166',
      '--brand-600': '13 148 136',
      '--brand-700': '15 118 110',
      '--brand-800': '17 94 89',
      '--brand-900': '19 78 74',
      '--brand-950': '4 47 46',
    },
  },
  {
    id: 'blue',
    label: 'Azul Oceano',
    primaryColor: '#2563eb',
    description: 'Serenidade e Foco',
    vars: {
      '--brand-50': '239 246 255',
      '--brand-100': '219 234 254',
      '--brand-200': '191 219 254',
      '--brand-300': '147 197 253',
      '--brand-400': '96 165 250',
      '--brand-500': '59 130 246',
      '--brand-600': '37 99 235',
      '--brand-700': '29 78 216',
      '--brand-800': '30 64 175',
      '--brand-900': '30 58 138',
      '--brand-950': '23 37 84',
    },
  },
  {
    id: 'purple',
    label: 'Roxo Ametista',
    primaryColor: '#9333ea',
    description: 'Psicologia e Conexão',
    vars: {
      '--brand-50': '250 245 255',
      '--brand-100': '243 232 255',
      '--brand-200': '233 213 255',
      '--brand-300': '216 180 254',
      '--brand-400': '192 132 252',
      '--brand-500': '168 85 247',
      '--brand-600': '147 51 234',
      '--brand-700': '126 34 206',
      '--brand-800': '107 33 168',
      '--brand-900': '88 28 135',
      '--brand-950': '59 7 100',
    },
  },
  {
    id: 'rose',
    label: 'Rosa Coral',
    primaryColor: '#e11d48',
    description: 'Acolhimento e Empatia',
    vars: {
      '--brand-50': '255 241 242',
      '--brand-100': '255 228 230',
      '--brand-200': '254 205 211',
      '--brand-300': '253 164 175',
      '--brand-400': '251 113 133',
      '--brand-500': '244 63 94',
      '--brand-600': '225 29 72',
      '--brand-700': '190 18 60',
      '--brand-800': '159 18 57',
      '--brand-900': '136 19 55',
      '--brand-950': '76 5 25',
    },
  },
  {
    id: 'amber',
    label: 'Âmbar Dourado',
    primaryColor: '#d97706',
    description: 'Aconchego e Humanização',
    vars: {
      '--brand-50': '255 251 235',
      '--brand-100': '254 243 199',
      '--brand-200': '253 230 138',
      '--brand-300': '252 211 77',
      '--brand-400': '251 191 36',
      '--brand-500': '245 158 11',
      '--brand-600': '217 119 6',
      '--brand-700': '180 83 9',
      '--brand-800': '146 64 14',
      '--brand-900': '120 53 15',
      '--brand-950': '69 26 3',
    },
  },
];

interface ThemeContextType {
  activeThemeId: ThemeColorId;
  setThemeId: (id: ThemeColorId) => void;
  options: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState<ThemeColorId>(() => {
    const saved = localStorage.getItem('nexai_theme_color');
    if (saved && THEME_OPTIONS.some((o) => o.id === saved)) {
      return saved as ThemeColorId;
    }
    return 'emerald';
  });

  useEffect(() => {
    localStorage.setItem('nexai_theme_color', activeThemeId);
    const selected = THEME_OPTIONS.find((o) => o.id === activeThemeId) || THEME_OPTIONS[0];

    const root = document.documentElement;
    Object.entries(selected.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [activeThemeId]);

  return (
    <ThemeContext.Provider
      value={{
        activeThemeId,
        setThemeId: setActiveThemeId,
        options: THEME_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

