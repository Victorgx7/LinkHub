/**
 * Gera dinamicamente o robots.txt da plataforma.
 */
export default function robots() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login', '/recuperar-senha', '/convite/'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
