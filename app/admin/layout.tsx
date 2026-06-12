'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Only redirect if we're not on the login page and user is not authenticated
    if (!loading && !currentUser && !isLoginPage) {
      router.push('/admin/login');
    }
    // If user is authenticated and on login page, redirect to admin
    if (!loading && currentUser && isLoginPage) {
      router.push('/admin');
    }
  }, [currentUser, loading, router, isLoginPage]);

  // Don't render anything while loading or if user is not authenticated (except on login page)
  if (!isLoginPage && (loading || !currentUser)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // During SSR/build time, render children without auth checks
  if (typeof window === 'undefined' && !isLoginPage) {
    return <>{children}</>;
  }

  return <>{children}</>;
} 