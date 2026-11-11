'use client';

import React from 'react';

/**
 * CardBento — Bloco modular estilizado para painéis Bento Grid com suporte a Liquid Glass
 * 
 * @param {Object} props
 * @param {string} [props.colSpan='col-span-1'] - Controle de largura em grid (ex: md:col-span-2)
 * @param {string} [props.rowSpan='row-span-1'] - Controle de altura em grid
 * @param {string} [props.titulo] - Título opcional no cabeçalho do card
 * @param {string} [props.subtitulo] - Subtítulo descritivo
 * @param {React.ReactNode} [props.icone] - Ícone ou badge no topo do card
 * @param {React.ReactNode} [props.acaoTopo] - Botão ou elemento interativo no topo direito
 * @param {boolean} [props.interativo=false] - Habilita microinterações de hover e elevação
 * @param {string} [props.className=''] - Classes Tailwind adicionais
 * @param {React.ReactNode} props.children - Conteúdo do card
 */
export default function CardBento({
  colSpan = 'col-span-1',
  rowSpan = 'row-span-1',
  titulo,
  subtitulo,
  icone,
  acaoTopo,
  interativo = false,
  className = '',
  children,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl p-6 overflow-hidden vidro
        flex flex-col justify-between
        ${interativo ? 'vidro-hover cursor-pointer' : ''}
        ${colSpan}
        ${rowSpan}
        ${className}
      `}
    >
      {/* Reflexo sutil Liquid Glass superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {(titulo || icone || acaoTopo) && (
        <div className="flex items-center justify-between gap-3 mb-4 z-10">
          <div className="flex items-center gap-3">
            {icone && (
              <div className="p-2.5 rounded-xl bg-zinc-800/50 dark:bg-white/[0.05] border border-white/10 text-neon">
                {icone}
              </div>
            )}
            <div>
              {titulo && (
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
                  {titulo}
                </h3>
              )}
              {subtitulo && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {subtitulo}
                </p>
              )}
            </div>
          </div>
          {acaoTopo && <div className="shrink-0">{acaoTopo}</div>}
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
