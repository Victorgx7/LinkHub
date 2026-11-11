'use client';

import React from 'react';

/**
 * BotaoOutline — Componente de botão outline reutilizável com foco em microinterações
 * 
 * @param {Object} props
 * @param {'neon' | 'padrao' | 'perigo'} [props.variante='padrao'] - Estilo do contorno
 * @param {'sm' | 'md' | 'lg'} [props.tamanho='md'] - Dimensões do botão
 * @param {React.ReactNode} [props.icone] - Ícone opcional exibido à esquerda
 * @param {React.ReactNode} [props.iconeDireita] - Ícone opcional à direita
 * @param {boolean} [props.carregando=false] - Exibe indicador animado de carregamento
 * @param {boolean} [props.desabilitado=false] - Desabilita cliques e aplica opacidade
 * @param {string} [props.className=''] - Classes adicionais Tailwind
 * @param {React.ReactNode} props.children - Conteúdo textual ou elementos internos
 */
export default function BotaoOutline({
  variante = 'padrao',
  tamanho = 'md',
  icone = null,
  iconeDireita = null,
  carregando = false,
  desabilitado = false,
  className = '',
  children,
  onClick,
  tipo = 'button',
  ...outrasProps
}) {
  const estilosTamanho = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5',
  };

  const estilosVariante = {
    padrao:
      'border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:text-white bg-zinc-900/20 hover:bg-zinc-800/40 dark:border-white/15 dark:hover:border-white/30 dark:text-zinc-200 dark:hover:text-white',
    neon:
      'border-neon/40 hover:border-neon text-neon hover:text-black hover:bg-neon shadow-[0_0_12px_rgba(178,255,0,0.15)] hover:shadow-[0_0_20px_rgba(178,255,0,0.4)]',
    perigo:
      'border-red-500/40 hover:border-red-500 text-red-400 hover:text-white hover:bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
  };

  return (
    <button
      type={tipo}
      disabled={desabilitado || carregando}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center font-medium transition-all duration-200
        border backdrop-blur-sm select-none active:scale-[0.98]
        disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
        ${estilosTamanho[tamanho] || estilosTamanho.md}
        ${estilosVariante[variante] || estilosVariante.padrao}
        ${className}
      `}
      {...outrasProps}
    >
      {carregando ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icone && <span className="inline-flex shrink-0 items-center justify-center">{icone}</span>}
          <span>{children}</span>
          {iconeDireita && <span className="inline-flex shrink-0 items-center justify-center">{iconeDireita}</span>}
        </>
      )}
    </button>
  );
}
