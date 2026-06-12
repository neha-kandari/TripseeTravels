'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface PackageFormProps {
  package?: any;
  mode: 'create' | 'edit';
  destination?: string;
}

// Destination-specific configuration
const destinationConfig = {
  bali: {
    cities: ['Kuta', 'Ubud', 'Seminyak', 'Umalas', 'Nusa Penida', 'Gili T', 'Benoa', 'Jineng'],
    titlePlaceholder: 'e.g., Bali Bliss Getaway - Premium Package',
    localImage: '/Destination/Bali.webp',
    name: 'Bali'
  },
  thailand: {
    cities: ['Bangkok', 'Phuket', 'Pattaya', 'Chiang Mai', 'Krabi', 'Koh Samui', 'Hua Hin', 'Ayutthaya'],
    titlePlaceholder: 'e.g., Thailand Adventure - Bangkok & Islands',
    localImage: '/Destination/Thailand.webp',
    name: 'Thailand'
  },
  vietnam: {
    cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang', 'Ha Long Bay', 'Hue', 'Dalat'],
    titlePlaceholder: 'e.g., Vietnam Discovery - North to South',
    localImage: '/Destination/Vietnam.webp',
    name: 'Vietnam'
  },
  singapore: {
    cities: ['Marina Bay', 'Orchard Road', 'Sentosa', 'Chinatown', 'Little India', 'Jurong', 'Changi', 'Clarke Quay'],
    titlePlaceholder: 'e.g., Singapore City Explorer - Gardens & Marina',
    localImage: '/Destination/Singapore.webp',
    name: 'Singapore'
  },
  malaysia: {
    cities: ['Kuala Lumpur', 'Langkawi', 'Penang', 'Malacca', 'Genting', 'Johor Bahru', 'Kota Kinabalu', 'Kuching'],
    titlePlaceholder: 'e.g., Malaysia Highlights - KL & Islands',
    localImage: '/Destination/Malasia.webp',
    name: 'Malaysia'
  },
  dubai: {
    cities: ['Dubai City', 'Dubai Marina', 'Downtown Dubai', 'Jumeirah', 'Deira', 'Bur Dubai', 'Dubai Creek', 'Al Ain'],
    titlePlaceholder: 'e.g., Dubai Luxury Experience - City & Desert',
    localImage: '/Destination/Dubai.webp',
    name: 'Dubai'
  },
  andaman: {
    cities: ['Port Blair', 'Havelock Island', 'Neil Island', 'Ross Island', 'Radhanagar Beach', 'Chidiya Tapu', 'Baratang', 'Diglipur'],
    titlePlaceholder: 'e.g., Andaman Island Paradise - Beaches & Adventure',
    localImage: '/Destination/andaman.webp',
    name: 'Andaman'
  },
  maldives: {
    cities: ['Malé', 'Hulhumalé', 'Maafushi', 'Thulusdhoo', 'Guraidhoo', 'Dhiffushi', 'Addu Atoll', 'Fuvahmulah'],
    titlePlaceholder: 'e.g., Maldives Luxury Resort - Overwater Villas',
    localImage: '/Destination/Maldives.webp',
    name: 'Maldives'
  }
};

