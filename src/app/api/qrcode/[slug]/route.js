import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

/**
 * Route Handler para geração dinâmica de QR Code por slug.
 * Suporta dois formatos: SVG (padrão, inline) e PNG (para download).
 * 
 * GET /api/qrcode/[slug]        → retorna SVG inline para exibição
 * GET /api/qrcode/[slug]?formato=png → retorna PNG para download
 */
export async function GET(requisicao, { params }) {
  const { slug } = await params;
  const urlParams = new URL(requisicao.url).searchParams;
  const formato = urlParams.get('formato') || 'svg';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const urlPerfil = `${appUrl}/${slug}`;

  const opcoes = {
    errorCorrectionLevel: 'M',
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  try {
    if (formato === 'png') {
      const buffer = await QRCode.toBuffer(urlPerfil, { ...opcoes, type: 'png', width: 400 });
      return new Response(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="qrcode-${slug}.png"`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Formato padrão: SVG
    const svgString = await QRCode.toString(urlPerfil, { ...opcoes, type: 'svg' });
    return new Response(svgString, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (erro) {
    console.error('Falha ao gerar QR Code:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Falha ao gerar QR Code' },
      { status: 500 }
    );
  }
}
