import prisma from '@/lib/prisma';
import { gerarTokenAleatorio, gerarHashToken, gerarHashSenha } from '@/lib/hash';
import { TEMPO_EXPIRACAO } from '@/lib/constantes';
import { enviarEmailRecuperacaoSenha } from '@/servicos/servicoEmail';
import { revogarTodasSessoes } from '@/servicos/servicoAutenticacao';

/**
 * Solicita a recuperação de senha por e-mail.
 * Para proteção contra enumeração de usuários, responde com sucesso genérico mesmo se o e-mail não existir.
 * 
 * @param {string} email - E-mail do usuário
 * @param {string} [appUrl] - URL base da aplicação
 */
export async function solicitarRecuperacaoSenha(email, appUrl = 'http://localhost:3000') {
  const usuario = await prisma.usuario.findFirst({
    where: { email: email.toLowerCase(), excluidoEm: null, ativo: true },
  });

  if (!usuario) {
    // Retorna mensagem positiva para evitar enumeração de contas
    return {
      sucesso: true,
      mensagem: 'Se o e-mail informado estiver cadastrado, as instruções serão enviadas.',
    };
  }

  // Invalida tokens anteriores não utilizados deste usuário
  await prisma.tokenRecuperacaoSenha.updateMany({
    where: { usuarioId: usuario.id, usado: false },
    data: { usado: true },
  });

  const token = gerarTokenAleatorio(32);
  const tokenHash = gerarHashToken(token);
  const expiraEm = new Date(Date.now() + TEMPO_EXPIRACAO.RECUPERACAO_SENHA_HORAS * 60 * 60 * 1000);

  await prisma.tokenRecuperacaoSenha.create({
    data: {
      usuarioId: usuario.id,
      tokenHash,
      expiraEm,
    },
  });

  const linkRecuperacao = `${appUrl}/recuperar-senha/${token}`;

  await enviarEmailRecuperacaoSenha({
    para: usuario.email,
    linkRecuperacao,
  });

  await prisma.registroAuditoria.create({
    data: {
      usuarioId: usuario.id,
      acao: 'SOLICITACAO_RECUPERACAO_SENHA',
      entidade: 'Usuario',
      entidadeId: usuario.id,
    },
  });

  return {
    sucesso: true,
    mensagem: 'Se o e-mail informado estiver cadastrado, as instruções serão enviadas.',
  };
}

/**
 * Valida se um token de recuperação de senha é válido e ainda não expirou.
 */
export async function validarTokenRecuperacao(token) {
  if (!token) return { valido: false, erro: 'Token inválido' };

  const tokenHash = gerarHashToken(token);

  const registroToken = await prisma.tokenRecuperacaoSenha.findUnique({
    where: { tokenHash },
    include: { usuario: true },
  });

  if (!registroToken) {
    return { valido: false, erro: 'Token de recuperação não encontrado' };
  }

  if (registroToken.usado) {
    return { valido: false, erro: 'Este link de recuperação já foi utilizado' };
  }

  if (new Date() > registroToken.expiraEm) {
    return { valido: false, erro: 'Este link expirou. Solicite um novo link.' };
  }

  return {
    valido: true,
    email: registroToken.usuario.email,
  };
}

/**
 * Redefine a senha com base no token fornecido e revoga todas as sessões anteriores por segurança.
 */
export async function redefinirSenhaComToken({ token, novaSenha }) {
  const validacao = await validarTokenRecuperacao(token);
  if (!validacao.valido) {
    return { sucesso: false, erro: validacao.erro };
  }

  const tokenHash = gerarHashToken(token);
  const registroToken = await prisma.tokenRecuperacaoSenha.findUnique({
    where: { tokenHash },
  });

  const senhaHash = await gerarHashSenha(novaSenha);

  await prisma.$transaction([
    // Atualiza a senha
    prisma.usuario.update({
      where: { id: registroToken.usuarioId },
      data: { senhaHash },
    }),
    // Marca o token como utilizado
    prisma.tokenRecuperacaoSenha.update({
      where: { id: registroToken.id },
      data: { usado: true },
    }),
    // Registra a auditoria
    prisma.registroAuditoria.create({
      data: {
        usuarioId: registroToken.usuarioId,
        acao: 'SENHA_REDEFINIDA',
        entidade: 'Usuario',
        entidadeId: registroToken.usuarioId,
      },
    }),
  ]);

  // Revoga todas as sessões ativas do usuário para forçar novo login com a nova senha
  await revogarTodasSessoes(registroToken.usuarioId);

  return { sucesso: true };
}
