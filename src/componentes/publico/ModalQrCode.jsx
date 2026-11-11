'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, QrCode } from 'lucide-react';

/**
 * Modal flutuante com Glassmorphism para exibição e download do QR Code do perfil.
 * O QR Code é gerado pelo Route Handler /api/qrcode/[slug] que retorna um SVG.
 */
export default function ModalQrCode({ slug, nome, corDestaque = '#B2FF00', aberto, aoFechar }) {
  const [urlQrCode, setUrlQrCode] = useState('');

  useEffect(() => {
    if (aberto && slug) {
      setUrlQrCode(`/api/qrcode/${slug}`);
    }
  }, [aberto, slug]);

  if (!aberto) return null;

  const baixarQrCode = async () => {
    try {
      const resposta = await fetch(`/api/qrcode/${slug}?formato=png`);
      const blob = await resposta.blob();
      const urlBlob = URL.createObjectURL(blob);
      const ancora = document.createElement('a');
      ancora.href = urlBlob;
      ancora.download = `qrcode-${slug}.png`;
      ancora.click();
      URL.revokeObjectURL(urlBlob);
    } catch (erro) {
      console.error('Falha ao baixar QR Code:', erro);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={aoFechar}
    >
      {/* Overlay escurecido */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card Modal Glassmorphism */}
      <div
        className="relative z-10 w-full max-w-xs rounded-2xl vidro p-6 flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={aoFechar}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Título */}
        <div className="flex items-center gap-2 mt-1">
          <QrCode className="w-5 h-5" style={{ color: corDestaque }} />
          <h3 className="text-base font-bold text-white">QR Code — {nome}</h3>
        </div>

        {/* Imagem do QR Code */}
        <div className="p-4 rounded-2xl bg-white shadow-lg border border-white/10">
          {urlQrCode ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlQrCode}
              alt={`QR Code de ${nome}`}
              width={180}
              height={180}
              className="rounded-lg"
            />
          ) : (
            <div className="w-[180px] h-[180px] bg-zinc-200 animate-pulse rounded-lg" />
          )}
        </div>

        <p className="text-xs text-zinc-400 text-center max-w-[200px] leading-relaxed">
          Aponte a câmera do celular para acessar o perfil diretamente
        </p>

        {/* Botão Download */}
        <button
          type="button"
          onClick={baixarQrCode}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-[0.98]"
          style={{
            borderColor: corDestaque,
            color: corDestaque,
            background: `${corDestaque}12`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${corDestaque}25`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${corDestaque}12`;
          }}
        >
          <Download className="w-4 h-4" />
          Baixar QR Code (PNG)
        </button>
      </div>
    </div>
  );
}
