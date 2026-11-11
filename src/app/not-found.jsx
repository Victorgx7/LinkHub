import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

/**
 * Página 404 Global do Next.js.
 */
export default function NaoEncontradoGlobal() {
  return (
    <div className="min-h-screen bg-escuro-fundo flex flex-col items-center justify-center px-4 text-center">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-neon/5 blur-[150px] rounded-full" />

      <div className="relative z-10 space-y-6">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-neon to-emerald-600">
          404
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Página não encontrada
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-sm">
            O endereço que você acessou não existe ou foi removido.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-neon/40 bg-neon/10 text-neon hover:bg-neon hover:text-black font-medium text-sm transition-all duration-200 active:scale-95"
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