const PackageForm: React.FC<PackageFormProps> = ({ package: packageData, mode, destination = 'bali' }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Helper function to parse price from string format
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    // Remove currency symbols, commas, and other non-numeric characters except decimal point
    const numericStr = priceStr.replace(/[₹,/-]/g, '').trim();
    const price = parseFloat(numericStr);
    return isNaN(price) ? 0 : price;
  };
  const [formData, setFormData] = useState({
    image: '',
    days: '',
    title: '',
    location: '',
    price: '',
    hotelRating: 4,
    type: 'Standard', // Add type field
    features: [''],
    highlights: '',
    isUpdateExisting: false,
    id: ''
  });

  // Get destination-specific configuration (memoized)
  const config = useMemo(() => 
    destinationConfig[destination as keyof typeof destinationConfig] || destinationConfig.bali,
    [destination]
  );

  useEffect(() => {
    if (packageData && mode === 'edit') {
      console.log('PackageForm: Setting form data from packageData:', packageData);
      console.log('PackageForm: Package ID:', packageData.id, 'Package _id:', packageData._id);
      
      // Use duration as-is for manual input
      let formattedDays = packageData.days ? String(packageData.days) : '';

      setFormData({
        image: packageData.image || '',
        days: formattedDays,
        title: packageData.title || '',
        location: packageData.location || '',
        price: packageData.price ? String(packageData.price) : '',
        hotelRating: packageData.hotelRating || 4,
        type: packageData.type || 'Standard', // Add type field
        features: packageData.features || [''],
        highlights: Array.isArray(packageData.highlights) ? packageData.highlights.join(' • ') : (packageData.highlights || ''),
        isUpdateExisting: false,
        id: packageData.id || packageData._id || ''
      });
    }
  }, [packageData, mode]);

  // Validate image URL format (same as RomanticPackageForm)
  const validateImageUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check if it's a data URL (uploaded file)
    if (url.startsWith('data:image/')) {
      console.log('Validating data URL, length:', url.length);
      return url.length > 0;
    }
    
    // Check if it's a local path
    if (url.startsWith('/Destination/') || url.startsWith('/uploads/')) return true;
    
    // Check if it's a valid external image URL
    try {
      const urlObj = new URL(url);
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = validImageExtensions.some(ext => 
        urlObj.pathname.toLowerCase().endsWith(ext)
      );
      
      // Check for common image hosting services
      const validHosts = [
        'images.pexels.com',
        'images.unsplash.com',
        'res.cloudinary.com',
        'cdn.pixabay.com'
      ];
      
      return hasValidExtension || validHosts.some(host => urlObj.hostname.includes(host));
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      // Auto-format price input (remove non-numeric characters)
      if (name === 'price' && value) {
        const numericValue = value.replace(/[^0-9]/g, '');
        newData.price = numericValue;
      }
      // Allow manual input for days field (no auto-formatting)
      else if (name === 'days') {
        newData.days = value;
      }
      // Handle hotel rating as integer
      else if (name === 'hotelRating') {
        newData[name] = parseInt(value);
      }
      // Handle other fields normally
      else {
        newData[name] = value;
      }
      
      return newData;
    });
  };

  const handleArrayChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeArrayItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fast validation - check all fields at once
    const validationErrors = [];
    
    if (!formData.title?.trim()) validationErrors.push('Package title');
    if (!formData.highlights?.trim()) validationErrors.push('Package highlights/description');
    if (!formData.days || !formData.days.trim()) validationErrors.push('Package duration');
    if (!formData.price || Number(formData.price) <= 0) validationErrors.push('Package price');
    if (!formData.location?.trim()) validationErrors.push('Package location');
    
    // Validate image only if provided
    if (formData.image) {
      if (mode === 'create' && !validateImageUrl(formData.image)) {
        validationErrors.push('Valid image URL or file');
      }
      
      // Check image size for base64 images
      if (formData.image.startsWith('data:image/')) {
        const imageSizeKB = Math.round(formData.image.length / 1024);
        if (imageSizeKB > 5000) {
          validationErrors.push('Image smaller than 5MB');
        }
      }
    }
    
    if (validationErrors.length > 0) {
      alert(`Please fix the following:\n• ${validationErrors.join('\n• ')}`);
      return;
    }
    
    setLoading(true);

    try {
      // Determine the correct endpoint and method
      // Use the new MongoDB API for all operations
      let url: string;
      let method: string;
      let requestBody: any;
      
      if (mode === 'create') {
        url = `/api/admin/destinations/${destination}/packages`;
        method = 'POST';
        // Extract numeric days from manual duration format (e.g., "5 Days 7 Nights" -> "5")
        const numericDays = formData.days.match(/(\d+)\s+Days/)?.[1] || 
                           formData.days.match(/(\d+)\s+Nights/)?.[1] || 
                           formData.days.match(/\d+/)?.[0] || 
                           formData.days;
        
        requestBody = {
          name: formData.title,
          description: formData.highlights,
          price: parsePrice(formData.price),
          duration: formData.days,
          days: numericDays,
          destination: destination,
          location: formData.location,
          image: formData.image,
          features: formData.features.filter(f => f.trim() !== ''),
          highlights: formData.highlights ? formData.highlights.split(' • ').filter(h => h.trim() !== '') : [],
          category: 'romantic',
          type: formData.type || 'Standard',
          hotelRating: formData.hotelRating || 4
        };
      } else {
        // For edit mode, use PUT with destination-specific MongoDB API
        const packageId = packageData?.id || packageData?._id || formData.id;
        
        url = `/api/admin/destinations/${destination}/packages/${packageId}`;
        method = 'PUT';
        // Extract numeric days from manual duration format (e.g., "5 Days 7 Nights" -> "5")
        const numericDays = formData.days.match(/(\d+)\s+Days/)?.[1] || 
                           formData.days.match(/(\d+)\s+Nights/)?.[1] || 
                           formData.days.match(/\d+/)?.[0] || 
                           formData.days;
        
        requestBody = {
          name: formData.title,
          description: formData.highlights,
          price: parsePrice(formData.price),
          duration: formData.days,
          days: numericDays, // Add days field for duration display
          destination: destination,
          location: formData.location,
          image: formData.image,
          features: formData.features.filter(f => f.trim() !== ''),
          highlights: formData.highlights ? formData.highlights.split(' • ').filter(h => h.trim() !== '') : [],
          category: 'romantic',
          type: formData.type || 'Standard', // Add type field
          hotelRating: formData.hotelRating || 4 // Add hotelRating field
        };
        console.log('Updating package via MongoDB API');
      }
      
      console.log('Request details:', { url, method, requestBody });
      console.log('Form data being sent:', formData);
      console.log('🔍 PACKAGE FORM DEBUG - hotelRating from formData:', formData.hotelRating, 'type:', typeof formData.hotelRating);
      console.log('🔍 PACKAGE FORM DEBUG - type from formData:', formData.type, 'type:', typeof formData.type);
      console.log('🔍 PACKAGE FORM DEBUG - days from formData:', formData.days, 'type:', typeof formData.days);
      console.log('🔍 PACKAGE FORM DEBUG - requestBody hotelRating:', requestBody.hotelRating, 'type:', typeof requestBody.hotelRating);
      console.log('🔍 PACKAGE FORM DEBUG - requestBody type:', requestBody.type, 'type:', typeof requestBody.type);
      console.log('🔍 PACKAGE FORM DEBUG - requestBody days:', requestBody.days, 'type:', typeof requestBody.days);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
        } catch (jsonError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        alert(`Failed to ${mode === 'create' ? 'create' : 'update'} package: ${errorMessage}`);
        return;
      }

      // Parse JSON response
      try {
        await response.json();
        alert(`Package ${mode === 'create' ? 'created' : 'updated'} successfully!`);
        router.push(`/admin/destinations/${destination}`);
      } catch (jsonError) {
        alert(`Failed to ${mode === 'create' ? 'create' : 'update'} package: Invalid response from server`);
      }
    } catch (error) {
      console.error(`Failed to ${mode === 'create' ? 'create' : 'update'} package:`, error);
      alert(`Failed to ${mode === 'create' ? 'create' : 'update'} package`);
    } finally {
      setLoading(false);
    }
  }, [formData, mode, packageData, destination, router]);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="text-gray-700">
              {mode === 'create' ? 'Creating package...' : 'Updating package...'}
            </span>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={config.titlePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              name="days"
              value={formData.days}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 5 Days 7 Nights"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., ₹42,999/-"
            />
          </div>

          {/* Image Upload Section - EXACTLY like RomanticPackageForm */}
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Package Image {mode === 'create' ? <span className="text-red-500">*</span> : <span className="text-gray-500">(Optional)</span>}
            </label>
            
            {/* Image Upload Options */}
            <div className="space-y-4">
              {/* Option 1: File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  📁 Upload Image from PC
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log('File selected:', file.name, file.size, file.type);
                        // Convert file to data URL for preview
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const dataUrl = e.target?.result as string;
                          console.log('Data URL generated, length:', dataUrl.length);
                          setFormData(prev => ({ ...prev, image: dataUrl }));
                        };
                        reader.onerror = (error) => {
                          console.error('Error reading file:', error);
                          alert('Error reading the selected file. Please try again.');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Supported: JPG, PNG, GIF, WebP (Max 5MB)</p>
                {formData.image && formData.image.startsWith('data:image/') && (
                  <div className="mt-2 text-xs text-green-600">
                    ✅ File uploaded successfully! ({Math.round(formData.image.length / 1024)} KB)
                  </div>
                )}
              </div>

              {/* Option 2: URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  🔗 Or Paste Image URL
                </label>
                <input
                  type={mode === 'create' ? 'url' : 'text'}
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Direct image URLs only (not webpage URLs). 
                  <br />
                  ✅ Good: https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg
                  <br />
                  ❌ Bad: https://www.pexels.com/photo/1234567/
                </p>
                {mode === 'create' && formData.image && !formData.image.startsWith('data:') && !formData.image.startsWith('/Destination/') && !formData.image.startsWith('/uploads/') && (
                  <div className={`mt-2 text-xs ${validateImageUrl(formData.image) ? 'text-green-600' : 'text-red-600'}`}>
                    {validateImageUrl(formData.image) ? '✅ Valid image URL' : '❌ Invalid image URL format'}
                  </div>
                )}
              </div>

              {/* Option 3: Local Destination Images */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  🏝️ Or Use Local {config.name} Image
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData({ ...formData, image: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a local {config.name} image</option>
                  <option value={config.localImage}>{config.name} Default</option>
                  {/* Show other destination images as options too */}
                  {Object.entries(destinationConfig).map(([key, destConfig]) => (
                    key !== destination && (
                      <option key={key} value={destConfig.localImage}>{destConfig.name}</option>
                    )
                  ))}
                </select>
              </div>
            </div>

            {/* Image Preview - EXACTLY like RomanticPackageForm */}
            {formData.image && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  📸 Image Preview
                </label>
                <div className="relative w-48 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const nextElement = target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                        nextElement.classList.add('flex');
                      }
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-100 items-center justify-center text-gray-500 text-sm">
                    Image preview not available
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Rating *
          </label>
          <select
            name="hotelRating"
            value={formData.hotelRating}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value={3}>3 Star</option>
            <option value={4}>4 Star</option>
            <option value={5}>5 Star</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Package Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Luxury">Luxury</option>
            <option value="Budget">Budget</option>
            <option value="Honeymoon">Honeymoon</option>
            <option value="Family">Family</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>

        {/* City Selection - Now Dynamic Based on Destination */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.name} Cities *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {config.cities.map((city) => (
              <label key={city} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.location.includes(city)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        location: prev.location ? `${prev.location} & ${city}` : city
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        location: prev.location
                          .split(' & ')
                          .filter(c => c !== city)
                          .join(' & ')
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">{city}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Selected cities will be combined with " & " separator.
          </p>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={`Select ${config.name} cities above to generate location`}
          />
        </div>

        {/* Features */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={`Feature ${index + 1}`}
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index)}
                  className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addArrayItem}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Add Feature
          </button>
        </div>

        {/* Highlights */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlights *
          </label>
          <textarea
            name="highlights"
            value={formData.highlights}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter highlights separated by bullet points (•) - e.g., Ho Chi Minh City • Hanoi Old Quarter • Local Markets"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate each highlight with a bullet point (•) for proper formatting
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </div>
          ) : (
            mode === 'create' ? 'Create Package' : 'Update Package'
          )}
        </button>
      </div>
    </form>
  );
};

export default PackageForm; 