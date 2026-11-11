'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import BotaoOutline from '@/componentes/ui/BotaoOutline';

export default function PaginaRedefinirSenha() {
  const parametros = useParams();
  const roteador = useRouter();
  const token = parametros?.token;

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const temOitoCaracteres = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const senhasCoincidem = senha && senha === confirmarSenha;

  const formularioValido =
    temOitoCaracteres && temMaiuscula && temMinuscula && temNumero && senhasCoincidem;

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    if (!formularioValido) return;

    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha }),
      });

      const dados = await resposta.json();
      setCarregando(false);

      if (!dados.sucesso) {
        setErro(dados.erro || 'Falha ao redefinir senha');
        return;
      }

      setSucesso(true);
      setTimeout(() => {
        roteador.push('/login');
      }, 2000);
    } catch (err) {
      setErro('Erro de conexão ao processar requisição');
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
            Criar Nova Senha
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Escolha uma senha forte para proteger seu perfil
          </p>
        </div>

        <div className="rounded-2xl vidro p-8 relative shadow-vidro">
          {erro && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          {sucesso ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-neon mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white mb-2">Senha Redefinida!</h3>
              <p className="text-sm text-zinc-400">
                Redirecionando para a tela de login...
              </p>
            </div>
          ) : (
            <form onSubmit={lidarComEnvio} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-sm"
                  />
                </div>
              </div>

              {/* Checklist de requisitos de senha */}
              <div className="p-3.5 rounded-xl border border-white/5 bg-zinc-900/50 space-y-1.5 text-xs text-zinc-400">
                <div className={`flex items-center gap-2 ${temOitoCaracteres ? 'text-neon' : ''}`}>
                  {temOitoCaracteres ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-zinc-600" />}
                  <span>Pelo menos 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-2 ${temMaiuscula && temMinuscula ? 'text-neon' : ''}`}>
                  {temMaiuscula && temMinuscula ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-zinc-600" />}
                  <span>Letras maiúsculas e minúsculas</span>
                </div>
                <div className={`flex items-center gap-2 ${temNumero ? 'text-neon' : ''}`}>
                  {temNumero ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-zinc-600" />}
                  <span>Pelo menos um número</span>
                </div>
                <div className={`flex items-center gap-2 ${senhasCoincidem ? 'text-neon' : ''}`}>
                  {senhasCoincidem ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-zinc-600" />}
                  <span>Confirmação coincide</span>
                </div>
              </div>

              <div className="pt-2">
                <BotaoOutline
                  tipo="submit"
                  variante="neon"
                  tamanho="lg"
                  desabilitado={!formularioValido}
                  carregando={carregando}
                  className="w-full justify-center shadow-neon-suave"
                  iconeDireita={<ArrowRight className="w-4 h-4" />}
                >
                  Salvar Nova Senha
                </BotaoOutline>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
