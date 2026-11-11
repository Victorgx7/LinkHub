'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import BotaoOutline from '@/componentes/ui/BotaoOutline';

export default function PaginaRecuperarSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('/api/auth/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();
      setCarregando(false);

      if (!dados.sucesso) {
        setErro(dados.erro || 'Falha ao processar solicitação');
        return;
      }

      setMensagemSucesso(
        'Se o endereço estiver cadastrado, enviamos um link temporário com instruções.'
      );
    } catch (err) {
      setErro('Erro de conexão. Tente novamente.');
      setCarregando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 aurora-bg">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-neon/10 blur-[130px] rounded-full" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-neon/50 flex items-center justify-center shadow-neon-suave">
              <span className="text-neon font-black text-xl tracking-tighter">LH</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">
              Link<span className="text-neon">Hub</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Recuperação de Senha
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Informe seu e-mail cadastrado para receber o link de redefinição
          </p>
        </div>

        <div className="rounded-2xl vidro p-8 relative shadow-vidro">
          {erro && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          {mensagemSucesso ? (
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-neon mx-auto" />
              <p className="text-sm text-zinc-300">{mensagemSucesso}</p>
              <div className="pt-2">
                <Link href="/login">
                  <BotaoOutline variante="padrao" tamanho="md" icone={<ArrowLeft className="w-4 h-4" />}>
                    Voltar para o Login
                  </BotaoOutline>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={lidarComEnvio} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  E-mail Cadastrado
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <BotaoOutline
                  tipo="submit"
                  variante="neon"
                  tamanho="lg"
                  carregando={carregando}
                  className="w-full justify-center shadow-neon-suave"
                  iconeDireita={<ArrowRight className="w-4 h-4" />}
                >
                  Enviar Link de Recuperação
                </BotaoOutline>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Lembrou da senha? Entrar</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
