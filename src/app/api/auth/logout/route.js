import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { NOME_COOKIE_SESSAO } from '@/lib/constantes';
import { destruirSessao } from '@/servicos/servicoAutenticacao';
import { removerCookieSessao } from '@/lib/sessao';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(NOME_COOKIE_SESSAO)?.value;

    if (token) {
      await destruirSessao(token);
    }

    await removerCookieSessao(cookieStore);

    return NextResponse.json({ sucesso: true, mensagem: 'Sessão encerrada com sucesso' });
  } catch (erro) {
    console.error('Erro no logout:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Falha ao encerrar sessão' },
      { status: 500 }
    );
  }
}
