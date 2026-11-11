import React from 'react';
import { notFound } from 'next/navigation';
import { buscarPerfilPublicoPorSlug } from '@/servicos/servicoPerfil';
import ShellPerfilPublico from '@/componentes/publico/ShellPerfilPublico';

/**
 * Gera metadados SEO dinâmicos para cada perfil público.
 * Executado no servidor — perfeito para Open Graph e indexação.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const perfil = await buscarPerfilPublicoPorSlug(slug);

  if (!perfil) {
    return { title: 'Perfil não encontrado — LinkHub' };
  }

  const titulo = perfil.tituloSeo || `${perfil.nome} — LinkHub`;
  const descricao =
    perfil.descricaoSeo || perfil.descricao || `Confira os links e redes sociais de ${perfil.nome}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const urlPerfil = `${appUrl}/${perfil.slug}`;

  return {
    title: titulo,
    description: descricao,
    robots: perfil.permiteIndexacao ? 'index, follow' : 'noindex, nofollow',
    openGraph: {
      title: titulo,
      description: descricao,
      url: urlPerfil,
      type: 'profile',
      images: perfil.imagemCompartilhamento
        ? [{ url: perfil.imagemCompartilhamento, width: 1200, height: 630, alt: titulo }]
        : [],
    },
    twitter: {
      card: 'summary',
      title: titulo,
      description: descricao,
    },
    alternates: {
      canonical: urlPerfil,
    },
  };
}

/**
 * Página Pública de Perfil — Server Component (SSR)
 * 
 * Busca os dados do perfil diretamente no banco (sem fetch de API),
 * garantindo desempenho máximo e dados frescos a cada requisição.
 * O registro de visualização ocorre no servidor via Server Action assíncrona.
 */
export default async function PaginaPerfilPublico({ params }) {
  const { slug } = await params;
  const perfil = await buscarPerfilPublicoPorSlug(slug);

  if (!perfil) {
    notFound();
  }

  // Registra a visualização de forma assíncrona sem bloquear a renderização
  // A importação dinâmica evita que código de servidor vaze para o bundle do cliente
  import('@/servicos/servicoPerfil').then(({ registrarVisualizacaoPerfil }) => {
    registrarVisualizacaoPerfil({
      perfilId: perfil.id,
      identificadorAnonimo: 'servidor-ssr',
      dispositivo: 'OUTRO',
    }).catch(() => {});
  });

  const configVisual = perfil.configuracaoVisual || {};

  return (
    <ShellPerfilPublico
      perfil={perfil}
      configVisual={configVisual}
    />
  );
}
