import { NextResponse } from 'next/server';
import { registrarCliqueLink } from '@/servicos/servicoPerfil';
import { anonimizarIp } from '@/lib/hash';

export async function POST(requisicao) {
  try {
    const corpo = await requisicao.json();
    const { linkId } = corpo;

    if (!linkId) {
      return NextResponse.json({ sucesso: false }, { status: 400 });
    }

    const ip =
      requisicao.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      requisicao.headers.get('x-real-ip') ||
      '127.0.0.1';

    const userAgent = requisicao.headers.get('user-agent') || '';
    const identificadorAnonimo = anonimizarIp(ip);

    let dispositivo = 'DESKTOP';
    if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
      dispositivo = /ipad|tablet/i.test(userAgent) ? 'TABLET' : 'MOBILE';
    }

    let navegador = 'outro';
    if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) navegador = 'chrome';
    else if (/firefox/i.test(userAgent)) navegador = 'firefox';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) navegador = 'safari';
    else if (/edge|edg/i.test(userAgent)) navegador = 'edge';

    await registrarCliqueLink({
      linkId,
      identificadorAnonimo,
      dispositivo,
      navegador,
    });

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error('Falha ao registrar clique de link:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Não foi possível registrar o clique' },
      { status: 500 }
    );
  }
}
