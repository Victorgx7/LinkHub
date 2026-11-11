import { describe, it, expect, beforeEach } from 'vitest';
import {
  verificarLimiteTentativas,
  registrarTentativaFalha,
  limparTentativasFalhas,
} from '@/servicos/servicoAutenticacao';

describe('Serviço de Autenticação — Rate Limiting e Proteção Contra Força Bruta', () => {
  const identificador = 'teste-usuario-bloqueio@email.com';

  beforeEach(() => {
    limparTentativasFalhas(identificador);
  });

  it('deve permitir autenticação inicial sem bloqueio', () => {
    const status = verificarLimiteTentativas(identificador);
    expect(status.bloqueado).toBe(false);
  });

  it('deve bloquear após exceder 5 tentativas consecutivas com falha', () => {
    // 4 tentativas com falha ainda não devem bloquear
    for (let i = 0; i < 4; i++) {
      registrarTentativaFalha(identificador);
    }
    expect(verificarLimiteTentativas(identificador).bloqueado).toBe(false);

    // 5ª tentativa deve acionar o bloqueio
    registrarTentativaFalha(identificador);
    const statusBloqueado = verificarLimiteTentativas(identificador);

    expect(statusBloqueado.bloqueado).toBe(true);
    expect(statusBloqueado.minutosRestantes).toBeGreaterThan(0);
  });

  it('deve zerar o contador após limpeza com sucesso no login', () => {
    registrarTentativaFalha(identificador);
    registrarTentativaFalha(identificador);

    limparTentativasFalhas(identificador);
    expect(verificarLimiteTentativas(identificador).bloqueado).toBe(false);
  });
});
