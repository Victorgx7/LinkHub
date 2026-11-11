import { describe, it, expect, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import {
  autenticarComSenha,
  validarSessao,
  destruirSessao,
} from '@/servicos/servicoAutenticacao';

const emailAdmin = process.env.ADMIN_EMAIL;
const senhaAdmin = process.env.ADMIN_PASSWORD;

describe.skipIf(!emailAdmin || !senhaAdmin)('Integração de Autenticação Real com MySQL (Prisma)', () => {
  let tokenCriado = null;

  afterAll(async () => {
    if (tokenCriado) {
      await destruirSessao(tokenCriado);
    }
    await prisma.$disconnect();
  });

  it('deve autenticar o Administrador Principal criado pelo seed', async () => {
    const resultado = await autenticarComSenha({
      email: emailAdmin,
      senha: senhaAdmin,
      ipAnonimizado: 'ip-teste-unitario',
      userAgent: 'Vitest Agent',
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.usuario).toBeDefined();
    expect(resultado.usuario.email).toBe(emailAdmin);
    expect(resultado.usuario.papel).toBe('ADMINISTRADOR_PRINCIPAL');
    expect(resultado.tokenSessao).toBeDefined();

    tokenCriado = resultado.tokenSessao;
  });

  it('deve validar a sessão ativa no banco a partir do token gerado', async () => {
    expect(tokenCriado).not.toBeNull();

    const dadosSessao = await validarSessao(tokenCriado);
    expect(dadosSessao).not.toBeNull();
    expect(dadosSessao.usuario.email).toBe(emailAdmin);
    expect(new Date(dadosSessao.expiraEm).getTime()).toBeGreaterThan(Date.now());
  });

  it('deve rejeitar tentativa com senha incorreta', async () => {
    const resultado = await autenticarComSenha({
      email: emailAdmin,
      senha: 'SenhaErradaTotalmenteInvalida',
      ipAnonimizado: 'ip-teste-falha',
      userAgent: 'Vitest Agent',
    });

    expect(resultado.sucesso).toBe(false);
    expect(resultado.erro).toBe('E-mail ou senha incorretos');
  });

  it('deve encerrar a sessão e purgar do banco no logout', async () => {
    expect(tokenCriado).not.toBeNull();

    const destruido = await destruirSessao(tokenCriado);
    expect(destruido).toBe(true);

    const sessaoAposLogout = await validarSessao(tokenCriado);
    expect(sessaoAposLogout).toBeNull();
  });
});
