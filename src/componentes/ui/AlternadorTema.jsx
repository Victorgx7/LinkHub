'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTema } from '@/hooks/useTema';

/**
 * AlternadorTema — Botão de alternância manual entre Dark e Light mode
 */
export default function AlternadorTema({ className = '' }) {
  const { tema, alternarTema, montado } = useTema();

  if (!montado) {
    return (
      <div className="w-9 h-9 rounded-xl border border-white/10 bg-zinc-900/40 animate-pulse" />
    );
  }

  const ehEscuro = tema === 'dark';

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={ehEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={ehEscuro ? 'Modo claro' : 'Modo escuro'}
      className={`
        relative p-2 rounded-xl transition-all duration-200 border
        border-zinc-700/60 dark:border-white/10
        bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80
        text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-neon
        hover:border-zinc-400 dark:hover:border-neon/50
        active:scale-95
        ${className}
      `}
    >
      {ehEscuro ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
