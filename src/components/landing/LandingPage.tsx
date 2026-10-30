import React from 'react';
import {
  Brain,
  Sparkles,
  Heart,
  Calendar,
  ShieldCheck,
  FileText,
  Camera,
  Receipt,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Zap,
  Users,
  Smile,
  Activity,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { APP_VERSION } from '../../version';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToPortalDemo: () => void;
  onGoToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToPortalDemo,
  onGoToAdmin,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 1. Header / Navbar da Landing Page */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  NexAi<span className="text-brand-600 dark:text-brand-400">-PSICO</span>
                </span>
                <span className="text-[10px] bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold px-1.5 py-0.5 rounded border border-brand-500/20">
                  IA
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                  v{APP_VERSION}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Gestão Clínica Inteligente</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#diario" className="hover:text-brand-600 transition-colors">Diário de Emoções</a>
            <a href="#recursos" className="hover:text-brand-600 transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-brand-600 transition-colors">Planos</a>
            <a href="#seguranca" className="hover:text-brand-600 transition-colors">Segurança</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Heart className="w-3.5 h-3.5 text-teal-600" />}
              onClick={onGoToPortalDemo}
              className="text-xs hidden sm:inline-flex"
            >
              <span>Demonstração Diário</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={onGoToLogin}
              className="text-xs shadow-md shadow-brand-500/20"
            >
              <span>Acessar Consultório</span>
            </Button>
          </div>

        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-400/20 via-teal-300/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Ecossistema Clínico para Psicólogos e Psiquiatras</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Gestão clínica moderna com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600">
              Diário de Emoções
            </span>{' '}
            no celular do paciente.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Elimine tarefas burocráticas, sincronize sua agenda com o Google, emita recibos para a DMED e acompanhe os sentimentos do seu paciente entre as sessões com Inteligência Artificial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onGoToLogin}
              className="w-full sm:w-auto text-sm px-8 py-3.5 shadow-xl shadow-brand-500/25 font-bold"
            >
              <span>Acessar Meu Consultório</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              leftIcon={<Heart className="w-4 h-4 text-teal-600" />}
              onClick={onGoToPortalDemo}
              className="w-full sm:w-auto text-sm px-6 py-3.5 border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60"
            >
              <span>Ver Diário no Celular (Demo)</span>
            </Button>
          </div>

          {/* Selos de Confiança */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conformidade com CFP e CRM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Pronto para DMED e IRPF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>PWA sem instalação na loja</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Mega Destaque: DIÁRIO DE EMOÇÕES DO PACIENTE */}
      <section id="diario" className="py-20 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="brand" size="lg">Inovação Terapêutica</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Diário de Emoções Inter-sessões
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              O que seu paciente sente entre as sessões não precisa ser um mistério. Ele registra sentimentos, sono e medicamentos em segundos pelo smartphone, e você recebe uma síntese analítica com IA na hora da consulta.
            </p>
          </div>

          {/* Os 3 Perfis de Idade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Infantil (Kids) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-amber-300 dark:border-amber-900/60 shadow-lg shadow-amber-500/5 space-y-4 relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 flex items-center justify-center text-2xl shadow-inner">
                🦁
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Para Crianças (5 a 11 anos)
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Perfil Infantil (Kids)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interface lúdica com bichinhos, cartões coloridos e perguntas simples. Ideal para avaliação de ansiedade escolar, birras e regulação emocional na infância.
              </p>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Emojis amigáveis e vocabulário simples</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Acesso facilitado para os pais</span>
                </li>
              </ul>
            </div>

            {/* 2. Jovem (Teen) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-indigo-300 dark:border-indigo-900/60 shadow-lg shadow-indigo-500/5 space-y-4 relative overflow-hidden group hover:border-indigo-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-2xl shadow-inner">
                ⚡
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Para Adolescentes (12 a 18 anos)
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Perfil Jovem (Teen)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Design ágil, dinâmico e focado na rotina dos jovens. Perfeito para adolescentes com TDAH, desafios escolares, uso de telas e oscilações do humor.
              </p>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Controle de medicação e foco nos estudos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Linguagem direta e não infantilizada</span>
                </li>
              </ul>
            </div>

            {/* 3. Adulto */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-teal-300 dark:border-teal-900/60 shadow-lg shadow-teal-500/5 space-y-4 relative overflow-hidden group hover:border-teal-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center text-2xl shadow-inner">
                🌿
              </div>
              <div>
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                  Para Adultos e Idosos
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Perfil Adulto
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rastreamento clínico aprofundado com registro de gatilhos situacionais, qualidade de sono, sintomas físicos e adesão a psicofármacos.
              </p>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Gatilhos interpessoais e de trabalho</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Síntese Tímica com Inteligência Artificial</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Banner de Ação para o Diário */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Quer ver como seu paciente interage no smartphone?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Teste o aplicativo web agora mesmo sem precisar cadastrar nada.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Smartphone className="w-4 h-4" />}
              onClick={onGoToPortalDemo}
              className="text-xs font-bold px-6 shadow-md shadow-brand-500/20"
            >
              <span>Abrir Demonstração no Smartphone</span>
            </Button>
          </div>

        </div>
      </section>

      {/* 4. Recursos da Plataforma Clínica */}
      <section id="recursos" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="brand">Funcionalidades do Consultório</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tudo o que o profissional solo precisa em uma única tela
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Desenhado para quem não quer perder tempo com sistemas lentos e confusos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Agenda em 4 Modos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualize seus pacientes em Kanban, Diário, Semanal ou Mensal, com sincronização oficial com o Google Agenda.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Financeiro e DMED
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Controle pagamentos em Pix, cartão ou convênio, com emissão de recibos médicos em PDF e previsão de receita futura da agenda.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Prontuário com IA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Evoluções clínicas estruturadas no padrão SOAP. Economize até 70% do tempo gasto redigindo anotações após as sessões.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Scan de Fichas Físicas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Digitalize prontuários de papel antigos diretamente para pastas criptografadas no Google Drive com catalogação automática.
            </p>
          </div>

        </div>

      </section>

      {/* 5. Tabela de Planos e Preços */}
      <section id="planos" className="py-20 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="brand">Transparência</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Planos desenhados para o seu consultório
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sem taxas escondidas, sem fidelidade e com ativação imediata.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Plano 1: Solo */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profissional Solo</h3>
                <p className="text-xs text-slate-500">Para profissionais em início de consultório.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">R$ 99</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>

                <ul className="text-xs space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cadastro ilimitado de pacientes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Agenda nos 4 modos (Kanban e Calendário)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Financeiro com DMED e Recibos em PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Integração Google Agenda</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={onGoToLogin}
                className="w-full justify-center text-xs font-bold"
              >
                <span>Escolher Solo</span>
              </Button>
            </div>

            {/* Plano 2: Consultório IA (Mais Popular) */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-brand-500 shadow-xl shadow-brand-500/10 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Mais Escolhido
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clínica Inteligente</h3>
                <p className="text-xs text-slate-500">O ecossistema completo com Diário e IA.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-brand-600 dark:text-brand-400 font-mono">R$ 199</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>

                <ul className="text-xs space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Tudo do Plano Solo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Diário de Emoções PWA (Kids, Teen e Adulto)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Síntese Tímica com IA (Google Gemini)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Previsão de Receita e Cobrança no WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>Personalização de Temas e Cores</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={onGoToLogin}
                className="w-full justify-center text-xs font-bold shadow-md shadow-brand-500/25"
              >
                <span>Começar Agora</span>
              </Button>
            </div>

            {/* Plano 3: Pro */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clínica Pro</h3>
                <p className="text-xs text-slate-500">Para clínicas com alto volume e transição física.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">R$ 349</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>

                <ul className="text-xs space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tudo do Plano Inteligente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Scanner de Fichas Físicas (Google Drive)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Transcrição de Áudio de Sessões SOAP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Suporte VIP e Backup Diário</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={onGoToLogin}
                className="w-full justify-center text-xs font-bold"
              >
                <span>Falar com Especialista</span>
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Rodapé */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-slate-900 dark:text-white">NexAi-PSICO</span>
            <span>•</span>
            <span>Versão v{APP_VERSION}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span>Privacidade LGPD</span>
            <span>Termos de Uso</span>
            <button
              onClick={onGoToAdmin}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Acesso Master ao SaaS"
            >
              Administração SaaS
            </button>
          </div>

          <p className="text-slate-400">
            © {new Date().getFullYear()} NexAi Tecnologia. Todos os direitos reservados.
          </p>

        </div>
      </footer>

    </div>
  );
};
