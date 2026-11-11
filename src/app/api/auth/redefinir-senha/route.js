import { NextResponse } from 'next/server';
import { esquemaRedefinirSenha } from '@/lib/validadores';
import { redefinirSenhaComToken } from '@/servicos/servicoRecuperacaoSenha';

export async function POST(requisicao) {
  try {
    const corpo = await requisicao.json();
    const { token, senha } = corpo;

    if (!token) {
      return NextResponse.json(
        { sucesso: false, erro: 'Token não fornecido' },
        { status: 400 }
      );
    }

    const validacao = esquemaRedefinirSenha.safeParse({ senha });
    if (!validacao.success) {
      return NextResponse.json(
        { sucesso: false, erro: validacao.error.errors[0]?.message || 'Senha inválida' },
        { status: 400 }
      );
    }

    const resultado = await redefinirSenhaComToken({
      token,
      novaSenha: validacao.data.senha,
    });

    if (!resultado.sucesso) {
      return NextResponse.json({ sucesso: false, erro: resultado.erro }, { status: 400 });
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Senha redefinida com sucesso. Faça login com suas novas credenciais.',
    });
  } catch (erro) {
    console.error('Erro na redefinição de senha:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Falha interna ao redefinir senha' },
      { status: 500 }
    );
  }
}
