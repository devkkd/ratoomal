'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new login page location
    router.push('/login/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Redirecting to login...</p>
      </div>
    </div>
  );
}
