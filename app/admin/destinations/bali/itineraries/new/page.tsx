'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../../components/AdminLayout';

interface Day {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

interface Package {
  id: string;
  title: string;
  name: string;
  description: string;
  days: string;
  duration: string;
  destination: string;
  price: string;
  category: string;
  type: string;
  hotelRating?: number;
}

interface HotelImage {
  src: string;
  alt: string;
  name: string;
  description: string;
}

const NewBaliItineraryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    overview: '',
    destination: 'bali', // Set default destination
    packageId: '', // Link to specific package
    hotelName: '',
    hotelRating: '',
    hotelDescription: '',
    hotelImages: [
      {
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Hotel Exterior",
        name: "Hotel Exterior View",
        description: "Beautiful hotel facade with modern architecture"
      },
      {
        src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Luxury Room",
        name: "Deluxe Room",
        description: "Spacious room with premium amenities and city view"
      },
      {
        src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        alt: "Swimming Pool",
        name: "Infinity Pool",
        description: "Stunning infinity pool with panoramic views"
      },
      {
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Hotel Lobby",
        name: "Grand Lobby",
        description: "Elegant lobby with sophisticated design"
      },
      {
        src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Restaurant",
        name: "Fine Dining Restaurant",
        description: "World-class dining experience with local cuisine"
      },
      {
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Spa & Wellness",
        name: "Spa & Wellness Center",
        description: "Relaxing spa treatments and wellness facilities"
      }
    ],
    days: [
      {
        day: 1,
        title: '',
        activities: [] as string[],
        meals: [] as string[],
        accommodation: ''
      }
    ],
    inclusions: [] as string[],
    exclusions: [] as string[]
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages?destination=bali');
      if (response.ok) {
        const data = await response.json();
        const packages = data.packages || data.package || data;
        console.log('Fetched packages for itinerary:', packages);
        setPackages(Array.isArray(packages) ? packages : []);
      } else {
        console.error('Failed to fetch packages:', response.status);
        setPackages([]);
      }
    } catch (error) {
      console.error('Failed to fetch Bali packages:', error);
      setPackages([]);
    }
  };

  // Handle package selection and auto-set hotel rating
  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId: packageId,
        hotelRating: selectedPackage.hotelRating?.toString() || '4' // Auto-set hotel rating from package
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        packageId: packageId
      }));
    }
  };

  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [
        ...prev.days,
        {
          day: prev.days.length + 1,
          title: '',
          activities: [] as string[],
          meals: [] as string[],
          accommodation: ''
        }
      ]
    }));
  };

  const removeDay = (index: number) => {
    if (formData.days.length > 1) {
      setFormData(prev => ({
        ...prev,
        days: prev.days.filter((_, i) => i !== index).map((day, i) => ({
          ...day,
          day: i + 1
        }))
      }));
    }
  };

  const updateDay = (index: number, field: keyof Day, value: any) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const addActivity = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: [...day.activities, ''] }
          : day
      )
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: day.activities.filter((_, ai) => ai !== activityIndex) }
          : day
      )
    }));
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setFormData(prev => ({
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

  const addInclusion = () => {
    setFormData(prev => ({
      ...prev,
      inclusions: [...prev.inclusions, '']
    }));
  };

  const removeInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const addExclusion = () => {
    setFormData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, '']
    }));
  };

  const removeExclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  // Hotel Image Management Functions
  const addHotelImage = () => {
    setFormData(prev => ({
      ...prev,
      hotelImages: [
        ...prev.hotelImages,
        {
          src: '',
          alt: '',
          name: '',
          description: ''
        }
      ]
    }));
  };

  const removeHotelImage = (index: number) => {
    if (formData.hotelImages.length > 1) {
      setFormData(prev => ({
        ...prev,
        hotelImages: prev.hotelImages.filter((_, i) => i !== index)
      }));
    }
  };

  const updateHotelImage = (index: number, field: keyof HotelImage, value: string) => {
    setFormData(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Please enter an itinerary title');
        setLoading(false);
        return;
      }
      
      if (!formData.duration.trim()) {
        alert('Please enter the duration');
        setLoading(false);
        return;
      }
      
      if (!formData.overview.trim()) {
        alert('Please enter an overview');
        setLoading(false);
        return;
      }
      
      if (!formData.packageId) {
        alert('Please select a package to link this itinerary to');
        setLoading(false);
        return;
      }

      // Clean up empty fields
      const cleanedData = {
        ...formData,
        destination: 'bali', // Always set destination to bali for this page
        days: formData.days.map(day => ({
          ...day,
          activities: day.activities.filter(activity => activity.trim() !== ''),
          meals: day.meals.filter(meal => meal.trim() !== '')
        })).filter(day => day.title.trim() !== '' || day.accommodation.trim() !== ''), // Remove empty days
        inclusions: formData.inclusions.filter(inclusion => inclusion.trim() !== ''),
        exclusions: formData.exclusions.filter(exclusion => exclusion.trim() !== ''),
        hotelImages: formData.hotelImages || []
      };

      console.log('Sending data to API:', cleanedData);

      // Validate the data structure before sending
      if (!cleanedData.title || !cleanedData.duration || !cleanedData.overview) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/admin/destinations/bali/itineraries');
      } else {
        let errorMessage = 'Unknown error';
        let errorDetails = '';
        
        try {
          const data = await response.json();
          console.error('API Error Response:', data);
          errorMessage = data.error || 'Unknown error';
          errorDetails = data.details || '';
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          console.error('Response status:', response.status);
          console.error('Response headers:', response.headers);
          const textResponse = await response.text();
          console.error('Raw response:', textResponse);
          errorMessage = `Server error (${response.status}): ${textResponse || 'No response body'}`;
        }
        
        alert(`Failed to create itinerary: ${errorMessage}${errorDetails ? `\nDetails: ${errorDetails}` : ''}`);
      }
    } catch (error) {
      console.error('Failed to create itinerary:', error);
      alert('Failed to create itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Bali Itinerary</h1>
            <p className="text-gray-600 mt-2">Design a comprehensive travel itinerary for Bali</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Itinerary Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Bali Cultural & Beach Adventure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 5D/4N"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Package *
              </label>
              {!Array.isArray(packages) || packages.length === 0 ? (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-medium">No packages available</p>
                  <p>You must create packages for Bali before creating itineraries.</p>
                  <Link
                    href="/admin/destinations/bali/packages/new"
                    className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
                  >
                    Create Package First
                  </Link>
                </div>
              ) : (
                <select
                  required
                  value={formData.packageId}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a package to link this itinerary to</option>
                  {Array.isArray(packages) && packages.map((pkg, index) => (
                    <option key={pkg.id || `package-${index}`} value={pkg.id || ''}>
                      {pkg.title || pkg.name || 'Untitled Package'} - {pkg.days || pkg.duration || 'N/A'} - {pkg.price || 'N/A'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview *
              </label>
              <textarea
                required
                rows={3}
                value={formData.overview}
                onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Brief description of the itinerary..."
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hotelName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Bali Resort & Spa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Rating *
                  </label>
                  <select
                    required
                    value={formData.hotelRating || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotelRating: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Rating</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.hotelDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelDescription: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe the hotel amenities, location, and features..."
                />
              </div>

              {/* Hotel Images Management */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Hotel Images
                  </label>
                  <button
                    type="button"
                    onClick={addHotelImage}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                  >
                    + Add Image
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.hotelImages.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Image {index + 1}</h4>
                        {formData.hotelImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHotelImage(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Image URL *
                          </label>
                          <input
                            type="url"
                            required
                            value={image.src}
                            onChange={(e) => updateHotelImage(index, 'src', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Alt Text *
                          </label>
                          <input
                            type="text"
                            required
                            value={image.alt}
                            onChange={(e) => updateHotelImage(index, 'alt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="e.g., Hotel Exterior"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Image Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={image.name}
                            onChange={(e) => updateHotelImage(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="e.g., Hotel Exterior View"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description *
                          </label>
                          <input
                            type="text"
                            required
                            value={image.description}
                            onChange={(e) => updateHotelImage(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="e.g., Beautiful hotel facade with modern architecture"
                          />
                        </div>
                      </div>
                      
                      {/* Image Preview */}
                      {image.src && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Preview:
                          </label>
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/128x96?text=Invalid+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Itinerary</h2>
              <button
                type="button"
                onClick={addDay}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                + Add Day
              </button>
            </div>

            {formData.days.map((day, dayIndex) => (
              <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Day {day.day}</h3>
                  {formData.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIndex)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Day
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={day.title}
                      onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Arrival & Welcome to Bali"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accommodation *
                    </label>
                    <input
                      type="text"
                      required
                      value={day.accommodation}
                      onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Bali Resort & Spa"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activities *
                  </label>
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        required
                        value={activity}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Visit Sacred Monkey Forest"
                      />
                      {day.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                          className="text-red-600 hover:text-red-700 text-sm px-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addActivity(dayIndex)}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    + Add Activity
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meals Included
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                      <label key={meal} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={day.meals.includes(meal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateDay(dayIndex, 'meals', [...day.meals, meal]);
                            } else {
                              updateDay(dayIndex, 'meals', day.meals.filter(m => m !== meal));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{meal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Inclusions</h3>
                <button
                  type="button"
                  onClick={addInclusion}
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  + Add
                </button>
              </div>
              
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      inclusions: prev.inclusions.map((inc, i) => i === index ? e.target.value : inc)
                    }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Airport transfers"
                  />
                  {formData.inclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
                      className="text-red-600 hover:text-red-700 text-sm px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Exclusions</h3>
                <button
                  type="button"
                  onClick={addExclusion}
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  + Add
                </button>
              </div>
              
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      exclusions: prev.exclusions.map((exc, i) => i === index ? e.target.value : exc)
                    }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., International flights"
                  />
                  {formData.exclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExclusion(index)}
                      className="text-red-600 hover:text-red-700 text-sm px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewBaliItineraryPage; 