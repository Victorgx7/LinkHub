import '@/estilos/globals.css';
import { ProvedorTema } from '@/contextos/ContextoTema';

export const metadata = {
  title: 'LinkHub — Plataforma de Perfis Inteligentes e Links',
  description:
    'Crie sua página pública personalizada, centralize seus links, redes sociais e acompanhe métricas em tempo real com visual SaaS premium.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-escuro-fundo text-escuro-texto antialiased selection:bg-neon selection:text-black">
        <ProvedorTema>
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
        </ProvedorTema>
      </body>
    </html>
  );
}
