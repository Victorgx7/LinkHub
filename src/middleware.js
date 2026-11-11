import { NextResponse } from 'next/server';
import { NOME_COOKIE_SESSAO } from '@/lib/constantes';

export function middleware(requisicao) {
  const { pathname } = requisicao.nextUrl;
  const tokenSessao = requisicao.cookies.get(NOME_COOKIE_SESSAO)?.value;

  // Proteção do painel administrativo
  if (pathname.startsWith('/admin')) {
    if (!tokenSessao) {
      const urlLogin = new URL('/login', requisicao.url);
      urlLogin.searchParams.set('redirecionar', pathname);
      return NextResponse.redirect(urlLogin);
    }
  }

  // Se já estiver logado e tentar acessar tela de login, redireciona ao painel
  if (pathname === '/login' && tokenSessao) {
    return NextResponse.redirect(new URL('/admin', requisicao.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
