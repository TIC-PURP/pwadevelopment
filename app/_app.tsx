import { useEffect } from 'react';
import { syncDatabases } from '@/lib/sync';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth-context';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    syncDatabases();
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}