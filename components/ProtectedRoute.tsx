import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  if (loading || !user) return null;

  return children;
}