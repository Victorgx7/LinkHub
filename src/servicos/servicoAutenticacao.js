import prisma from '@/lib/prisma';
import { verificarSenha, gerarTokenAleatorio, gerarHashToken } from '@/lib/hash';
import { TEMPO_EXPIRACAO, LIMITES_TAXA_LOGIN } from '@/lib/constantes';

// Armazenamento em memória para controle de tentativas excessivas de login (Rate Limiting)
const tentativasFalhas = new Map();

/**
 * Verifica se um determinado identificador (IP ou e-mail) excedeu o limite de tentativas.
 * 
 * @param {string} identificador - Chave de rastreamento
 * @returns {{ bloqueado: boolean, minutosRestantes?: number }}
 */
export function verificarLimiteTentativas(identificador) {
  const agora = Date.now();
  const registro = tentativasFalhas.get(identificador);

  if (!registro) return { bloqueado: false };

  // Se o período de bloqueio já expirou, limpa o registro
  if (agora - registro.primeiraTentativa > LIMITES_TAXA_LOGIN.JANELA_BLOQUEIO_MINUTOS * 60 * 1000) {
    tentativasFalhas.delete(identificador);
    return { bloqueado: false };
  }

  if (registro.contagem >= LIMITES_TAXA_LOGIN.MAXIMO_TENTATIVAS) {
    const tempoRestanteMs =
      LIMITES_TAXA_LOGIN.JANELA_BLOQUEIO_MINUTOS * 60 * 1000 - (agora - registro.primeiraTentativa);
    const minutosRestantes = Math.ceil(tempoRestanteMs / (60 * 1000));
    return { bloqueado: true, minutosRestantes };
  }

  return { bloqueado: false };
}

/**
 * Registra uma tentativa falha de autenticação.
 */
export function registrarTentativaFalha(identificador) {
  const agora = Date.now();
  const registro = tentativasFalhas.get(identificador) || { contagem: 0, primeiraTentativa: agora };
  registro.contagem += 1;
  tentativasFalhas.set(identificador, registro);
}

/**
 * Limpa o histórico de tentativas após sucesso.
 */
export function limparTentativasFalhas(identificador) {
  tentativasFalhas.delete(identificador);
}

/**
 * Autentica o usuário validando e-mail, senha com Argon2id e status de exclusão lógica.
 * 
 * @param {Object} params
 * @param {string} params.email - E-mail do usuário
 * @param {string} params.senha - Senha em texto puro
 * @param {string} [params.ipAnonimizado] - Identificador anônimo do IP
 * @param {string} [params.userAgent] - Navegador
 * @returns {Promise<{ sucesso: boolean, usuario?: Object, tokenSessao?: string, erro?: string }>}
 */
export async function autenticarComSenha({ email, senha, ipAnonimizado, userAgent }) {
  const chaveTaxa = `${email.toLowerCase()}-${ipAnonimizado || 'global'}`;
  const statusLimite = verificarLimiteTentativas(chaveTaxa);

  if (statusLimite.bloqueado) {
    return {
      sucesso: false,
      erro: `Muitas tentativas incorretas. Tente novamente em ${statusLimite.minutosRestantes} minutos.`,
    };
  }

  const usuario = await prisma.usuario.findFirst({
    where: {
      email: email.toLowerCase(),
      excluidoEm: null,
    },
  });

  if (!usuario || !usuario.ativo) {
    registrarTentativaFalha(chaveTaxa);
    return { sucesso: false, erro: 'E-mail ou senha incorretos' };
  }

  const senhaValida = await verificarSenha(senha, usuario.senhaHash);
  if (!senhaValida) {
    registrarTentativaFalha(chaveTaxa);
    return { sucesso: false, erro: 'E-mail ou senha incorretos' };
  }

  // Login bem-sucedido: limpa o contador de tentativas
  limparTentativasFalhas(chaveTaxa);

  // Cria a nova sessão no banco de dados
  const { token, sessao } = await criarSessao({
    usuarioId: usuario.id,
    ipAnonimizado,
    userAgent,
  });

  // Registra auditoria
  await prisma.registroAuditoria.create({
    data: {
      usuarioId: usuario.id,
      acao: 'LOGIN_SUCESSO',
      entidade: 'Usuario',
      entidadeId: usuario.id,
      ipAnonimizado,
    },
  });

  return {
    sucesso: true,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      limitePerfis: usuario.limitePerfis,
    },
    tokenSessao: token,
  };
}

/**
 * Cria uma sessão no banco com token criptograficamente seguro e expiração de 7 dias.
 */
export async function criarSessao({ usuarioId, ipAnonimizado, userAgent }) {
  const token = gerarTokenAleatorio(32);
  const tokenHash = gerarHashToken(token);
  const expiraEm = new Date(Date.now() + TEMPO_EXPIRACAO.SESSAO_SEGUNDOS * 1000);

  const sessao = await prisma.sessao.create({
    data: {
      usuarioId,
      tokenHash,
      ipAnonimizado,
      userAgent: userAgent ? userAgent.slice(0, 255) : null,
      expiraEm,
    },
  });

  return { token, sessao };
}

/**
 * Valida o token de sessão, verifica data de validade e recupera o usuário ativo.
 * 
 * @param {string} token - Token bruto recebido no cookie
 * @returns {Promise<Object|null>} Usuário e permissões ou null se inválido
 */
export async function validarSessao(token) {
  if (!token) return null;

  const tokenHash = gerarHashToken(token);

  const sessao = await prisma.sessao.findUnique({
    where: { tokenHash },
    include: {
      usuario: {
        include: {
          permissoes: {
            include: {
              perfil: true,
            },
          },
        },
      },
    },
  });

  if (!sessao) return null;

  // Verifica se a sessão expirou
  if (new Date() > sessao.expiraEm) {
    await prisma.sessao.delete({ where: { id: sessao.id } }).catch(() => {});
    return null;
  }

  // Verifica se o usuário foi desativado ou sofreu soft-delete
  if (!sessao.usuario || !sessao.usuario.ativo || sessao.usuario.excluidoEm !== null) {
    return null;
  }

  return {
    sessaoId: sessao.id,
    expiraEm: sessao.expiraEm,
    usuario: sessao.usuario,
  };
}

/**
 * Encerra uma sessão específica excluindo-a do banco de dados (Logout).
 */
export async function destruirSessao(token) {
  if (!token) return false;
  const tokenHash = gerarHashToken(token);
  try {
    await prisma.sessao.deleteMany({ where: { tokenHash } });
    return true;
  } catch (erro) {
    return false;
  }
}

/**
 * Revoga todas as sessões ativas de um usuário (ex: troca de senha ou ação do admin).
 */
export async function revogarTodasSessoes(usuarioId) {
  if (!usuarioId) return 0;
  const resultado = await prisma.sessao.deleteMany({
    where: { usuarioId },
  });
  return resultado.count;
}
