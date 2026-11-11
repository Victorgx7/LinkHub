'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ContextoTema = createContext({
  tema: 'dark',
  alternarTema: () => {},
  definirTema: () => {},
});

export function ProvedorTema({ children }) {
  const [tema, setTema] = useState('dark');
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // Carregar preferência salva ou padrão 'dark'
    const salvo = localStorage.getItem('linkhub_tema');
    const temaInicial = salvo === 'light' ? 'light' : 'dark';
    
    setTema(temaInicial);
    aplicarClasseTema(temaInicial);
    setMontado(true);
  }, []);

  const aplicarClasseTema = (novoTema) => {
    const root = document.documentElement;
    if (novoTema === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  const alternarTema = () => {
    const novoTema = tema === 'dark' ? 'light' : 'dark';
    setTema(novoTema);
    localStorage.setItem('linkhub_tema', novoTema);
    document.cookie = `linkhub_tema=${novoTema}; path=/; max-age=31536000; SameSite=Lax`;
    aplicarClasseTema(novoTema);
  };

  const definirTema = (novoTema) => {
    if (novoTema !== 'dark' && novoTema !== 'light') return;
    setTema(novoTema);
    localStorage.setItem('linkhub_tema', novoTema);
    document.cookie = `linkhub_tema=${novoTema}; path=/; max-age=31536000; SameSite=Lax`;
    aplicarClasseTema(novoTema);
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema, definirTema, montado }}>
      {children}
    </ContextoTema.Provider>
  );
}

export function useTema() {
  const contexto = useContext(ContextoTema);
  if (!contexto) {
    throw new Error('useTema deve ser utilizado dentro de um ProvedorTema');
  }
  return contexto;
}
