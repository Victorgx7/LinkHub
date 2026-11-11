import { describe, it, expect } from 'vitest';
import {
  gerarHashSenha,
  verificarSenha,
  gerarTokenAleatorio,
  gerarHashToken,
  anonimizarIp,
} from '@/lib/hash';

describe('Módulo Criptográfico e de Hashing (lib/hash)', () => {
  it('deve gerar um hash Argon2id válido e verificar a senha com sucesso', async () => {
    const senhaOriginal = 'SenhaSuperSecreta2026!';
    const hash = await gerarHashSenha(senhaOriginal);

    expect(hash).toBeDefined();
    expect(hash).toContain('$argon2id$');

    const coincide = await verificarSenha(senhaOriginal, hash);
    expect(coincide).toBe(true);

    const senhaIncorreta = await verificarSenha('SenhaErrada123', hash);
    expect(senhaIncorreta).toBe(false);
  });

  it('deve gerar tokens aleatórios em formato hexadecimal de tamanho correto', () => {
    const token = gerarTokenAleatorio(32);
    expect(token).toBeDefined();
    expect(token.length).toBe(64); // 32 bytes em hex = 64 chars
  });

  it('deve gerar hash SHA-256 consistente para um mesmo token', () => {
    const token = 'meu_token_de_teste';
    const hash1 = gerarHashToken(token);
    const hash2 = gerarHashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('deve anonimizar IP gerando hash unidirecional para conformidade com a LGPD', () => {
    const ip = '189.40.12.55';
    const anonimizado = anonimizarIp(ip, 'segredo-de-teste');

    expect(anonimizado).not.toBe(ip);
    expect(anonimizado.length).toBe(32);
  });
});
