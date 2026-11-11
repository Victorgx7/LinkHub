'use client';

import React from 'react';
import IconeDinamico from '@/componentes/publico/IconeDinamico';
import { formatarUrl } from '@/lib/redesSociais';

/**
 * Botão Outline de Link Público com Efeito de Vidro e Telemetria Não Bloqueante
 */
export default function BotaoLinkPublico({ link, configVisual }) {
  const { id, titulo, url, icone, servicoDetectado, destaque } = link;

  const corDestaque = configVisual?.corDestaque || '#B2FF00';
  const corTexto = configVisual?.corTexto || '#FFFFFF';
  const estiloVidro = configVisual?.efeitoVidro !== false;

  const lidarComClique = () => {
    // Registra métrica de clique via beacon assíncrono (sem atrasar a navegação externa)
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/metricas/clique',
        JSON.stringify({ linkId: id })
      );
    } else {
      fetch('/api/metricas/clique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: id }),
        keepalive: true,
      }).catch(() => {});
    }
  };

  const iconeFinal = icone || servicoDetectado || 'ExternalLink';
  const urlFormatada = formatarUrl(url);

  return (
    <a
      href={urlFormatada}
      target="_blank"
      rel="noopener noreferrer"
      onClick={lidarComClique}
      className={`
        group relative w-full flex items-center justify-between px-5 py-4 rounded-xl
        border transition-all duration-200 select-none active:scale-[0.98]
        ${estiloVidro ? 'backdrop-blur-md bg-zinc-900/50' : 'bg-zinc-900'}
        ${destaque ? 'ring-1 ring-neon/40 shadow-neon-suave' : ''}
      `}
      style={{
        borderColor: destaque ? corDestaque : 'rgba(255, 255, 255, 0.12)',
        color: corTexto,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = corDestaque;
        e.currentTarget.style.boxShadow = `0 0 20px ${corDestaque}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = destaque ? corDestaque : 'rgba(255, 255, 255, 0.12)';
        e.currentTarget.style.boxShadow = destaque ? `0 0 15px ${corDestaque}40` : 'none';
      }}
    >
      {/* Ícone à esquerda */}
      <div className="flex items-center gap-3.5 z-10">
        <div
          className="p-2 rounded-lg bg-white/5 border border-white/5 transition-transform duration-200 group-hover:scale-110"
          style={{ color: corDestaque }}
        >
          <IconeDinamico nome={iconeFinal} className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sm sm:text-base tracking-tight text-left">
          {titulo}
        </span>
      </div>

      {/* Ícone sutil à direita */}
      <div className="z-10 text-zinc-500 group-hover:text-white transition-colors duration-200">
        <IconeDinamico nome="ExternalLink" className="w-4 h-4" />
      </div>
    </a>
  );
}
