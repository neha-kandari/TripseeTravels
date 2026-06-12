'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/destinations"
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Destinations</h3>
              <p className="text-gray-600">Add, edit, and manage travel destinations</p>
            </Link>


            <Link
              href="/admin/home-content"
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Content</h3>
              <p className="text-gray-600">Edit home page content and destinations</p>
            </Link>

            <Link
              href="/admin"
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Back to Admin</h3>
              <p className="text-gray-600">Return to main admin panel</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 