'use client';

import React from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import PackageForm from '../../../../components/PackageForm';

const NewDubaiPackagePage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Dubai Package</h1>
          <p className="text-gray-600 mt-2">Create a new travel package for Dubai</p>
        </div>
        
        <PackageForm mode="create" destination="dubai" />
      </div>
    </AdminLayout>
  );
};

export default NewDubaiPackagePage; 