'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header with logout */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Tripsee Admin Panel</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {currentUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🏝️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Tripsee Admin</h1>
              <p className="text-gray-600 mb-8">
                Manage your travel packages, itineraries, and bookings from one central dashboard.
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/admin/dashboard"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold block"
                >
                  Go to Dashboard
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/admin/destinations"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Manage Destinations
                  </Link>
                  
                  <Link
                    href="/admin/home-content"
                    className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Home Content
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminPage; 