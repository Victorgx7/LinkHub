import prisma from '@/lib/prisma';
import { SLUGS_RESERVADOS, PAPEIS_USUARIO } from '@/lib/constantes';
import { verificarEhAdmin, verificarPermissaoPerfil } from '@/servicos/servicoUsuario';

/**
 * Busca um perfil público para exibição rápida via SSR.
 * 
 * @param {string} slug - Identificador amigável da URL (ex: 'demo', 'empresa')
 * @returns {Promise<Object|null>} Perfil completo com links e configuração visual
 */
export async function buscarPerfilPublicoPorSlug(slug) {
  if (!slug || typeof slug !== 'string') return null;

  const slugLimpo = slug.trim().toLowerCase();

  // Bloqueia tentativas de busca em rotas reservadas
  if (SLUGS_RESERVADOS.includes(slugLimpo)) {
    return null;
  }

  const perfil = await prisma.perfil.findFirst({
    where: {
      slug: slugLimpo,
      ativo: true,
      excluidoEm: null,
    },
    include: {
      configuracaoVisual: true,
      links: {
        where: {
          ativo: true,
          excluidoEm: null,
        },
        orderBy: {
          ordem: 'asc',
        },
      },
    },
  });

  return perfil;
}

/**
 * Registra uma visualização de perfil de forma assíncrona com identificador anonimizado.
 */
export async function registrarVisualizacaoPerfil({
  perfilId,
  identificadorAnonimo,
  dispositivo = 'OUTRO',
  navegador = 'desconhecido',
}) {
  if (!perfilId) return;

  try {
    await prisma.$transaction([
      prisma.perfil.update({
        where: { id: perfilId },
        data: { visualizacoesTotais: { increment: 1 } },
      }),
      prisma.eventoAcesso.create({
        data: {
          perfilId,
          tipoEvento: 'VISUALIZACAO',
          identificadorAnonimo: identificadorAnonimo || 'anonimo',
          dispositivo,
          navegador,
        },
      }),
    ]);
  } catch (erro) {
    console.error('Falha ao registrar visualização de perfil:', erro);
  }
}

/**
 * Registra o clique em um link específico e incrementa os contadores.
 */
export async function registrarCliqueLink({
  linkId,
  identificadorAnonimo,
  dispositivo = 'OUTRO',
  navegador = 'desconhecido',
}) {
  if (!linkId) return null;

  try {
    const link = await prisma.link.findFirst({
      where: { id: linkId, ativo: true, excluidoEm: null },
      select: { id: true, perfilId: true, url: true },
    });

    if (!link) return null;

    await prisma.$transaction([
      prisma.link.update({
        where: { id: link.id },
        data: { cliquesTotais: { increment: 1 } },
      }),
      prisma.perfil.update({
        where: { id: link.perfilId },
        data: { cliquesTotais: { increment: 1 } },
      }),
      prisma.eventoAcesso.create({
        data: {
          perfilId: link.perfilId,
          linkId: link.id,
          tipoEvento: 'CLIQUE',
          identificadorAnonimo: identificadorAnonimo || 'anonimo',
          dispositivo,
          navegador,
        },
      }),
    ]);

    return link.url;
  } catch (erro) {
    console.error('Falha ao registrar clique de link:', erro);
    return null;
  }
}

/**
 * Verifica se um slug está livre para uso ou se já foi reservado.
 */
export async function verificarSlugDisponivel(slug, perfilIdAtual = null) {
  if (!slug) return false;
  const slugLimpo = slug.trim().toLowerCase();

  if (SLUGS_RESERVADOS.includes(slugLimpo)) {
    return false;
  }

  const existente = await prisma.perfil.findFirst({
    where: {
      slug: slugLimpo,
      excluidoEm: null,
      NOT: perfilIdAtual ? { id: perfilIdAtual } : undefined,
    },
  });

  return !existente;
}

/**
 * Aplica Soft Delete em um perfil. Deixa de aparecer publicamente mas permanece restaurável.
 */
export async function excluirPerfil(perfilId, usuarioId) {
  const autorizado = await verificarPermissaoPerfil(usuarioId, perfilId);
  if (!autorizado) {
    throw new Error('Sem autorização para excluir este perfil');
  }

  const perfil = await prisma.perfil.update({
    where: { id: perfilId },
    data: {
      ativo: false,
      excluidoEm: new Date(),
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      usuarioId,
      acao: 'EXCLUIR_PERFIL_SOFT',
      entidade: 'Perfil',
      entidadeId: perfilId,
    },
  });

  return perfil;
}

/**
 * Restaura um perfil previamente excluído por Soft Delete (exclusivo para Administrador Principal).
 */
export async function restaurarPerfil(perfilId, usuarioId) {
  const ehAdmin = await verificarEhAdmin(usuarioId);
  if (!ehAdmin) {
    throw new Error('Apenas o Administrador Principal pode restaurar perfis');
  }

  const perfil = await prisma.perfil.update({
    where: { id: perfilId },
    data: {
      ativo: true,
      excluidoEm: null,
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      usuarioId,
      acao: 'RESTAURAR_PERFIL',
      entidade: 'Perfil',
      entidadeId: perfilId,
    },
  });

  return perfil;
}

/**
 * Exclusão permanente de um perfil (exclusivo para Administrador Principal).
 */
export async function excluirPerfilPermanentemente(perfilId, usuarioId) {
  const ehAdmin = await verificarEhAdmin(usuarioId);
  if (!ehAdmin) {
    throw new Error('Apenas o Administrador Principal pode realizar a exclusão permanente de perfis');
  }

  await prisma.perfil.delete({
    where: { id: perfilId },
  });

  await prisma.registroAuditoria.create({
    data: {
      usuarioId,
      acao: 'EXCLUIR_PERFIL_PERMANENTE',
      entidade: 'Perfil',
      entidadeId: perfilId,
    },
  });

  return true;
}
