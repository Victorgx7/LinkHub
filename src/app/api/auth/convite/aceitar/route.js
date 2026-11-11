import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { esquemaAceitarConvite } from '@/lib/validadores';
import { aceitarConviteECadastrar } from '@/servicos/servicoConvite';
import { definirCookieSessao } from '@/lib/sessao';
import { anonimizarIp } from '@/lib/hash';

export async function POST(requisicao) {
  try {
    const corpo = await requisicao.json();
    const { token, ...dadosFormulario } = corpo;

    if (!token) {
      return NextResponse.json(
        { sucesso: false, erro: 'Token de convite não fornecido' },
        { status: 400 }
      );
    }

    const validacao = esquemaAceitarConvite.safeParse(dadosFormulario);
    if (!validacao.success) {
      return NextResponse.json(
        { sucesso: false, erro: validacao.error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      );
    }

    const ip =
      requisicao.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      requisicao.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = requisicao.headers.get('user-agent') || 'desconhecido';
    const ipAnonimizado = anonimizarIp(ip);

    const resultado = await aceitarConviteECadastrar({
      token,
      nome: validacao.data.nome,
      senha: validacao.data.senha,
      userAgent,
      ipAnonimizado,
    });

    if (!resultado.sucesso) {
      return NextResponse.json({ sucesso: false, erro: resultado.erro }, { status: 400 });
    }

    // Salva o cookie de sessão para o usuário já entrar logado
    const cookieStore = await cookies();
    await definirCookieSessao(cookieStore, resultado.tokenSessao);

    return NextResponse.json({
      sucesso: true,
      usuario: resultado.usuario,
    });
  } catch (erro) {
    console.error('Erro ao aceitar convite:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Falha interna ao processar aceite de convite' },
      { status: 500 }
    );
  }
}
