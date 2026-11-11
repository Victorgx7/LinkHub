import React from 'react';
import {
  MessageCircle,
  Video,
  Music,
  Mail,
  Phone,
  ExternalLink,
  Globe,
  Share2,
  QrCode,
  Sparkles,
  Link as LinkIcon,
  AtSign,
  Rss,
  BookOpen,
  ShoppingBag,
  Camera,
  Code2,
  Briefcase,
  Heart,
  Star,
  Zap,
} from 'lucide-react';

/**
 * Ícones SVG inline para redes sociais (lucide-react v1.x não inclui ícones de marcas).
 * Usamos SVGs customizados com visual fiel às marcas.
 */
function IconeInstagram({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconeWhatsApp({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.989.58 3.842 1.584 5.405L2 22l4.734-1.558A9.952 9.952 0 0012.004 22C17.527 22 22 17.527 22 12S17.527 2 12.004 2zm0 18.182a8.169 8.169 0 01-4.168-1.142l-.299-.178-3.1 1.02 1.038-3.015-.195-.308a8.154 8.154 0 01-1.252-4.359c0-4.512 3.67-8.182 8.182-8.182S20.186 7.488 20.186 12s-3.67 8.182-8.182 8.182z" />
    </svg>
  );
}

function IconeLinkedIn({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconeGitHub({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function IconeYouTube({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function IconeFacebook({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconeTwitterX({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconeTikTok({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.19a8.17 8.17 0 004.78 1.52V6.27a4.85 4.85 0 01-1.01-.58z" />
    </svg>
  );
}

function IconeSpotify({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/**
 * Mapa completo de ícones por serviço/nome.
 * Redes sociais usam SVGs inline fidelizados.
 * Outros usam ícones do lucide-react disponíveis na v1.x.
 */
const MAPA_ICONES = {
  // Instagram
  instagram: IconeInstagram,
  Instagram: IconeInstagram,

  // WhatsApp
  whatsapp: IconeWhatsApp,
  WhatsApp: IconeWhatsApp,
  'message-circle': MessageCircle,
  MessageCircle,

  // LinkedIn
  linkedin: IconeLinkedIn,
  Linkedin: IconeLinkedIn,
  LinkedIn: IconeLinkedIn,

  // GitHub
  github: IconeGitHub,
  Github: IconeGitHub,
  GitHub: IconeGitHub,

  // YouTube
  youtube: IconeYouTube,
  Youtube: IconeYouTube,
  YouTube: IconeYouTube,

  // Facebook
  facebook: IconeFacebook,
  Facebook: IconeFacebook,

  // Twitter / X
  twitter: IconeTwitterX,
  Twitter: IconeTwitterX,
  x: IconeTwitterX,
  'twitter-x': IconeTwitterX,

  // TikTok
  tiktok: IconeTikTok,
  TikTok: IconeTikTok,

  // Spotify
  spotify: IconeSpotify,
  Spotify: IconeSpotify,

  // Lucide genéricos disponíveis na v1.x
  Music,
  music: Music,
  Video,
  video: Video,
  Mail,
  email: Mail,
  mail: Mail,
  Phone,
  telefone: Phone,
  phone: Phone,
  ExternalLink,
  externo: ExternalLink,
  'external-link': ExternalLink,
  Globe,
  website: Globe,
  globe: Globe,
  site: Globe,
  Share2,
  compartilhar: Share2,
  QrCode,
  qrcode: QrCode,
  Sparkles,
  LinkIcon,
  link: LinkIcon,
  AtSign,
  email_alt: AtSign,
  Rss,
  rss: Rss,
  blog: BookOpen,
  BookOpen,
  loja: ShoppingBag,
  ShoppingBag,
  Camera,
  foto: Camera,
  Code2,
  codigo: Code2,
  Briefcase,
  portfolio: Briefcase,
  Heart,
  favorito: Heart,
  Star,
  destaque: Star,
  Zap,
};

/**
 * Renderiza o ícone SVG correspondente de forma dinâmica.
 * Aceita o nome do serviço (ex: 'instagram', 'whatsapp') ou o nome do componente lucide.
 */
export default function IconeDinamico({ nome, className = 'w-5 h-5', style }) {
  if (!nome) return <ExternalLink className={className} style={style} />;

  const ComponenteIcone = MAPA_ICONES[nome] || ExternalLink;
  return <ComponenteIcone className={className} style={style} />;
}
