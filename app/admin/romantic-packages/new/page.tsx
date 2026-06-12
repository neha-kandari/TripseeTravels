'use client';

import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import RomanticPackageForm from '../../components/RomanticPackageForm';

const NewRomanticPackagePage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Romantic Package</h1>
          <p className="text-gray-600 mt-2">Add a new romantic travel package to your collection</p>
        </div>

        {/* Form */}
        <RomanticPackageForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default NewRomanticPackagePage; 