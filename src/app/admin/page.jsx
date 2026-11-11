import React from 'react';
import { obterSessaoServidor } from '@/lib/sessao';
import prisma from '@/lib/prisma';
import CardBento from '@/componentes/ui/CardBento';
import BotaoOutline from '@/componentes/ui/BotaoOutline';
import Link from 'next/link';
import { 
  Users, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Plus
} from 'lucide-react';

export default async function PainelAdminPrincipal() {
  const sessao = await obterSessaoServidor();
  const { usuario } = sessao;

  // Busca os perfis que o usuário pode gerenciar
  let perfis = [];
  if (usuario.papel === 'ADMINISTRADOR_PRINCIPAL') {
    perfis = await prisma.perfil.findMany({
      where: { excluidoEm: null },
      include: {
        links: { where: { excluidoEm: null } },
        _count: { select: { eventosAcesso: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  } else {
    const permissoes = await prisma.permissaoPerfil.findMany({
      where: { usuarioId: usuario.id },
      include: {
        perfil: {
          include: {
            links: { where: { excluidoEm: null } },
            _count: { select: { eventosAcesso: true } },
          },
        },
      },
    });
    perfis = permissoes.map((p) => p.perfil).filter((perf) => perf.excluidoEm === null);
  }

  const totalVisualizacoes = perfis.reduce((acum, p) => acum + p.visualizacoesTotais, 0);
  const totalCliques = perfis.reduce((acum, p) => acum + p.cliquesTotais, 0);

  return (
    <div className="space-y-8">
      {/* Boas-vindas e Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Olá, {usuario.nome}</span>
            <span className="text-neon text-lg">👋</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {usuario.papel === 'ADMINISTRADOR_PRINCIPAL'
              ? 'Painel de Controle Global da Plataforma LinkHub'
              : 'Gerencie seus perfis e páginas públicas autorizadas'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BotaoOutline variante="neon" tamanho="sm" icone={<Plus className="w-4 h-4" />}>
            Novo Perfil
          </BotaoOutline>
        </div>
      </div>

      {/* Bento Grid — Indicadores Iniciais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardBento
          titulo="Perfis Ativos"
          subtitulo="Páginas públicas vinculadas"
          icone={<Layers className="w-5 h-5" />}
        >
          <div className="text-3xl font-extrabold text-white mt-1">
            {perfis.length}
            <span className="text-xs font-normal text-zinc-400 ml-2">
              (limite: {usuario.limitePerfis})
            </span>
          </div>
        </CardBento>

        <CardBento
          titulo="Visualizações Acumuladas"
          subtitulo="Métricas em tempo real"
          icone={<Sparkles className="w-5 h-5" />}
        >
          <div className="text-3xl font-extrabold text-neon mt-1">
            {totalVisualizacoes}
          </div>
        </CardBento>

        <CardBento
          titulo="Total de Cliques"
          subtitulo="Interações registradas"
          icone={<ShieldCheck className="w-5 h-5" />}
        >
          <div className="text-3xl font-extrabold text-white mt-1">
            {totalCliques}
          </div>
        </CardBento>
      </div>

      {/* Lista de Perfis Disponíveis */}
      <div className="rounded-2xl vidro p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Seus Perfis
          </h2>
          <span className="text-xs text-zinc-400">
            {perfis.length} {perfis.length === 1 ? 'perfil cadastrado' : 'perfis cadastrados'}
          </span>
        </div>

        <div className="divide-y divide-zinc-800">
          {perfis.map((perfil) => (
            <div key={perfil.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-neon font-bold text-sm">
                  {perfil.nome.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{perfil.nome}</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    /{perfil.slug} • {perfil.links.length} links ativos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/${perfil.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg border border-zinc-700 hover:border-neon text-zinc-400 hover:text-neon transition-colors"
                  title="Abrir página pública"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
