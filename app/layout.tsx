import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';

// Carga optimizada de tipografía (Inter es el estándar moderno similar a San Francisco)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Configuración de viewport para experiencia tipo app nativa
export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// Metadatos SEO + PWA
export const metadata: Metadata = {
  title: {
    default: 'BarraCompra',
    template: '%s | BarraCompra',
  },
  description: 'Agrúpate con vecinos y compra al por mayor en comercios locales de Uruguay.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BarraCompra',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} font-sans`}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
        <div className="flex flex-col min-h-screen">
          {/* Contenido principal con padding seguro para móviles */}
          <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-28 sm:pb-24">
            {children}
          </main>
          
          {/* Barra de navegación fija (optimizada para iOS/Android) */}
          <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
            <div className="w-full max-w-md px-2 pb-2 bg-white/90 backdrop-blur-md border-t border-slate-200">
              <BottomNav />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
