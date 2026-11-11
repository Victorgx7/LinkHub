import prisma from '@/lib/prisma';
import { gerarTokenAleatorio, gerarHashToken, gerarHashSenha } from '@/lib/hash';
import { TEMPO_EXPIRACAO, PAPEIS_USUARIO, PAPEIS_PERFIL } from '@/lib/constantes';
import { enviarEmailConvite } from '@/servicos/servicoEmail';
import { criarSessao } from '@/servicos/servicoAutenticacao';

/**
 * Cria e dispara um novo convite para um proprietário assumir a administração de um perfil.
 * 
 * @param {Object} params
 * @param {string} params.perfilId - ID do perfil associado
 * @param {string} params.email - E-mail do futuro proprietário
 * @param {string} params.criadoPorId - ID do administrador que enviou
 * @param {string} [params.appUrl] - URL base da aplicação
 * @returns {Promise<{ sucesso: boolean, conviteId?: string, linkConvite?: string, erro?: string }>}
 */
export async function gerarConvite({ perfilId, email, criadoPorId, appUrl = 'http://localhost:3000' }) {
  const perfil = await prisma.perfil.findFirst({
    where: { id: perfilId, excluidoEm: null },
  });

  if (!perfil) {
    return { sucesso: false, erro: 'Perfil não encontrado ou excluído' };
  }

  // Verifica se já existe um usuário ativo com esse e-mail
  const usuarioExistente = await prisma.usuario.findFirst({
    where: { email: email.toLowerCase(), excluidoEm: null },
  });

  if (usuarioExistente) {
    // Se o usuário já existe, vincula diretamente a permissão ao perfil
    await prisma.permissaoPerfil.upsert({
      where: {
        usuarioId_perfilId: {
          usuarioId: usuarioExistente.id,
          perfilId,
        },
      },
      update: { papel: PAPEIS_PERFIL.PROPRIETARIO },
      create: {
        usuarioId: usuarioExistente.id,
        perfilId,
        papel: PAPEIS_PERFIL.PROPRIETARIO,
      },
    });

    return {
      sucesso: true,
      mensagem: 'Usuário já cadastrado; permissão vinculada imediatamente.',
    };
  }

  // Gera token criptografado
  const token = gerarTokenAleatorio(32);
  const tokenHash = gerarHashToken(token);
  const expiraEm = new Date(Date.now() + TEMPO_EXPIRACAO.CONVITE_HORAS * 60 * 60 * 1000);

  const convite = await prisma.convite.create({
    data: {
      perfilId,
      email: email.toLowerCase(),
      tokenHash,
      expiraEm,
      criadoPorId,
    },
  });

  const linkConvite = `${appUrl}/convite/${token}`;

  // Dispara o e-mail ou simula no terminal
  await enviarEmailConvite({
    para: email.toLowerCase(),
    nomePerfil: perfil.nome,
    linkConvite,
  });

  // Auditoria
  await prisma.registroAuditoria.create({
    data: {
      usuarioId: criadoPorId,
      acao: 'CRIAR_CONVITE',
      entidade: 'Convite',
      entidadeId: convite.id,
      detalhesJson: JSON.stringify({ email: email.toLowerCase(), perfilId }),
    },
  });

  return {
    sucesso: true,
    conviteId: convite.id,
    linkConvite,
  };
}

/**
 * Valida se um token de convite existe, não foi utilizado e ainda está dentro do prazo de validade.
 */
export async function validarTokenConvite(token) {
  if (!token) return { valido: false, erro: 'Token não fornecido' };

  const tokenHash = gerarHashToken(token);

  const convite = await prisma.convite.findUnique({
    where: { tokenHash },
    include: { perfil: true },
  });

  if (!convite) {
    return { valido: false, erro: 'Convite não encontrado' };
  }

  if (convite.usado) {
    return { valido: false, erro: 'Este convite já foi utilizado anteriormente' };
  }

  if (new Date() > convite.expiraEm) {
    return { valido: false, erro: 'Este convite expirou (validade de 48 horas)' };
  }

  return {
    valido: true,
    convite: {
      id: convite.id,
      email: convite.email,
      perfilNome: convite.perfil.nome,
      perfilSlug: convite.perfil.slug,
      perfilId: convite.perfilId,
    },
  };
}

/**
 * Aceita o convite, cria o usuário com senha criptografada via Argon2id,
 * vincula a permissão ao perfil e gera a primeira sessão autenticada.
 */
export async function aceitarConviteECadastrar({ token, nome, senha, userAgent, ipAnonimizado }) {
  const validacao = await validarTokenConvite(token);
  if (!validacao.valido) {
    return { sucesso: false, erro: validacao.erro };
  }

  const { convite } = validacao;
  const senhaHash = await gerarHashSenha(senha);

  // Executa criação do usuário e marcação do convite em transação
  const resultado = await prisma.$transaction(async (tx) => {
    // 1. Cria o usuário
    const novoUsuario = await tx.usuario.create({
      data: {
        nome,
        email: convite.email,
        senhaHash,
        papel: PAPEIS_USUARIO.PROPRIETARIO,
        limitePerfis: 3,
      },
    });

    // 2. Concede a permissão sobre o perfil
    await tx.permissaoPerfil.create({
      data: {
        usuarioId: novoUsuario.id,
        perfilId: convite.perfilId,
        papel: PAPEIS_PERFIL.PROPRIETARIO,
      },
    });

    // 3. Marca o convite como usado
    await tx.convite.update({
      where: { id: convite.id },
      data: { usado: true },
    });

    // 4. Registra auditoria
    await tx.registroAuditoria.create({
      data: {
        usuarioId: novoUsuario.id,
        acao: 'CONVITE_ACEITO',
        entidade: 'Usuario',
        entidadeId: novoUsuario.id,
        ipAnonimizado,
      },
    });

    return novoUsuario;
  });

  // Cria a sessão de login imediatamente
  const { token: tokenSessao } = await criarSessao({
    usuarioId: resultado.id,
    ipAnonimizado,
    userAgent,
  });

  return {
    sucesso: true,
    usuario: {
      id: resultado.id,
      nome: resultado.nome,
      email: resultado.email,
      papel: resultado.papel,
    },
    tokenSessao,
  };
}
