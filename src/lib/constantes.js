/**
 * Constantes globais do LinkHub
 */

export const SLUGS_RESERVADOS = [
  'admin',
  'api',
  'auth',
  'login',
  'logout',
  'convite',
  'recuperar-senha',
  'esqueci-senha',
  'redefinir-senha',
  'cadastro',
  'painel',
  'dashboard',
  'configuracoes',
  'perfil',
  'perfis',
  'usuarios',
  'backups',
  'public',
  'static',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'manifest.json',
  'sw.js',
];

export const PAPEIS_USUARIO = {
  ADMINISTRADOR_PRINCIPAL: 'ADMINISTRADOR_PRINCIPAL',
  PROPRIETARIO: 'PROPRIETARIO',
};

export const PAPEIS_PERFIL = {
  PROPRIETARIO: 'PROPRIETARIO',
  EDITOR: 'EDITOR',
};

export const TEMPO_EXPIRACAO = {
  SESSAO_DIAS: 7,
  SESSAO_SEGUNDOS: 7 * 24 * 60 * 60,
  CONVITE_HORAS: 48,
  RECUPERACAO_SENHA_HORAS: 1,
};

export const NOME_COOKIE_SESSAO = 'linkhub_sessao';
export const NOME_COOKIE_TEMA = 'linkhub_tema';
export const NOME_COOKIE_IDIOMA = 'linkhub_idioma';

export const LIMITES_TAXA_LOGIN = {
  MAXIMO_TENTATIVAS: 5,
  JANELA_BLOQUEIO_MINUTOS: 15,
};
