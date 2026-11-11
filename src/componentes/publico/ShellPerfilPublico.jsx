'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CabecalhoPerfil from '@/componentes/publico/CabecalhoPerfil';
import BotaoLinkPublico from '@/componentes/publico/BotaoLinkPublico';
import ModalQrCode from '@/componentes/publico/ModalQrCode';

/**
 * Shell interativo do perfil público (Client Component).
 * Recebe os dados do perfil via Server Component pai e gerencia o estado do modal QR Code.
 */
export default function ShellPerfilPublico({ perfil, configVisual }) {
  const [modalQrCodeAberto, setModalQrCodeAberto] = useState(false);

  const lidarComCompartilhar = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: perfil.nome,
          text: perfil.descricao || `Confira o perfil de ${perfil.nome}`,
          url: window.location.href,
        });
      } catch (_) {
        // Usuário cancelou o compartilhamento nativo
      }
    } else {
      // Fallback: copiar URL para a área de transferência
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const corFundo = configVisual?.corFundo || '#09090B';
  const corDestaque = configVisual?.corDestaque || '#B2FF00';
  const corTexto = configVisual?.corTexto || '#FFFFFF';
  const efeitoAurora = configVisual?.efeitoAurora !== false;

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: corFundo, color: corTexto }}
    >
      {/* Aurora atmosférico customizável por perfil */}
      {efeitoAurora && (
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-15"
            style={{ backgroundColor: corDestaque }}
          />
          <div
            className="absolute bottom-0 right-0 w-[300px] h-[200px] rounded-full blur-[100px] opacity-8"
            style={{ backgroundColor: corDestaque }}
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex-1 w-full max-w-md mx-auto px-4 pt-14 pb-20">
        <CabecalhoPerfil
          nome={perfil.nome}
          descricao={perfil.descricao}
          fotoUrl={perfil.fotoUrl}
          configVisual={configVisual}
          onAbrirQrCode={() => setModalQrCodeAberto(true)}
          onCompartilhar={lidarComCompartilhar}
        />

        {/* Lista de Links */}
        <div className="flex flex-col gap-3 w-full">
          {perfil.links.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: `${corTexto}60` }}>
                Nenhum link disponível no momento.
              </p>
            </div>
          ) : (
            perfil.links.map((link) => (
              <BotaoLinkPublico
                key={link.id}
                link={link}
                configVisual={configVisual}
              />
            ))
          )}
        </div>

        {/* Rodapé LinkHub */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="text-xs font-medium transition-opacity hover:opacity-80"
            style={{ color: `${corTexto}50` }}
          >
            Criado com{' '}
            <span className="font-bold" style={{ color: corDestaque }}>
              LinkHub
            </span>
          </Link>
        </div>
      </main>

      {/* Modal QR Code */}
      <ModalQrCode
        slug={perfil.slug}
        nome={perfil.nome}
        corDestaque={corDestaque}
        aberto={modalQrCodeAberto}
        aoFechar={() => setModalQrCodeAberto(false)}
      />
    </div>
  );
}
