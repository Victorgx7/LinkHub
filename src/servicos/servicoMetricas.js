import { prisma } from '@/lib/prisma.js';

/**
 * Agrega métricas globais da plataforma para o dashboard do administrador.
 * Calcula totais e dados dos últimos N dias.
 *
 * @param {number} dias - Período em dias para análise (padrão: 30)
 * @returns {Promise<Object>} Objeto com métricas agregadas
 */
export async function buscarMetricasGlobais(dias = 30) {
  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - dias);

  const [
    totalVisualizacoes,
    visualizacoesUnicas,
    totalCliques,
    totalPerfis,
    perfisAtivos,
    totalUsuarios,
    visualizacoesPorDia,
    linksMaisClicados,
  ] = await Promise.all([
    // Total de visualizações no período
    prisma.visualizacao.count({
      where: { criadoEm: { gte: dataInicio } },
    }),

    // Visitantes únicos estimados (identificadores anônimos distintos)
    prisma.visualizacao.groupBy({
      by: ['identificadorAnonimo'],
      where: {
        criadoEm: { gte: dataInicio },
        identificadorAnonimo: { not: null },
      },
    }).then((grupos) => grupos.length),

    // Total de cliques no período
    prisma.clique.count({
      where: { criadoEm: { gte: dataInicio } },
    }),

    // Total de perfis (não deletados)
    prisma.perfil.count({ where: { deletadoEm: null } }),

    // Perfis ativos (publicados)
    prisma.perfil.count({
      where: { deletadoEm: null, publicado: true },
    }),

    // Total de usuários
    prisma.usuario.count({ where: { ativo: true } }),

    // Visualizações agrupadas por dia (últimos N dias)
    prisma.$queryRaw`
      SELECT
        DATE(criado_em) as data,
        COUNT(*) as total
      FROM visualizacoes
      WHERE criado_em >= ${dataInicio}
      GROUP BY DATE(criado_em)
      ORDER BY data ASC
    `,

    // Top 5 links mais clicados
    prisma.clique.groupBy({
      by: ['linkId'],
      _count: { linkId: true },
      where: { criadoEm: { gte: dataInicio } },
      orderBy: { _count: { linkId: 'desc' } },
      take: 5,
    }),
  ]);

  // Busca detalhes dos links mais clicados
  const idsLinks = linksMaisClicados.map((c) => c.linkId);
  const detalhesLinks = idsLinks.length > 0
    ? await prisma.link.findMany({
        where: { id: { in: idsLinks } },
        select: {
          id: true,
          titulo: true,
          url: true,
          perfil: { select: { nome: true, slug: true } },
        },
      })
    : [];

  const topLinks = linksMaisClicados.map((clique) => {
    const link = detalhesLinks.find((l) => l.id === clique.linkId);
    return {
      linkId: clique.linkId,
      totalCliques: clique._count.linkId,
      titulo: link?.titulo || 'Link removido',
      url: link?.url || '',
      perfilNome: link?.perfil?.nome || '',
      perfilSlug: link?.perfil?.slug || '',
    };
  });

  // Formata dados de visualizações por dia para o gráfico
  const graficoPorDia = Array.from({ length: dias }, (_, i) => {
    const data = new Date(dataInicio);
    data.setDate(data.getDate() + i + 1);
    const dataStr = data.toISOString().split('T')[0];

    const encontrado = visualizacoesPorDia.find(
      (v) => v.data?.toISOString?.()?.startsWith(dataStr) || String(v.data) === dataStr
    );

    return {
      data: dataStr,
      total: encontrado ? Number(encontrado.total) : 0,
    };
  });

  return {
    periodo: { dias, dataInicio: dataInicio.toISOString() },
    totais: {
      visualizacoes: totalVisualizacoes,
      visualizacoesUnicas,
      cliques: totalCliques,
      perfis: totalPerfis,
      perfisAtivos,
      usuarios: totalUsuarios,
    },
    graficoPorDia,
    topLinks,
  };
}

/**
 * Busca métricas de um perfil específico.
 *
 * @param {string} perfilId
 * @param {number} dias
 */
export async function buscarMetricasPerfil(perfilId, dias = 30) {
  const dataInicio = new Date();
  dataInicio.setDate(dataInicio.getDate() - dias);

  const [visualizacoes, visualizacoesUnicas, cliquesPorLink, graficoPorDia] =
    await Promise.all([
      prisma.visualizacao.count({
        where: { perfilId, criadoEm: { gte: dataInicio } },
      }),

      prisma.visualizacao.groupBy({
        by: ['identificadorAnonimo'],
        where: {
          perfilId,
          criadoEm: { gte: dataInicio },
          identificadorAnonimo: { not: null },
        },
      }).then((g) => g.length),

      prisma.clique.groupBy({
        by: ['linkId'],
        _count: { linkId: true },
        where: {
          link: { perfilId },
          criadoEm: { gte: dataInicio },
        },
        orderBy: { _count: { linkId: 'desc' } },
      }),

      prisma.$queryRaw`
        SELECT
          DATE(criado_em) as data,
          COUNT(*) as total
        FROM visualizacoes
        WHERE perfil_id = ${perfilId}
          AND criado_em >= ${dataInicio}
        GROUP BY DATE(criado_em)
        ORDER BY data ASC
      `,
    ]);

  // Busca detalhes dos links
  const idsLinks = cliquesPorLink.map((c) => c.linkId);
  const links = idsLinks.length > 0
    ? await prisma.link.findMany({
        where: { id: { in: idsLinks } },
        select: { id: true, titulo: true, url: true, icone: true },
      })
    : [];

  const estatisticasLinks = cliquesPorLink.map((c) => {
    const link = links.find((l) => l.id === c.linkId);
    return {
      linkId: c.linkId,
      titulo: link?.titulo || 'Link removido',
      url: link?.url || '',
      icone: link?.icone || 'ExternalLink',
      totalCliques: c._count.linkId,
    };
  });

  const graficoPorDiaFormatado = Array.from({ length: dias }, (_, i) => {
    const data = new Date(dataInicio);
    data.setDate(data.getDate() + i + 1);
    const dataStr = data.toISOString().split('T')[0];

    const encontrado = graficoPorDia.find(
      (v) => v.data?.toISOString?.()?.startsWith(dataStr) || String(v.data) === dataStr
    );

    return {
      data: dataStr,
      total: encontrado ? Number(encontrado.total) : 0,
    };
  });

  return {
    periodo: { dias },
    visualizacoes,
    visualizacoesUnicas,
    estatisticasLinks,
    graficoPorDia: graficoPorDiaFormatado,
  };
}
