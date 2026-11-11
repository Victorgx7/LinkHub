import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BotaoOutline from '@/componentes/ui/BotaoOutline';

describe('Componente BotaoOutline', () => {
  it('deve renderizar o texto do botão corretamente', () => {
    render(<BotaoOutline>Clique aqui</BotaoOutline>);
    expect(screen.getByRole('button', { name: /Clique aqui/i })).toBeInTheDocument();
  });

  it('deve aplicar as classes da variante neon', () => {
    render(<BotaoOutline variante="neon">Botão Neon</BotaoOutline>);
    const botao = screen.getByRole('button', { name: /Botão Neon/i });
    expect(botao.className).toContain('text-neon');
    expect(botao.className).toContain('border-neon/40');
  });

  it('deve disparar a função onClick quando clicado', () => {
    const dispararClique = vi.fn();
    render(<BotaoOutline onClick={dispararClique}>Ação</BotaoOutline>);
    
    fireEvent.click(screen.getByRole('button', { name: /Ação/i }));
    expect(dispararClique).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar e não disparar eventos quando desabilitado', () => {
    const dispararClique = vi.fn();
    render(<BotaoOutline desabilitado onClick={dispararClique}>Desabilitado</BotaoOutline>);
    
    const botao = screen.getByRole('button');
    expect(botao).toBeDisabled();
    fireEvent.click(botao);
    expect(dispararClique).not.toHaveBeenCalled();
  });

  it('deve exibir indicador de carregamento e desabilitar quando carregando for verdadeiro', () => {
    render(<BotaoOutline carregando>Salvar</BotaoOutline>);
    const botao = screen.getByRole('button');
    expect(botao).toBeDisabled();
    expect(botao.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
