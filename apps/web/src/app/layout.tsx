import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';
import QueryProvider from '../providers/QueryProvider';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'ArtistHub - Votre Hub Créatif',
  description: 'Gérez votre carrière artistique, connectez-vous avec des professionnels, et développez votre audience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <QueryProvider>
            <Navigation />
            <main>{children}</main>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}