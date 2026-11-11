import { NextResponse } from 'next/server';
import { esquemaSolicitarRecuperacao } from '@/lib/validadores';
import { solicitarRecuperacaoSenha } from '@/servicos/servicoRecuperacaoSenha';

export async function POST(requisicao) {
  try {
    const corpo = await requisicao.json();
    const validacao = esquemaSolicitarRecuperacao.safeParse(corpo);

    if (!validacao.success) {
      return NextResponse.json(
        { sucesso: false, erro: validacao.error.errors[0]?.message || 'E-mail inválido' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resultado = await solicitarRecuperacaoSenha(validacao.data.email, appUrl);

    return NextResponse.json(resultado);
  } catch (erro) {
    console.error('Erro na solicitação de recuperação de senha:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Falha interna ao processar recuperação de senha' },
      { status: 500 }
    );
  }
}
