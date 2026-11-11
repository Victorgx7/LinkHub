import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { esquemaLogin } from '@/lib/validadores';
import { autenticarComSenha } from '@/servicos/servicoAutenticacao';
import { definirCookieSessao } from '@/lib/sessao';
import { anonimizarIp } from '@/lib/hash';

export async function POST(requisicao) {
  try {
    const corpo = await requisicao.json();
    const validacao = esquemaLogin.safeParse(corpo);

    if (!validacao.success) {
      return NextResponse.json(
        { sucesso: false, erro: validacao.error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      );
    }

    const { email, senha } = validacao.data;
    const ip =
      requisicao.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      requisicao.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = requisicao.headers.get('user-agent') || 'desconhecido';
    const ipAnonimizado = anonimizarIp(ip);

    const resultado = await autenticarComSenha({
      email,
      senha,
      ipAnonimizado,
      userAgent,
    });

    if (!resultado.sucesso) {
      return NextResponse.json(
        { sucesso: false, erro: resultado.erro },
        { status: 401 }
      );
    }

    // Define o cookie de sessão seguro HttpOnly
    const cookieStore = await cookies();
    await definirCookieSessao(cookieStore, resultado.tokenSessao);

    return NextResponse.json({
      sucesso: true,
      usuario: resultado.usuario,
    });
  } catch (erro) {
    console.error('Erro no endpoint de login:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro interno do servidor ao processar autenticação' },
      { status: 500 }
    );
  }
}
