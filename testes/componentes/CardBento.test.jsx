import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardBento from '@/componentes/ui/CardBento';

describe('Componente CardBento', () => {
  it('deve renderizar título e subtítulo no cabeçalho', () => {
    render(
      <CardBento titulo="Visualizações" subtitulo="Total de acessos da semana">
        <div>Conteúdo interno</div>
      </CardBento>
    );

    expect(screen.getByText('Visualizações')).toBeInTheDocument();
    expect(screen.getByText('Total de acessos da semana')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument();
  });

  it('deve aplicar colSpan personalizado', () => {
    const { container } = render(
      <CardBento colSpan="md:col-span-2">
        <span>Conteúdo</span>
      </CardBento>
    );

    expect(container.firstChild.className).toContain('md:col-span-2');
  });
});
