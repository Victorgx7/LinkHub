import { cookies } from 'next/headers';
import { NOME_COOKIE_SESSAO, TEMPO_EXPIRACAO } from '@/lib/constantes';
import { validarSessao } from '@/servicos/servicoAutenticacao';

/**
 * Obtém os dados da sessão e usuário autenticado a partir dos cookies da requisição no servidor.
 * 
 * @returns {Promise<{ usuario: Object, sessaoId: string } | null>}
 */
export async function obterSessaoServidor() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOME_COOKIE_SESSAO)?.value;

  if (!token) return null;

  return await validarSessao(token);
}

/**
 * Define o cookie de sessão HTTP-Only seguro.
 * 
 * @param {import('next/headers').ReadonlyRequestCookies} cookieStore
 * @param {string} token - Token bruto gerado
 */
export async function definirCookieSessao(cookieStore, token) {
  cookieStore.set({
    name: NOME_COOKIE_SESSAO,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TEMPO_EXPIRACAO.SESSAO_SEGUNDOS,
  });
}

/**
 * Remove o cookie de sessão do navegador.
 * 
 * @param {import('next/headers').ReadonlyRequestCookies} cookieStore
 */
export async function removerCookieSessao(cookieStore) {
  cookieStore.delete(NOME_COOKIE_SESSAO);
}
