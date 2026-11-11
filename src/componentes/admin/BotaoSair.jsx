'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import BotaoOutline from '@/componentes/ui/BotaoOutline';

export default function BotaoSair() {
  const roteador = useRouter();
  const [saindo, setSaindo] = useState(false);

  const lidarComLogout = async () => {
    setSaindo(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      roteador.push('/login');
      roteador.refresh();
    } catch (erro) {
      console.error('Falha ao sair:', erro);
      setSaindo(false);
    }
  };

  return (
    <BotaoOutline
      variante="padrao"
      tamanho="sm"
      carregando={saindo}
      onClick={lidarComLogout}
      icone={<LogOut className="w-3.5 h-3.5" />}
    >
      Sair
    </BotaoOutline>
  );
}
