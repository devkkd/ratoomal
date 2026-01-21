// // ratoomal/app/admin/layout.js
// 'use client';

// import { useState, useEffect } from 'react';
// import Sidebar from './layout/Sidebar';
// import Header from './layout/Header';

// export default function AdminLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect mobile screen
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Auto-close sidebar on mobile when resizing to desktop
//   useEffect(() => {
//     if (!isMobile && sidebarOpen) {
//       setSidebarOpen(true);
//     }
//   }, [isMobile, sidebarOpen]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
//       {/* Main content area */}
//       <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
//         <Header 
//           sidebarOpen={sidebarOpen} 
//           toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
//         />
        
//         <main className="p-3 sm:p-4 md:p-6">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin token on mount
  useEffect(() => {
    const checkAdminToken = async () => {
      try {
        console.log('🔐 Checking admin authorization...');

        // Try to get token from cookies first (httpOnly)
        const response = await fetch('/api/admin/verify-token', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        console.log('📊 Verify token response:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log('🔐 ADMIN PROTECTION: ✅ Token verified → Access granted');
          setIsAuthorized(true);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.log('🔐 ADMIN PROTECTION: ❌ Token invalid or missing → Redirecting to login', errorData);
          setIsAuthorized(false);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('🔐 ADMIN PROTECTION: ❌ Error checking token → Redirecting to login', error);
        setIsAuthorized(false);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminToken();
  }, [router]);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading while checking token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content - Fixed width for sidebar (w-64 = 256px) */}
      <div className="lg:ml-64">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
