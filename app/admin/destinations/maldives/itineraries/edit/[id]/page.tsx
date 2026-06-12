'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../../../components/AdminLayout';

interface Day {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  overview: string;
  packageId?: string;
  hotelName?: string;
  hotelRating?: string;
  hotelDescription?: string;
  hotelImages: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: Day[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

const EditMaldivesItineraryPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    overview: '',
    packageId: '',
    hotelRating: '',
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
    if (params.id) {
      fetchItinerary();
      fetchPackages();
    }
  }, [params.id]);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/admin/destinations/maldives/itineraries/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        // Initialize hotelImages if it doesn't exist
        if (!data.hotelImages) {
          data.hotelImages = [];
        }
        setItinerary(data);
        setFormData({
          title: data.title || '',
          duration: data.duration || '',
          overview: data.overview || '',
          packageId: data.packageId || '',
          hotelRating: data.hotelRating || '',
          days: data.days && data.days.length > 0 ? data.days : [
            {
              day: 1,
              title: '',
              activities: [''],
              meals: [''],
              accommodation: ''
            }
          ],
          inclusions: data.inclusions && data.inclusions.length > 0 ? data.inclusions : [''],
          exclusions: data.exclusions && data.exclusions.length > 0 ? data.exclusions : ['']
        });
      } else {
        alert('Failed to fetch itinerary');
        router.push('/admin/destinations/maldives/itineraries');
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      alert('Failed to fetch itinerary');
      router.push('/admin/destinations/maldives/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await fetch('/api/admin/packages?destination=maldives');
      if (response.ok) {
        const data = await response.json();
        const apiPackages = data.packages || data.package || data;
        const transformedPackages = apiPackages.map((pkg: any) => ({
          id: pkg.id || pkg._id,
          title: pkg.title || pkg.name,
          days: pkg.days || pkg.duration,
          location: pkg.location,
          price: pkg.price,
          type: pkg.type || pkg.category,
          hotelRating: pkg.hotelRating
        }));
        setPackages(transformedPackages);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setPackagesLoading(false);
    }
  };

  // Handle package selection and auto-fill data
  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId: packageId,
        duration: selectedPackage.days || prev.duration,
        hotelRating: selectedPackage.hotelRating || prev.hotelRating
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        packageId: packageId
      }));
    }
  };

  // Hotel Image Management Functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setItinerary(prev => prev ? {
          ...prev,
          hotelImages: [
            ...prev.hotelImages,
            {
              src,
              alt: file.name,
              name: file.name,
              description: ''
            }
          ]
        } : null);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateImageField = (index: number, field: 'name' | 'alt' | 'description', value: string) => {
    setItinerary(prev => prev ? {
      ...prev,
      hotelImages: prev.hotelImages.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    } : null);
  };

  const removeImage = (index: number) => {
    setItinerary(prev => prev ? {
      ...prev,
      hotelImages: prev.hotelImages.filter((_, i) => i !== index)
    } : null);
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

  const addMeal = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, meals: [...day.meals, ''] }
          : day
      )
    }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, meals: day.meals.filter((_, mi) => mi !== mealIndex) }
          : day
      )
    }));
  };

  const updateMeal = (dayIndex: number, mealIndex: number, value: string) => {
    setFormData(prev => ({
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

  const updateInclusion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.map((inclusion, i) => 
        i === index ? value : inclusion
      )
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

  const updateExclusion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.map((exclusion, i) => 
        i === index ? value : exclusion
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/destinations/maldives/itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination: 'maldives',
          updatedAt: new Date().toISOString(),
          // Include hotel data from itinerary state
          hotelName: itinerary?.hotelName,
          hotelDescription: itinerary?.hotelDescription,
          hotelImages: itinerary?.hotelImages || []
        }),
      });

      if (response.ok) {
        alert('Itinerary updated successfully!');
        router.push('/admin/destinations/maldives/itineraries');
      } else {
        const data = await response.json();
        const error = data.error || 'Unknown error';
        alert(`Failed to update itinerary: ${error}`);
      }
    } catch (error) {
      console.error('Failed to update itinerary:', error);
      alert('Failed to update itinerary');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading itinerary...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Maldives Itinerary</h1>
            <p className="text-gray-600 mt-2">Update the travel itinerary details</p>
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
                  placeholder="e.g., Maldives Paradise Escape"
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
                  placeholder="e.g., 7D/6N"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Package *
              </label>
              
              
              {packagesLoading ? (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="font-medium">Loading packages...</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-medium">No packages available</p>
                  <p>You must create packages for Maldives before creating itineraries.</p>
                  <Link
                    href="/admin/destinations/maldives/packages/new"
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
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - {pkg.days} - {pkg.price}
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
                    value={itinerary?.hotelName || ''}
                    onChange={(e) => setItinerary(prev => prev ? { ...prev, hotelName: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Conrad Maldives Resort"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Rating *
                  </label>
                  <select
                    required
                    value={formData.hotelRating}
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
                  value={itinerary?.hotelDescription || ''}
                  onChange={(e) => setItinerary(prev => prev ? { ...prev, hotelDescription: e.target.value } : null)}
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
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="hotel-image-upload"
                    />
                    <label
                      htmlFor="hotel-image-upload"
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm cursor-pointer"
                    >
                      + Upload Images
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itinerary?.hotelImages?.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Image {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Image URL *
                          </label>
                          <input
                            type="url"
                            required
                            value={image.src}
                            onChange={(e) => setItinerary(prev => prev ? {
                              ...prev,
                              hotelImages: prev.hotelImages.map((img, i) => 
                                i === index ? { ...img, src: e.target.value } : img
                              )
                            } : null)}
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
                            onChange={(e) => updateImageField(index, 'alt', e.target.value)}
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
                            onChange={(e) => updateImageField(index, 'name', e.target.value)}
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
                            onChange={(e) => updateImageField(index, 'description', e.target.value)}
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
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
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
                      placeholder="e.g., Arrival & Welcome to Maldives"
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
                      placeholder="e.g., Maldives Resort"
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
                        placeholder="e.g., Snorkeling at house reef"
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
              disabled={saving}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Update Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditMaldivesItineraryPage; 