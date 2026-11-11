'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import BotaoOutline from '@/componentes/ui/BotaoOutline';
import AlternadorTema from '@/componentes/ui/AlternadorTema';

export default function PaginaLogin() {
  const roteador = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!dados.sucesso) {
        setErro(dados.erro || 'Falha na autenticação');
        setCarregando(false);
        return;
      }

      // Redireciona para o painel administrativo
      roteador.push('/admin');
      roteador.refresh();
    } catch (err) {
      setErro('Falha de conexão com o servidor. Tente novamente.');
      setCarregando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 aurora-bg selection:bg-neon selection:text-black">
      {/* Luz ambiente Aurora */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-neon/10 blur-[130px] rounded-full" />

      {/* Topo com Logo e Alternador de Tema */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <AlternadorTema />
      </div>

      <div className="w-full max-w-md">
        {/* Marca LinkHub */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-black border border-neon/50 flex items-center justify-center shadow-neon-suave group-hover:border-neon transition-all">
              <span className="text-neon font-black text-xl tracking-tighter">LH</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">
              Link<span className="text-neon">Hub</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Acesse o Painel Administrativo
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie seus perfis, links e estatísticas
          </p>
        </div>

        {/* Card Glassmorphism */}
        <div className="rounded-2xl vidro p-8 relative shadow-vidro">
          {erro && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={lidarComEnvio} className="space-y-5">
            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-700/60 dark:border-white/10 bg-zinc-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-neon hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-zinc-700/60 dark:border-white/10 bg-zinc-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <div className="pt-2">
              <BotaoOutline
                tipo="submit"
                variante="neon"
                tamanho="lg"
                carregando={carregando}
                className="w-full justify-center shadow-neon-suave"
                iconeDireita={<ArrowRight className="w-4 h-4" />}
              >
                Entrar no LinkHub
              </BotaoOutline>
            </div>
          </form>

        </div>

        {/* Rodapé de Segurança */}
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-500 mt-6 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-neon" />
          <span>Sessão protegida por criptografia Argon2id e cookies seguros</span>
        </p>
      </div>
    </div>
  );
}
