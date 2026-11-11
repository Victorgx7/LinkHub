/**
 * Detector de serviços e redes sociais a partir da URL.
 * Mapeia automaticamente domínios conhecidos para ícones e rótulos padronizados.
 */

export const REDES_SOCIAIS_SUPORTADAS = {
  instagram: {
    nome: 'Instagram',
    icone: 'Instagram',
    padroes: [/instagram\.com/i, /instagr\.am/i],
    corSugerida: '#E1306C',
  },
  whatsapp: {
    nome: 'WhatsApp',
    icone: 'MessageCircle',
    padroes: [/wa\.me/i, /whatsapp\.com/i, /api\.whatsapp\.com/i],
    corSugerida: '#25D366',
  },
  linkedin: {
    nome: 'LinkedIn',
    icone: 'Linkedin',
    padroes: [/linkedin\.com/i],
    corSugerida: '#0A66C2',
  },
  github: {
    nome: 'GitHub',
    icone: 'Github',
    padroes: [/github\.com/i],
    corSugerida: '#FFFFFF',
  },
  youtube: {
    nome: 'YouTube',
    icone: 'Youtube',
    padroes: [/youtube\.com/i, /youtu\.be/i],
    corSugerida: '#FF0000',
  },
  tiktok: {
    nome: 'TikTok',
    icone: 'Video',
    padroes: [/tiktok\.com/i],
    corSugerida: '#FE2C55',
  },
  facebook: {
    nome: 'Facebook',
    icone: 'Facebook',
    padroes: [/facebook\.com/i, /fb\.com/i],
    corSugerida: '#1877F2',
  },
  twitter: {
    nome: 'X (Twitter)',
    icone: 'Twitter',
    padroes: [/twitter\.com/i, /x\.com/i],
    corSugerida: '#FFFFFF',
  },
  spotify: {
    nome: 'Spotify',
    icone: 'Music',
    padroes: [/spotify\.com/i],
    corSugerida: '#1DB954',
  },
  email: {
    nome: 'E-mail',
    icone: 'Mail',
    padroes: [/^mailto:/i],
    corSugerida: '#B2FF00',
  },
  telefone: {
    nome: 'Telefone',
    icone: 'Phone',
    padroes: [/^tel:/i],
    corSugerida: '#B2FF00',
  },
};

/**
 * Detecta o serviço ou rede social com base na URL informada.
 * 
 * @param {string} url - URL de destino do link
 * @returns {{ id: string, nome: string, icone: string, cor: string }} Dados do serviço detectado
 */
export function detectarServicoPorUrl(url) {
  if (!url || typeof url !== 'string') {
    return { id: 'link', nome: 'Link Externo', icone: 'ExternalLink', cor: '#B2FF00' };
  }

  const urlLimpa = url.trim();

  for (const [chave, config] of Object.entries(REDES_SOCIAIS_SUPORTADAS)) {
    const corresponde = config.padroes.some((padrao) => padrao.test(urlLimpa));
    if (corresponde) {
      return {
        id: chave,
        nome: config.nome,
        icone: config.icone,
        cor: config.corSugerida,
      };
    }
  }

  return {
    id: 'externo',
    nome: 'Website',
    icone: 'ExternalLink',
    cor: '#B2FF00',
  };
}

/**
 * Higieniza uma URL garantindo protocolo http/https válido caso seja digitada sem prefixo.
 * 
 * @param {string} url - URL bruta digitada pelo usuário
 * @returns {string} URL devidamente formatada
 */
export function formatarUrl(url) {
  if (!url) return '';
  const urlLimpa = url.trim();
  if (
    urlLimpa.startsWith('http://') ||
    urlLimpa.startsWith('https://') ||
    urlLimpa.startsWith('mailto:') ||
    urlLimpa.startsWith('tel:')
  ) {
    return urlLimpa;
  }
  return `https://${urlLimpa}`;
}
