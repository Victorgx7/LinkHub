import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlternadorTema from '@/componentes/ui/AlternadorTema';
import { ProvedorTema } from '@/contextos/ContextoTema';

describe('Componente AlternadorTema', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('deve alternar entre tema escuro e claro ao clicar', () => {
    render(
      <ProvedorTema>
        <AlternadorTema />
      </ProvedorTema>
    );

    const botao = screen.getByRole('button');
    expect(botao).toHaveAttribute('aria-label', 'Mudar para modo claro');

    fireEvent.click(botao);
    expect(botao).toHaveAttribute('aria-label', 'Mudar para modo escuro');
    expect(localStorage.getItem('linkhub_tema')).toBe('light');

    fireEvent.click(botao);
    expect(botao).toHaveAttribute('aria-label', 'Mudar para modo claro');
    expect(localStorage.getItem('linkhub_tema')).toBe('dark');
  });
});
