import prisma from '@/lib/prisma';

/**
 * Gera dinamicamente o sitemap.xml com todas as páginas públicas que permitem indexação.
 */
export default async function sitemap() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const perfisIndexaveis = await prisma.perfil.findMany({
    where: {
      ativo: true,
      excluidoEm: null,
      permiteIndexacao: true,
    },
    select: {
      slug: true,
      atualizadoEm: true,
    },
  });

  const paginasPerfis = perfisIndexaveis.map((perfil) => ({
    url: `${appUrl}/${perfil.slug}`,
    lastModified: perfil.atualizadoEm,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    ...paginasPerfis,
  ];
}
