import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { obterSessaoServidor } from '@/lib/sessao';
import AlternadorTema from '@/componentes/ui/AlternadorTema';
import BotaoSair from '@/componentes/admin/BotaoSair';

export const metadata = {
  title: 'Painel Administrativo — LinkHub',
};

export default async function LayoutAdmin({ children }) {
  const sessao = await obterSessaoServidor();

  if (!sessao) {
    redirect('/login');
  }

  const { usuario } = sessao;

  return (
    <div className="min-h-screen bg-escuro-fundo text-escuro-texto flex flex-col">
      {/* Topbar do Painel Administrativo */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-neon/50 flex items-center justify-center shadow-neon-suave">
              <span className="text-neon font-black text-sm tracking-tighter">LH</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Link<span className="text-neon">Hub</span>
            </span>
          </Link>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-300 font-mono">
            {usuario.papel === 'ADMINISTRADOR_PRINCIPAL' ? 'ADMIN' : 'PROPRIETÁRIO'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Conectado como <strong className="text-white">{usuario.nome}</strong>
          </span>
          <AlternadorTema />
          <BotaoSair />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
