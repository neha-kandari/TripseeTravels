'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

interface Package {
  id: string;
  image: string;
  days: string;
  title: string;
  location: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
}

interface PopularDestination {
  name: string;
  image: string;
  packages: Package[];
}

interface HomeContent {
  popularPackages: {
    destinations: PopularDestination[];
  };
}

const HomeContentAdmin = () => {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'packages'>('packages');

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/admin/home-content');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        setMessage('Failed to fetch home content');
      }
    } catch (error) {
      setMessage('Error fetching home content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/home-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setMessage('✅ Home content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to update home content');
      }
    } catch (error) {
      setMessage('❌ Error updating home content');
    } finally {
      setSaving(false);
    }
  };


  const updatePopularDestination = (destIndex: number, field: keyof PopularDestination, value: string) => {
    if (!content) return;
    
    const updatedDestinations = [...content.popularPackages.destinations];
    updatedDestinations[destIndex] = { ...updatedDestinations[destIndex], [field]: value };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };


  const updatePackage = (destIndex: number, packageIndex: number, field: keyof Package, value: string | number | string[]) => {
    if (!content) return;
    
    const updatedDestinations = [...content.popularPackages.destinations];
    const updatedPackages = [...updatedDestinations[destIndex].packages];
    updatedPackages[packageIndex] = { ...updatedPackages[packageIndex], [field]: value };
    
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      packages: updatedPackages,
    };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };

  const updatePackageFeatures = (destIndex: number, packageIndex: number, featureIndex: number, value: string) => {
    if (!content) return;
    
    const updatedDestinations = [...content.popularPackages.destinations];
    const updatedPackages = [...updatedDestinations[destIndex].packages];
    const updatedFeatures = [...updatedPackages[packageIndex].features];
    updatedFeatures[featureIndex] = value;
    
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features: updatedFeatures,
    };
    
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      packages: updatedPackages,
    };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };

  const addPackageFeature = (destIndex: number, packageIndex: number) => {
    if (!content) return;
    
    const updatedDestinations = [...content.popularPackages.destinations];
    const updatedPackages = [...updatedDestinations[destIndex].packages];
    const updatedFeatures = [...updatedPackages[packageIndex].features, 'New Feature'];
    
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features: updatedFeatures,
    };
    
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      packages: updatedPackages,
    };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };

  const removePackageFeature = (destIndex: number, packageIndex: number, featureIndex: number) => {
    if (!content) return;
    
    const updatedDestinations = [...content.popularPackages.destinations];
    const updatedPackages = [...updatedDestinations[destIndex].packages];
    const updatedFeatures = updatedPackages[packageIndex].features.filter((_, index) => index !== featureIndex);
    
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features: updatedFeatures,
    };
    
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      packages: updatedPackages,
    };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };

  const addPackage = (destIndex: number) => {
    if (!content) return;
    
    const newPackage = {
      id: `new-package-${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      days: '3 Nights 4 Days',
      title: 'New Package',
      location: 'New Location',
      price: '₹50,000/-',
      type: 'Standard',
      hotelRating: 3,
      features: ['Feature 1', 'Feature 2'],
      highlights: 'New package highlights'
    };
    
    const updatedDestinations = [...content.popularPackages.destinations];
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      packages: [...updatedDestinations[destIndex].packages, newPackage]
    };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };

  const removePackage = (destIndex: number, packageIndex: number) => {
    if (!content) return;
    
    const updatedDestinations = [...content.popularPackages.destinations];
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      packages: updatedDestinations[destIndex].packages.filter((_, index) => index !== packageIndex)
    };
    
    setContent({
      ...content,
      popularPackages: {
        ...content.popularPackages,
        destinations: updatedDestinations,
      },
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-xl text-gray-700 font-medium">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Failed to load home content</p>
          <button
            onClick={fetchHomeContent}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🏠 Home Content Manager</h1>
                <p className="text-gray-600 mt-1">Manage your website's main content and packages</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  👤 {currentUser?.email}
                </span>
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ← Back to Admin
                </button>
                <button
                  onClick={fetchHomeContent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium text-lg transition-colors"
                >
                  {saving ? '💾 Saving...' : '💾 Save All Changes'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className={`p-4 rounded-lg text-lg font-medium ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}>
              {message}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">📦 Popular Packages</h2>
              <p className="text-gray-600 text-lg">Manage your website's popular travel packages</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-12">
          {/* Popular Packages Section */}
          <div className="space-y-8">
              {content.popularPackages.destinations.map((destination, destIndex) => (
                <div key={destIndex} className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      📦 {destination.name} Packages
                    </h3>
                    <p className="text-gray-600">Manage travel packages for {destination.name}</p>
                    <p className="text-sm text-gray-500 mt-1">Note: Top destinations and attractions are managed separately</p>
                  </div>
                  
                  {/* Destination Info */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">🏛️ Destination Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Destination Name</label>
                        <input
                          type="text"
                          value={destination.name}
                          onChange={(e) => updatePopularDestination(destIndex, 'name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">🖼️ Destination Image</label>
                        <input
                          type="text"
                          value={destination.image}
                          onChange={(e) => updatePopularDestination(destIndex, 'image', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Packages Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-semibold text-gray-900">🎯 Package Cards</h4>
                      <button
                        onClick={() => addPackage(destIndex)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                      >
                        ➕ Add New Package
                      </button>
                    </div>
                    <div className="space-y-6">
                      {destination.packages.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <p className="text-gray-500 text-lg mb-4">No packages added yet</p>
                          <p className="text-gray-400">Click "Add New Package" to get started</p>
                        </div>
                      ) : (
                        destination.packages.map((pkg, packageIndex) => (
                        <div key={packageIndex} className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-orange-50 to-white">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold text-gray-900">Package {packageIndex + 1}</h5>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-bold">{packageIndex + 1}</span>
                              </div>
                              <button
                                onClick={() => removePackage(destIndex, packageIndex)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">🆔 Package ID</label>
                              <input
                                type="text"
                                value={pkg.id}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'id', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">🖼️ Package Image</label>
                              <input
                                type="text"
                                value={pkg.image}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'image', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="https://images.unsplash.com/photo-... (recommended) or /Destination/image.jpg"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                💡 Tip: You can use external URLs from Unsplash, Pexels, Pixabay, iStock, Shutterstock, Getty Images, Bing, Google Images, or local paths like /Destination/image.jpg
                              </p>
                              <div className="text-xs text-gray-400 mt-1">
                                <p><strong>Popular Image Sources:</strong></p>
                                <p>• Unsplash: https://images.unsplash.com/photo-... (✅ Direct image URL)</p>
                                <p>• Unsplash: https://unsplash.com/photos/... (⚠️ Page URL - will use fallback)</p>
                                <p>• Pexels: https://images.pexels.com/photos/...</p>
                                <p>• Pixabay: https://cdn.pixabay.com/photo/...</p>
                                <p>• Bing Images: https://th.bing.com/th/id/... or https://tse3.mm.bing.net/th/id/...</p>
                                <p>• Google Images: https://encrypted-tbn0.gstatic.com/...</p>
                                <p>• Imgur: https://i.imgur.com/...</p>
                                <p>• iStock: https://media.istockphoto.com/id/... (✅ Direct image URL)</p>
                                <p>• iStock: https://www.istockphoto.com/photo/... (⚠️ Page URL - will use fallback)</p>
                                <p>• Shutterstock: https://image.shutterstock.com/image-photo/... (✅ Direct image URL)</p>
                                <p>• Getty Images: https://media.gettyimages.com/photos/... (✅ Direct image URL)</p>
                                <p>• Lorem Picsum: https://picsum.photos/800/600</p>
                                <p className="mt-2 text-yellow-600"><strong>💡 How to get direct image URLs:</strong></p>
                                <p className="text-xs">Right-click on the image → "Copy image address" or "Copy image URL"</p>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Duration</label>
                              <input
                                type="text"
                                value={pkg.days}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'days', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="5 Nights 6 Days"
                              />
                            </div>
                            
                            <div className="md:col-span-2 lg:col-span-3">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Package Title</label>
                              <input
                                type="text"
                                value={pkg.title}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'title', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="PREMIUM PACKAGE - Luxury Villas with Private Pool"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Location</label>
                              <input
                                type="text"
                                value={pkg.location}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'location', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="Umalas & Ubud"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Price</label>
                              <input
                                type="text"
                                value={pkg.price}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'price', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="₹91,500/-"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Package Type</label>
                              <input
                                type="text"
                                value={pkg.type}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'type', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="Premium, Luxury, Cultural"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">⭐ Hotel Rating</label>
                              <select
                                value={pkg.hotelRating}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'hotelRating', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              >
                                {[1, 2, 3, 4, 5].map(rating => (
                                  <option key={rating} value={rating}>{rating} ⭐ Star</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="md:col-span-2 lg:col-span-3">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">✨ Highlights</label>
                              <input
                                type="text"
                                value={pkg.highlights}
                                onChange={(e) => updatePackage(destIndex, packageIndex, 'highlights', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="Swiss-Belvillas Umalas • Swan Paradise • Watersports"
                              />
                            </div>
                            
                            <div className="md:col-span-2 lg:col-span-3">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 Features</label>
                              <div className="space-y-3">
                                {pkg.features.map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex gap-3">
                                    <input
                                      type="text"
                                      value={feature}
                                      onChange={(e) => updatePackageFeatures(destIndex, packageIndex, featureIndex, e.target.value)}
                                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                      placeholder="e.g., Private Pool Villa"
                                    />
                                    <button
                                      onClick={() => removePackageFeature(destIndex, packageIndex, featureIndex)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addPackageFeature(destIndex, packageIndex)}
                                  className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                  ➕ Add New Feature
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </div>

                  
                </div>
              ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomeContentAdmin; 