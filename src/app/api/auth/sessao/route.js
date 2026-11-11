import { NextResponse } from 'next/server';
import { obterSessaoServidor } from '@/lib/sessao';

export async function GET() {
  try {
    const dadosSessao = await obterSessaoServidor();

    if (!dadosSessao) {
      return NextResponse.json({ autenticado: false }, { status: 401 });
    }

    const { usuario } = dadosSessao;

    return NextResponse.json({
      autenticado: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        limitePerfis: usuario.limitePerfis,
        permissoes: usuario.permissoes.map((p) => ({
          perfilId: p.perfilId,
          papel: p.papel,
          perfilSlug: p.perfil.slug,
          perfilNome: p.perfil.nome,
        })),
      },
    });
  } catch (erro) {
    console.error('Erro ao verificar sessão:', erro);
    return NextResponse.json({ autenticado: false }, { status: 500 });
  }
}
