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
  days: string;
  location: string;
  price: string;
  type: string;
  hotelRating: number;
}

interface HotelImage {
  src: string;
  alt: string;
  name: string;
  description: string;
}

const NewThailandItineraryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    overview: '',
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
        activities: [''],
        meals: [''],
        accommodation: ''
      }
    ],
    inclusions: [''],
    exclusions: ['']
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/destinations/thailand/packages');
      if (response.ok) {
        const data = await response.json();
        const packages = data.packages || [];
        setPackages(packages);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
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
          activities: [''],
          meals: [''],
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
      const response = await fetch('/api/admin/destinations/thailand/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination: 'thailand',
          days: formData.days.filter(day => day.title.trim() !== ''),
          inclusions: formData.inclusions.filter(inc => inc.trim() !== ''),
          exclusions: formData.exclusions.filter(exc => exc.trim() !== ''),
          hotelImages: formData.hotelImages.filter(img => img.src.trim() !== '')
        }),
      });

      if (response.ok) {
        router.push('/admin/destinations/thailand/itineraries');
      } else {
        const errorData = await response.json();
        alert(`Failed to create itinerary: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create itinerary:', error);
      alert('Failed to create itinerary: Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Thailand Itinerary</h1>
            <p className="text-gray-600 mt-2">Design a detailed travel itinerary for Thailand</p>
          </div>
          <Link
            href="/admin/destinations/thailand/itineraries"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Itineraries
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Bangkok & Phuket Adventure"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 5 Nights 6 Days"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overview *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the itinerary highlights and what makes it special..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Package (Optional)
                </label>
                <select
                  value={formData.packageId}
                  onChange={(e) => {
                    const selectedPackageId = e.target.value;
                    const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);
                    
                    setFormData(prev => ({
                      ...prev,
                      packageId: selectedPackageId,
                      hotelRating: selectedPackage ? selectedPackage.hotelRating.toString() : prev.hotelRating,
                      duration: selectedPackage ? selectedPackage.days : prev.duration
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - {pkg.days}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hotel Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hotel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., The Peninsula Bangkok"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Rating
                </label>
                <select
                  value={formData.hotelRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelRating: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Rating</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Description
                </label>
                <textarea
                  rows={3}
                  value={formData.hotelDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the hotel amenities and features..."
                />
              </div>
            </div>

            {/* Hotel Images */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Hotel Images</h3>
                <button
                  type="button"
                  onClick={addHotelImage}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Image
                </button>
              </div>

              <div className="space-y-4">
                {formData.hotelImages.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
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

          {/* Daily Itinerary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Itinerary</h2>
              <button
                type="button"
                onClick={addDay}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Day
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
                      className="text-red-500 hover:text-red-700"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Arrival in Bangkok"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Bangkok Hotel"
                    />
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Activities *
                    </label>
                    <button
                      type="button"
                      onClick={() => addActivity(dayIndex)}
                      className="text-sm text-orange-500 hover:text-orange-700"
                    >
                      + Add Activity
                    </button>
                  </div>
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        required
                        value={activity}
                        onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Visit Grand Palace"
                      />
                      {day.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                          className="px-3 py-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Meals */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Meals Included
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newMeals = [...day.meals, ''];
                        updateDay(dayIndex, 'meals', newMeals);
                      }}
                      className="text-sm text-orange-500 hover:text-orange-700"
                    >
                      + Add Meal
                    </button>
                  </div>
                  {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex gap-2 mb-2">
                      <select
                        value={meal}
                        onChange={(e) => {
                          const newMeals = [...day.meals];
                          newMeals[mealIndex] = e.target.value;
                          updateDay(dayIndex, 'meals', newMeals);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select Meal</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="All Meals">All Meals</option>
                      </select>
                      {day.meals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newMeals = day.meals.filter((_, i) => i !== mealIndex);
                            updateDay(dayIndex, 'meals', newMeals);
                          }}
                          className="px-3 py-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                  <button
                    type="button"
                    onClick={addInclusion}
                    className="text-sm text-orange-500 hover:text-orange-700"
                  >
                    + Add Inclusion
                  </button>
                </div>
                {formData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => {
                        const newInclusions = [...formData.inclusions];
                        newInclusions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, inclusions: newInclusions }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., All transfers"
                    />
                    {formData.inclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInclusion(index)}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Exclusions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">What's Not Included</h3>
                  <button
                    type="button"
                    onClick={addExclusion}
                    className="text-sm text-orange-500 hover:text-orange-700"
                  >
                    + Add Exclusion
                  </button>
                </div>
                {formData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => {
                        const newExclusions = [...formData.exclusions];
                        newExclusions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, exclusions: newExclusions }));
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., International flights"
                    />
                    {formData.exclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExclusion(index)}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/destinations/thailand/itineraries"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewThailandItineraryPage; 