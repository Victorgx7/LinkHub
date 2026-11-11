import React from 'react';
import BotaoOutline from '@/componentes/ui/BotaoOutline';
import CardBento from '@/componentes/ui/CardBento';
import AlternadorTema from '@/componentes/ui/AlternadorTema';
import { 
  Sparkles, 
  BarChart3, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Zap, 
  ExternalLink,
  Smartphone
} from 'lucide-react';

export default function PaginaInicial() {
  return (
    <div className="relative flex-1 flex flex-col aurora-bg">
      {/* Luz difusa Aurora UI de topo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-neon/10 blur-[120px] rounded-full" />

      {/* Cabeçalho de Navegação com Glassmorphism */}
      <header className="sticky top-4 z-50 max-w-6xl w-[calc(100%-2rem)] mx-auto rounded-2xl vidro px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-neon/50 flex items-center justify-center shadow-neon-suave">
            <span className="text-neon font-black text-lg tracking-tighter">LH</span>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
              Link<span className="text-neon">Hub</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AlternadorTema />
          <BotaoOutline 
            variante="neon" 
            tamanho="sm" 
            iconeDireita={<ArrowRight className="w-4 h-4" />}
          >
            Acessar Painel
          </BotaoOutline>
        </div>
      </header>

      {/* Seção Principal (Hero) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-16 pb-20 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neon/30 bg-neon/5 text-neon text-xs font-medium mb-6 animate-pulso-lento">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fase 2 Concluída: Design System & Arquitetura Inicial</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-center tracking-tight max-w-3xl text-zinc-900 dark:text-white leading-[1.1]">
          Sua presença digital com design{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon via-emerald-400 to-[#B2FF00]">
            SaaS de alto nível
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-2xl font-normal leading-relaxed">
          Páginas públicas ultrarrápidas, personalização visual completa com Drag & Drop, 
          estatísticas detalhadas em tempo real e QR Codes dinâmicos.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <BotaoOutline variante="neon" tamanho="lg" iconeDireita={<ArrowRight className="w-5 h-5" />}>
            Criar meu Perfil
          </BotaoOutline>
          <BotaoOutline variante="padrao" tamanho="lg" icone={<Layers className="w-5 h-5" />}>
            Explorar Recursos
          </BotaoOutline>
        </div>

        {/* Bento Grid — Demonstração da Identidade Visual */}
        <section className="w-full mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Arquitetura Modular em Bento Grid
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Componentes reutilizáveis com suporte a Glassmorphism, Dark e Light Mode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Pré-visualização de Botões Outline */}
            <CardBento
              titulo="Botões Outline com Microinterações"
              subtitulo="Componentes personalizáveis para redes sociais e links de ação"
              icone={<Zap className="w-5 h-5" />}
              interativo
              colSpan="md:col-span-2"
            >
              <div className="space-y-3 my-2">
                <BotaoOutline variante="padrao" tamanho="md" className="w-full justify-between" iconeDireita={<ExternalLink className="w-4 h-4" />}>
                  <span>Acesse Nosso Site Oficial</span>
                </BotaoOutline>
                <BotaoOutline variante="neon" tamanho="md" className="w-full justify-between" iconeDireita={<ExternalLink className="w-4 h-4" />}>
                  <span>Fale no WhatsApp Comercial</span>
                </BotaoOutline>
                <BotaoOutline variante="padrao" tamanho="md" className="w-full justify-between" iconeDireita={<ExternalLink className="w-4 h-4" />}>
                  <span>Instagram Profissional (@linkhub)</span>
                </BotaoOutline>
              </div>
            </CardBento>

            {/* Card 2: QR Code Dinâmico */}
            <CardBento
              titulo="QR Code Dinâmico"
              subtitulo="Direcionamento instantâneo para páginas públicas"
              icone={<QrCode className="w-5 h-5" />}
              interativo
            >
              <div className="flex flex-col items-center justify-center py-4">
                <div className="p-3.5 rounded-2xl bg-white text-black shadow-lg border border-neon/30">
                  <div className="w-24 h-24 border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center text-xs text-zinc-500 font-mono">
                    <QrCode className="w-12 h-12 text-zinc-900" />
                  </div>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 font-mono">
                  seu-dominio.com/demo
                </span>
              </div>
            </CardBento>

            {/* Card 3: Métricas em Tempo Real */}
            <CardBento
              titulo="Métricas em Tempo Real"
              subtitulo="Visualizações e cliques sem invasão de privacidade"
              icone={<BarChart3 className="w-5 h-5" />}
              interativo
            >
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">12.480</span>
                  <span className="text-xs font-semibold text-neon bg-neon/10 px-2 py-0.5 rounded-md">
                    +24% esta semana
                  </span>
                </div>
                <div className="w-full bg-zinc-800/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-neon h-full rounded-full w-3/4 shadow-neon-suave" />
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  75% acessos via Smartphones (Mobile First)
                </span>
              </div>
            </CardBento>

            {/* Card 4: Segurança e Conformidade */}
            <CardBento
              titulo="Segurança & LGPD"
              subtitulo="Sessões seguras, Argon2id e Soft Delete nativo"
              icone={<ShieldCheck className="w-5 h-5" />}
              interativo
              colSpan="md:col-span-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-zinc-800/30 dark:bg-white/[0.03] border border-white/5">
                  <div className="text-neon text-xs font-bold uppercase tracking-wider mb-1">Argon2id</div>
                  <div className="text-xs text-zinc-400">Criptografia de senhas de última geração</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800/30 dark:bg-white/[0.03] border border-white/5">
                  <div className="text-neon text-xs font-bold uppercase tracking-wider mb-1">Cookies Seguros</div>
                  <div className="text-xs text-zinc-400">HttpOnly, SameSite e proteção CSRF</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-800/30 dark:bg-white/[0.03] border border-white/5">
                  <div className="text-neon text-xs font-bold uppercase tracking-wider mb-1">Mobile First</div>
                  <div className="text-xs text-zinc-400">Totalmente otimizado para celulares</div>
                </div>
              </div>
            </CardBento>
          </div>
        </section>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="w-full border-t border-zinc-200 dark:border-white/5 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© 2026 LinkHub. Desenvolvido com arquitetura Next.js App Router e MySQL.</p>
          <div className="flex items-center gap-4">
            <span>Privacidade & LGPD</span>
            <span>Termos de Uso</span>
            <span className="text-neon font-medium">Status: Operacional</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
