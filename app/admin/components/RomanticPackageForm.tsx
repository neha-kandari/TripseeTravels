'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RomanticPackage {
  id?: string;
  image: string;
  days: string;
  title: string;
  location: string;
  destination: string;
  price: string;
  type: string;
  hotelRating: number;
  features: string[];
  highlights: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

interface RomanticItinerary {
  id?: string;
  packageId: string;
  title: string;
  destination: string;
  duration: string;
  overview: string;
  hotelName: string;
  hotelRating: string;
  hotelDescription: string;
  hotelImages: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
}

interface RomanticPackageFormProps {
  package?: RomanticPackage;
  mode: 'create' | 'edit';
}

const RomanticPackageForm: React.FC<RomanticPackageFormProps> = ({ package: packageData, mode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<RomanticPackage>({
    image: '',
    days: '',
    title: '',
    location: '',
    destination: '',
    price: '',
    type: '',
    hotelRating: 4,
    features: [''],
    highlights: ''
  });

  const [itineraryData, setItineraryData] = useState<RomanticItinerary>({
    packageId: '',
    title: '',
    destination: '',
    duration: '',
    overview: 'A romantic getaway designed to create unforgettable memories for couples.',
    hotelName: '',
    hotelRating: '5',
    hotelDescription: '',
    hotelImages: [{ src: '', alt: '', name: '', description: '' }],
    days: [{ day: 1, title: 'Arrival & Welcome', description: 'Arrive at your romantic destination and check into your luxury accommodation.', activities: ['Airport pickup', 'Hotel check-in', 'Welcome drink'], meals: ['Welcome dinner'], accommodation: 'Luxury hotel suite' }],
    inclusions: ['Accommodation', 'Meals as specified', 'Transfers', 'Activities'],
    exclusions: ['Personal expenses', 'Optional activities', 'Travel insurance']
  });

  const [createItinerary, setCreateItinerary] = useState(true);

  useEffect(() => {
    if (packageData) {
      setFormData({
        ...packageData,
        features: packageData.features.length > 0 ? packageData.features : ['']
      });
      
      // If editing, try to load existing itinerary
      if (mode === 'edit' && packageData.id) {
        fetchExistingItinerary(packageData.id);
      }
    } else {
      // For new packages, set default itinerary data
      setItineraryData({
        packageId: '',
        title: '',
        destination: '',
        duration: '',
        overview: 'A romantic getaway designed to create unforgettable memories for couples.',
        hotelName: '',
        hotelRating: '5',
        hotelDescription: '',
        hotelImages: [{ src: '', alt: '', name: '', description: '' }],
        days: [{ day: 1, title: 'Arrival & Welcome', description: 'Arrive at your romantic destination and check into your luxury accommodation.', activities: ['Airport pickup', 'Hotel check-in', 'Welcome drink'], meals: ['Welcome dinner'], accommodation: 'Luxury hotel suite' }],
        inclusions: ['Accommodation', 'Meals as specified', 'Transfers', 'Activities'],
        exclusions: ['Personal expenses', 'Optional activities', 'Travel insurance']
      });
    }
  }, [packageData, mode]);

  const fetchExistingItinerary = async (packageId: string) => {
    try {
      const response = await fetch('/api/admin/romantic-itineraries');
      if (response.ok) {
        const itineraries = await response.json();
        const existingItinerary = itineraries.find((it: any) => it.packageId === packageId);
        if (existingItinerary) {
          setItineraryData(existingItinerary);
          setCreateItinerary(true);
        }
      }
    } catch (error) {
      console.log('No existing itinerary found for this package');
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  // Itinerary helper functions
  const addDay = () => {
    setItineraryData(prev => ({
      ...prev,
      days: [...prev.days, { 
        day: prev.days.length + 1, 
        title: '', 
        description: '', 
        activities: [''], 
        meals: [''], 
        accommodation: '' 
      }]
    }));
  };

  const removeDay = (index: number) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== index)
    }));
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const addActivity = (dayIndex: number) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: [...day.activities, ''] }
          : day
      )
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: day.activities.filter((_, ai) => ai !== activityIndex) }
          : day
      )
    }));
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { 
              ...day, 
              activities: day.activities.map((activity, ai) => 
                ai === activityIndex ? value : activity
              )
            }
          : day
      )
    }));
  };

  const addMeal = (dayIndex: number) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, meals: [...day.meals, ''] }
          : day
      )
    }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, meals: day.meals.filter((_, mi) => mi !== mealIndex) }
          : day
      )
    }));
  };

  const updateMeal = (dayIndex: number, mealIndex: number, value: string) => {
    setItineraryData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { 
              ...day, 
              meals: day.meals.map((meal, mi) => 
                mi === mealIndex ? value : meal
              )
            }
          : day
      )
    }));
  };

  const addInclusion = () => {
    setItineraryData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, '']
    }));
  };

  const removeInclusion = (index: number) => {
    setItineraryData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const updateInclusion = (index: number, value: string) => {
    setItineraryData(prev => ({
      ...prev,
      inclusions: prev.inclusions.map((inclusion, i) => i === index ? value : inclusion)
    }));
  };

  const addExclusion = () => {
    setItineraryData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, '']
    }));
  };

  const removeExclusion = (index: number) => {
    setItineraryData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  const updateExclusion = (index: number, value: string) => {
    setItineraryData(prev => ({
      ...prev,
      exclusions: prev.exclusions.map((exclusion, i) => i === index ? value : exclusion)
    }));
  };

  // Hotel image helper functions
  const addHotelImage = () => {
    setItineraryData(prev => ({
      ...prev,
      hotelImages: [...prev.hotelImages, { src: '', alt: '', name: '', description: '' }]
    }));
  };

  const removeHotelImage = (index: number) => {
    setItineraryData(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.filter((_, i) => i !== index)
    }));
  };

  const updateHotelImage = (index: number, field: keyof typeof itineraryData.hotelImages[0], value: string) => {
    setItineraryData(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  const handleHotelImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateHotelImage(index, 'src', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Validate image URL format
  const validateImageUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check if it's a data URL (uploaded file)
    if (url.startsWith('data:image/')) {
      console.log('Validating data URL, length:', url.length);
      return url.length > 0;
    }
    
    // Check if it's a local path
    if (url.startsWith('/Destination/')) return true;
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Minimal logging for performance
    console.log('Form submission started');
    
    // Fast validation - check all fields at once
    const validationErrors = [];
    
    if (!formData.title.trim()) validationErrors.push('Package title');
    if (!formData.destination.trim()) validationErrors.push('Destination');
    if (!formData.price.trim()) validationErrors.push('Price');
    if (!formData.days.trim()) validationErrors.push('Duration');
    if (!formData.location.trim()) validationErrors.push('Location');
    if (!formData.type.trim()) validationErrors.push('Package type');
    if (formData.features.length === 0 || formData.features.every(f => !f.trim())) validationErrors.push('At least one feature');
    if (!formData.highlights.trim()) validationErrors.push('Package highlights');
    if (!formData.image.trim()) validationErrors.push('Package image');
    
    // Validate itinerary data if creating itinerary
    if (createItinerary) {
      if (!itineraryData.overview.trim()) validationErrors.push('Itinerary overview');
      if (!itineraryData.hotelName.trim()) validationErrors.push('Hotel name');
      if (itineraryData.days.length === 0 || itineraryData.days.every(day => !day.title.trim() && !day.description.trim())) {
        validationErrors.push('At least one itinerary day');
      }
    }
    
    if (validationErrors.length > 0) {
      alert(`Please fill in the following required fields:\n• ${validationErrors.join('\n• ')}`);
      return;
    }
    
    if (!validateImageUrl(formData.image)) {
      alert('Please provide a valid image. You can:\n1. Upload an image file\n2. Use a local destination image\n3. Paste a direct image URL (not webpage URL)');
      return;
    }
    
    setLoading(true);

    try {
      // Clean up features array - remove empty strings
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
      
      const packageData = {
        ...formData,
        features: cleanedFeatures,
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        location: formData.location.trim(),
        price: formData.price.trim(),
        days: formData.days.trim(),
        type: formData.type.trim(),
        highlights: formData.highlights.trim(),
        category: 'romantic'
      };

      // Use the romantic packages API for all operations
      const url = mode === 'create' 
        ? '/api/admin/romantic-packages' 
        : `/api/admin/romantic-packages/${packageData.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      // Add destination and category for MongoDB
      packageData.destination = formData.destination; // Use the selected destination
      packageData.category = 'romantic';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // If creating/updating itinerary is enabled, handle it in parallel
        if (createItinerary && result.id) {
          const itineraryPayload = {
            ...itineraryData,
            packageId: result.id,
            title: formData.title,
            destination: formData.destination,
            duration: formData.days
          };

          // Create itinerary in parallel (don't await)
          const itineraryPromise = (async () => {
            try {
              let itineraryResponse;
              if (mode === 'edit' && itineraryData.id) {
                itineraryResponse = await fetch(`/api/admin/romantic-itineraries/${itineraryData.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(itineraryPayload),
                });
              } else {
                itineraryResponse = await fetch('/api/admin/romantic-itineraries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(itineraryPayload),
                });
              }

              if (itineraryResponse.ok) {
                console.log('Itinerary created successfully');
              } else {
                console.error('Itinerary creation failed');
              }
            } catch (error) {
              console.error('Error creating itinerary:', error);
            }
          })();

          // Don't wait for itinerary creation - show success immediately
          setSuccessMessage(`Romantic package ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
        } else {
          setSuccessMessage(mode === 'edit' ? 'Package updated successfully!' : 'Package created successfully!');
        }
        
        // Redirect immediately for faster UX
        setTimeout(() => {
          router.push('/admin/romantic-packages');
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('API call failed:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save package'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <span className="text-green-500">✅</span>
            {successMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Package Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Package Image <span className="text-red-500">*</span>
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
            type="url"
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
              {formData.image && !formData.image.startsWith('data:') && !formData.image.startsWith('/Destination/') && (
                <div className={`mt-2 text-xs ${validateImageUrl(formData.image) ? 'text-green-600' : 'text-red-600'}`}>
                  {validateImageUrl(formData.image) ? '✅ Valid image URL' : '❌ Invalid image URL format'}
                </div>
              )}
            </div>

            {/* Option 3: Local Destination Images */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                🏝️ Or Use Local Destination Image
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData({ ...formData, image: e.target.value });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select a local destination image</option>
                <option value="/Destination/Maldives.webp">Maldives</option>
                <option value="/Destination/Bali.webp">Bali</option>
                <option value="/Destination/Thailand.webp">Thailand</option>
                <option value="/Destination/Dubai.webp">Dubai</option>
                <option value="/Destination/Singapore.webp">Singapore</option>
                <option value="/Destination/Vietnam.webp">Vietnam</option>
                <option value="/Destination/Malasia.webp">Malaysia</option>
                <option value="/Destination/andaman.webp">Andaman</option>
              </select>
            </div>
          </div>

          {/* Image Preview */}
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

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Package Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., MALDIVES HONEYMOON - Overwater Villa Paradise"
            required
          />
        </div>

        {/* Destination and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination <span className="text-red-500">*</span>
            </label>
            <select
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Select Destination</option>
              <option value="Maldives">Maldives</option>
              <option value="Bali">Bali</option>
              <option value="Thailand">Thailand</option>
              <option value="Dubai">Dubai</option>
              <option value="Singapore">Singapore</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Andaman">Andaman</option>
              <option value="Goa">Goa</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., Ubud & Seminyak"
              required
            />
          </div>
        </div>

        {/* Duration and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="days"
              value={formData.days}
              onChange={(e) => setFormData({ ...formData, days: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., 6 Nights 7 Days"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., ₹1,25,000/-"
              required
            />
          </div>
        </div>

        {/* Package Type and Hotel Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Package Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Select Package Type</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Candle Night">Candle Night</option>
              <option value="Beach Romance">Beach Romance</option>
              <option value="Proposal">Proposal</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>
          <div>
            <label htmlFor="hotelRating" className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Rating <span className="text-red-500">*</span>
            </label>
            <select
              id="hotelRating"
              value={formData.hotelRating}
              onChange={(e) => setFormData({ ...formData, hotelRating: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value={3}>3 Star</option>
              <option value={4}>4 Star</option>
              <option value={5}>5 Star</option>
            </select>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={`Feature ${index + 1}`}
                  required
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
            >
              + Add Feature
            </button>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label htmlFor="highlights" className="block text-sm font-medium text-gray-700 mb-2">
            Highlights <span className="text-red-500">*</span>
          </label>
          <textarea
            id="highlights"
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Private villa • Romantic dinners • Couple massage • Snorkeling together"
            required
          />
          <p className="mt-1 text-sm text-gray-500">Use bullet points (•) to separate highlights</p>
        </div>

        {/* Itinerary Creation Toggle */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="createItinerary"
              checked={createItinerary}
              onChange={(e) => setCreateItinerary(e.target.checked)}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="createItinerary" className="text-lg font-semibold text-gray-900">
              Create Detailed Itinerary for This Package
            </label>
          </div>
          
          {createItinerary && (
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Itinerary Details</h3>
              
              {/* Overview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Overview <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={itineraryData.overview}
                  onChange={(e) => setItineraryData({ ...itineraryData, overview: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the overall experience and highlights of this romantic package"
                  required
                />
              </div>

              {/* Hotel Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itineraryData.hotelName}
                    onChange={(e) => setItineraryData({ ...itineraryData, hotelName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Maldives Paradise Resort"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Rating <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={itineraryData.hotelRating}
                    onChange={(e) => setItineraryData({ ...itineraryData, hotelRating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={itineraryData.hotelDescription}
                  onChange={(e) => setItineraryData({ ...itineraryData, hotelDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the hotel amenities and romantic features"
                  required
                />
              </div>

              {/* Hotel Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Images
                </label>
                <div className="space-y-4">
                  {itineraryData.hotelImages.map((image, imageIndex) => (
                    <div key={imageIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Hotel Image {imageIndex + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeHotelImage(imageIndex)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                        >
                          Remove Image
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Image File</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleHotelImageUpload(imageIndex, file);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Image URL (Alternative)</label>
                          <input
                            type="url"
                            value={image.src}
                            onChange={(e) => updateHotelImage(imageIndex, 'src', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Image Name</label>
                          <input
                            type="text"
                            value={image.name}
                            onChange={(e) => updateHotelImage(imageIndex, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., Hotel Exterior"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Alt Text</label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => updateHotelImage(imageIndex, 'alt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., Beautiful hotel facade"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Image Description</label>
                        <textarea
                          value={image.description}
                          onChange={(e) => updateHotelImage(imageIndex, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Describe what this image shows"
                        />
                      </div>

                      {/* Image Preview */}
                      {image.src && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Preview</label>
                          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image.src}
                              alt={image.alt || image.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const nextElement = target.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden absolute inset-0 items-center justify-center bg-gray-200 text-gray-500">
                              <span>Image preview not available</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addHotelImage}
                    className="w-full px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors border-2 border-dashed border-blue-300"
                  >
                    + Add Hotel Image
                  </button>
                </div>
              </div>

              {/* Daily Itinerary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Itinerary <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  {itineraryData.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Day {dayIndex + 1}</h4>
                        {itineraryData.days.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDay(dayIndex)}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                          >
                            Remove Day
                          </button>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Day Title</label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., Arrival & Welcome"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                          <textarea
                            value={day.description}
                            onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Describe the day's activities"
                          />
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Activities</label>
                        <div className="space-y-2">
                          {day.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={activity}
                                onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder={`Activity ${activityIndex + 1}`}
                              />
                              {day.activities.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeActivity(dayIndex, activityIndex)}
                                  className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addActivity(dayIndex)}
                            className="px-3 py-1 bg-orange-100 text-orange-600 rounded text-sm hover:bg-orange-200"
                          >
                            + Add Activity
                          </button>
                        </div>
                      </div>

                      {/* Meals */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Meals</label>
                        <div className="space-y-2">
                          {day.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={meal}
                                onChange={(e) => updateMeal(dayIndex, mealIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder={`Meal ${mealIndex + 1}`}
                              />
                              {day.meals.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMeal(dayIndex, mealIndex)}
                                  className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addMeal(dayIndex)}
                            className="px-3 py-1 bg-orange-100 text-orange-600 rounded text-sm hover:bg-orange-200"
                          >
                            + Add Meal
                          </button>
                        </div>
                      </div>

                      {/* Accommodation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Accommodation</label>
                        <input
                          type="text"
                          value={day.accommodation}
                          onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Hotel or accommodation for this day"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDay}
                    className="w-full px-4 py-3 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors border-2 border-dashed border-orange-300"
                  >
                    + Add Another Day
                  </button>
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's Included <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {itineraryData.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={inclusion}
                          onChange={(e) => updateInclusion(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder={`Inclusion ${index + 1}`}
                          required
                        />
                        {itineraryData.inclusions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInclusion(index)}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addInclusion}
                      className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200"
                    >
                      + Add Inclusion
                    </button>
                  </div>
                </div>

                {/* Exclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's Not Included <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {itineraryData.exclusions.map((exclusion, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={exclusion}
                          onChange={(e) => updateExclusion(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder={`Exclusion ${index + 1}`}
                          required
                        />
                        {itineraryData.exclusions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExclusion(index)}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addExclusion}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                    >
                      + Add Exclusion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Saving...' : (mode === 'create' ? 'Create Package' : 'Update Package')}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/romantic-packages')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RomanticPackageForm; 
 