import { describe, it, expect } from 'vitest';
import { detectarServicoPorUrl, formatarUrl } from '@/lib/redesSociais.js';

describe('detectarServicoPorUrl', () => {
  it('deve detectar Instagram e retornar objeto com id correto', () => {
    const resultado = detectarServicoPorUrl('https://instagram.com/usuario');
    expect(resultado.id).toBe('instagram');
    expect(resultado.nome).toBe('Instagram');
    expect(resultado.icone).toBeTruthy();
  });

  it('deve detectar Instagram com www', () => {
    expect(detectarServicoPorUrl('https://www.instagram.com/teste').id).toBe('instagram');
  });

  it('deve detectar WhatsApp via wa.me', () => {
    expect(detectarServicoPorUrl('https://wa.me/5511999999999').id).toBe('whatsapp');
  });

  it('deve detectar WhatsApp via whatsapp.com', () => {
    expect(detectarServicoPorUrl('https://whatsapp.com/send?phone=5511').id).toBe('whatsapp');
  });

  it('deve detectar LinkedIn', () => {
    expect(detectarServicoPorUrl('https://linkedin.com/in/usuario').id).toBe('linkedin');
    expect(detectarServicoPorUrl('https://www.linkedin.com/company/empresa').id).toBe('linkedin');
  });

  it('deve detectar GitHub', () => {
    expect(detectarServicoPorUrl('https://github.com/usuario').id).toBe('github');
  });

  it('deve detectar YouTube via youtube.com', () => {
    expect(detectarServicoPorUrl('https://youtube.com/c/canal').id).toBe('youtube');
  });

  it('deve detectar YouTube via youtu.be', () => {
    expect(detectarServicoPorUrl('https://youtu.be/abc123').id).toBe('youtube');
  });

  it('deve detectar TikTok', () => {
    expect(detectarServicoPorUrl('https://tiktok.com/@usuario').id).toBe('tiktok');
    expect(detectarServicoPorUrl('https://www.tiktok.com/@criador').id).toBe('tiktok');
  });

  it('deve detectar Facebook', () => {
    expect(detectarServicoPorUrl('https://facebook.com/pagina').id).toBe('facebook');
    expect(detectarServicoPorUrl('https://fb.com/usuario').id).toBe('facebook');
  });

  it('deve detectar Twitter/X via twitter.com', () => {
    expect(detectarServicoPorUrl('https://twitter.com/usuario').id).toBe('twitter');
  });

  it('deve detectar Twitter/X via x.com', () => {
    expect(detectarServicoPorUrl('https://x.com/usuario').id).toBe('twitter');
  });

  it('deve detectar Spotify', () => {
    expect(detectarServicoPorUrl('https://open.spotify.com/artist/abc').id).toBe('spotify');
    expect(detectarServicoPorUrl('https://spotify.com/track/xyz').id).toBe('spotify');
  });

  it('deve retornar id "externo" para URL desconhecida', () => {
    expect(detectarServicoPorUrl('https://meusite.com.br').id).toBe('externo');
    expect(detectarServicoPorUrl('https://exemplo.com/pagina').id).toBe('externo');
  });

  it('deve retornar id "link" para string vazia ou inválida', () => {
    expect(detectarServicoPorUrl('').id).toBe('link');
    expect(detectarServicoPorUrl(null).id).toBe('link');
    expect(detectarServicoPorUrl(undefined).id).toBe('link');
  });
});

describe('formatarUrl', () => {
  it('deve retornar URL com https:// inalterada', () => {
    expect(formatarUrl('https://exemplo.com')).toBe('https://exemplo.com');
  });

  it('deve retornar URL com http:// inalterada', () => {
    expect(formatarUrl('http://outro.com')).toBe('http://outro.com');
  });

  it('deve preservar protocolo mailto:', () => {
    expect(formatarUrl('mailto:contato@exemplo.com')).toBe('mailto:contato@exemplo.com');
  });

  it('deve preservar protocolo tel:', () => {
    expect(formatarUrl('tel:+5511999999999')).toBe('tel:+5511999999999');
  });

  it('deve adicionar https:// quando não houver protocolo', () => {
    expect(formatarUrl('exemplo.com')).toBe('https://exemplo.com');
    expect(formatarUrl('www.google.com')).toBe('https://www.google.com');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    expect(formatarUrl('')).toBe('');
    expect(formatarUrl(null)).toBe('');
    expect(formatarUrl(undefined)).toBe('');
  });
});
