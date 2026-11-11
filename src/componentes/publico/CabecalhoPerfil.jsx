'use client';

import React from 'react';
import Image from 'next/image';
import { QrCode, Share2 } from 'lucide-react';

/**
 * Cabeçalho do Perfil Público com Avatar, Nome, Descrição e Ações Rápidas
 */
export default function CabecalhoPerfil({
  nome,
  descricao,
  fotoUrl,
  configVisual,
  onAbrirQrCode,
  onCompartilhar,
}) {
  const corDestaque = configVisual?.corDestaque || '#B2FF00';
  const corTexto = configVisual?.corTexto || '#FFFFFF';

  const iniciais = nome
    ? nome
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'LH';

  return (
    <div className="flex flex-col items-center text-center w-full mb-8 relative z-10">
      {/* Botões de Ação Rápida no Topo Direito (Compartilhar / QR Code) */}
      <div className="absolute -top-3 right-0 flex items-center gap-2">
        {onCompartilhar && (
          <button
            type="button"
            onClick={onCompartilhar}
            title="Compartilhar perfil"
            className="p-2.5 rounded-full border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white backdrop-blur-md transition-all active:scale-95 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
        {onAbrirQrCode && (
          <button
            type="button"
            onClick={onAbrirQrCode}
            title="Exibir QR Code"
            className="p-2.5 rounded-full border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-neon backdrop-blur-md transition-all active:scale-95 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Foto de Perfil ou Avatar com Inicial */}
      <div className="relative mb-4 group">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-2 transition-transform duration-300 group-hover:scale-105"
          style={{ borderColor: corDestaque, boxShadow: `0 0 25px ${corDestaque}33` }}
        >
          {fotoUrl ? (
            <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-900">
              <Image
                src={fotoUrl}
                alt={nome}
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-2xl tracking-tighter" style={{ color: corDestaque }}>
              {iniciais}
            </div>
          )}
        </div>
      </div>

      {/* Nome do Perfil */}
      <h1
        className="text-2xl sm:text-3xl font-extrabold tracking-tight px-4 max-w-md break-words"
        style={{ color: corTexto }}
      >
        {nome}
      </h1>

      {/* Descrição */}
      {descricao && (
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-sm px-4 leading-relaxed font-normal">
          {descricao}
        </p>
      )}
    </div>
  );
}
