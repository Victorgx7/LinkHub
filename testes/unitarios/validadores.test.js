import { describe, it, expect } from 'vitest';
import {
  esquemaLogin,
  esquemaAceitarConvite,
  esquemaPerfil,
} from '@/lib/validadores';

describe('Validações de Entrada Zod (lib/validadores)', () => {
  it('deve validar credenciais de login corretas', () => {
    const dados = { email: 'contato@empresa.com', senha: 'MinhaSenha123' };
    const resultado = esquemaLogin.safeParse(dados);
    expect(resultado.success).toBe(true);
  });

  it('deve rejeitar e-mails inválidos no login', () => {
    const dados = { email: 'email_sem_arroba', senha: '123' };
    const resultado = esquemaLogin.safeParse(dados);
    expect(resultado.success).toBe(false);
  });

  it('deve validar requisitos de senha forte no aceite de convite', () => {
    // Falta número e maiúscula
    const fraca = esquemaAceitarConvite.safeParse({ nome: 'João', senha: 'fraca' });
    expect(fraca.success).toBe(false);

    // Senha com 8+ chars, maiúscula, minúscula e número
    const forte = esquemaAceitarConvite.safeParse({ nome: 'João Silva', senha: 'SenhaForte2026!' });
    expect(forte.success).toBe(true);
  });

  it('deve bloquear slugs reservados do sistema para novos perfis', () => {
    const perfilReservado = esquemaPerfil.safeParse({
      slug: 'admin',
      nome: 'Meu Perfil',
    });
    expect(perfilReservado.success).toBe(false);
    expect(perfilReservado.error.errors[0].message).toContain('reservado');

    const perfilPermitido = esquemaPerfil.safeParse({
      slug: 'meu-negocio-online',
      nome: 'Meu Negócio',
    });
    expect(perfilPermitido.success).toBe(true);
  });
});
