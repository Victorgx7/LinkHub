import prisma from '@/lib/prisma';
import { PAPEIS_USUARIO, PAPEIS_PERFIL } from '@/lib/constantes';

/**
 * Verifica se um usuário possui privilégios de Administrador Principal.
 */
export async function verificarEhAdmin(usuarioId) {
  if (!usuarioId) return false;
  const usuario = await prisma.usuario.findFirst({
    where: { id: usuarioId, excluidoEm: null, ativo: true },
  });
  return usuario?.papel === PAPEIS_USUARIO.ADMINISTRADOR_PRINCIPAL;
}

/**
 * Valida no servidor se o usuário possui permissão para gerenciar um perfil específico.
 * Administradores principais possuem autorização universal sobre todos os perfis.
 * 
 * @param {string} usuarioId - ID do usuário autenticado
 * @param {string} perfilId - ID do perfil alvo
 * @returns {Promise<boolean>}
 */
export async function verificarPermissaoPerfil(usuarioId, perfilId) {
  if (!usuarioId || !perfilId) return false;

  const usuario = await prisma.usuario.findFirst({
    where: { id: usuarioId, excluidoEm: null, ativo: true },
  });

  if (!usuario) return false;

  // Administrador principal tem permissão total
  if (usuario.papel === PAPEIS_USUARIO.ADMINISTRADOR_PRINCIPAL) {
    return true;
  }

  // Verifica se o usuário é proprietário ou editor vinculado ao perfil
  const permissao = await prisma.permissaoPerfil.findUnique({
    where: {
      usuarioId_perfilId: {
        usuarioId,
        perfilId,
      },
    },
    include: {
      perfil: true,
    },
  });

  if (!permissao || permissao.perfil.excluidoEm !== null) {
    return false;
  }

  return true;
}

/**
 * Retorna os detalhes de um usuário pelo ID.
 */
export async function buscarUsuarioPorId(id) {
  return await prisma.usuario.findFirst({
    where: { id, excluidoEm: null },
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
      limitePerfis: true,
      ativo: true,
      criadoEm: true,
    },
  });
}

/**
 * Lista todos os usuários do sistema (exclusivo para Administrador Principal).
 */
export async function listarUsuarios(usuarioRequisitanteId) {
  const ehAdmin = await verificarEhAdmin(usuarioRequisitanteId);
  if (!ehAdmin) {
    throw new Error('Acesso negado: apenas o Administrador Principal pode listar usuários');
  }

  return await prisma.usuario.findMany({
    where: { excluidoEm: null },
    select: {
      id: true,
      nome: true,
      email: true,
      papel: true,
      limitePerfis: true,
      ativo: true,
      criadoEm: true,
      _count: {
        select: {
          permissoes: true,
        },
      },
    },
    orderBy: { criadoEm: 'desc' },
  });
}

/**
 * Altera o limite de perfis atribuído a um usuário.
 */
export async function definirLimitePerfis(usuarioRequisitanteId, usuarioAlvoId, novoLimite) {
  const ehAdmin = await verificarEhAdmin(usuarioRequisitanteId);
  if (!ehAdmin) {
    throw new Error('Acesso negado');
  }

  const usuarioAtualizado = await prisma.usuario.update({
    where: { id: usuarioAlvoId },
    data: { limitePerfis: Number(novoLimite) },
  });

  await prisma.registroAuditoria.create({
    data: {
      usuarioId: usuarioRequisitanteId,
      acao: 'ALTERAR_LIMITE_PERFIS',
      entidade: 'Usuario',
      entidadeId: usuarioAlvoId,
      detalhesJson: JSON.stringify({ novoLimite }),
    },
  });

  return usuarioAtualizado;
}
