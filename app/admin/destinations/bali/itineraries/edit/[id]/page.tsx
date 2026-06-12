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
  hotelImages?: {
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

const EditBaliItineraryPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    overview: '',
    destination: 'bali', // Set default destination
    packageId: '',
    hotelName: '',
    hotelRating: '',
    hotelDescription: '',
    hotelImages: [] as {
      src: string;
      alt: string;
      name: string;
      description: string;
    }[],
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
      const response = await fetch(`/api/admin/itineraries/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const itineraryData = data.itinerary || data.itineraries || data;
        setItinerary(itineraryData);
        setFormData({
          title: itineraryData.title || '',
          duration: itineraryData.duration || '',
          overview: itineraryData.overview || '',
          destination: itineraryData.destination || 'bali',
          packageId: itineraryData.packageId || '',
          hotelName: itineraryData.hotelName || '',
          hotelRating: itineraryData.hotelRating || '',
          hotelDescription: itineraryData.hotelDescription || '',
          hotelImages: itineraryData.hotelImages && Array.isArray(itineraryData.hotelImages) ? itineraryData.hotelImages : [],
          days: itineraryData.days && itineraryData.days.length > 0 ? itineraryData.days : [
            {
              day: 1,
              title: '',
              activities: [''],
              meals: [''],
              accommodation: ''
            }
          ],
          inclusions: itineraryData.inclusions && itineraryData.inclusions.length > 0 ? itineraryData.inclusions : [''],
          exclusions: itineraryData.exclusions && itineraryData.exclusions.length > 0 ? itineraryData.exclusions : ['']
        });
      } else {
        alert('Failed to fetch itinerary');
        router.push('/admin/destinations/bali/itineraries');
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      alert('Failed to fetch itinerary');
      router.push('/admin/destinations/bali/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages?destination=bali');
      if (response.ok) {
        const data = await response.json();
        const packages = data.packages || data.package || data;
        setPackages(packages);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          updateImageField(field, base64);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const updateImageField = (field: string, value: string, index?: number, property?: string) => {
    if (field === 'hotelImages') {
      if (typeof index === 'number' && property) {
        // Update specific property of a specific image
        setFormData(prev => ({
          ...prev,
          hotelImages: prev.hotelImages.map((img, i) => 
            i === index ? { ...img, [property]: value } : img
          )
        }));
      } else {
        // Add new image to the array
        setFormData(prev => ({
          ...prev,
          hotelImages: [...prev.hotelImages, {
            src: value,
            alt: 'Hotel Image',
            name: 'Hotel Image',
            description: 'Hotel Image'
          }]
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const removeImage = (field: string, index?: number) => {
    if (field === 'hotelImages' && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        hotelImages: prev.hotelImages.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: '' }));
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
    e.stopPropagation();
    console.log('UPDATE ITINERARY: Starting update process for ID:', params.id);
    console.log('UPDATE ITINERARY: Form data:', formData);
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination: 'bali',
          updatedAt: new Date().toISOString()
        }),
      });

      console.log('UPDATE ITINERARY: Response status:', response.status);
      console.log('UPDATE ITINERARY: Response ok:', response.ok);

      if (response.ok) {
        console.log('UPDATE ITINERARY: Update successful');
        alert('Itinerary updated successfully!');
        router.push('/admin/destinations/bali/itineraries');
      } else {
        const data = await response.json();
        const error = data.error || 'Unknown error';
        console.log('UPDATE ITINERARY: Update failed:', error);
        alert(`Failed to update itinerary: ${error}`);
      }
    } catch (error) {
      console.error('UPDATE ITINERARY: Error occurred:', error);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Bali Itinerary</h1>
          <Link
            href="/admin/destinations/bali/itineraries"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Itineraries
          </Link>
        </div>

        <form id="edit-itinerary-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Itinerary Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 5 Days 4 Nights"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package
              </label>
              <select
                value={formData.packageId}
                onChange={(e) => setFormData(prev => ({ ...prev, packageId: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overview
              </label>
              <textarea
                value={formData.overview}
                onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Hotel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    value={formData.hotelName}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter hotel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel Rating
                  </label>
                  <input
                    type="text"
                    value={formData.hotelRating}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotelRating: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 5 Star"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Description
                </label>
                <textarea
                  value={formData.hotelDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelDescription: e.target.value }))}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Describe the hotel and its amenities"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Images
                </label>
                
                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hotelImages')}
                    className="hidden"
                    id="hotel-image-upload"
                    multiple
                  />
                  <label
                    htmlFor="hotel-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-700">Upload Hotel Images</span>
                    <span className="text-sm text-gray-500">Click to upload multiple images</span>
                  </label>
                </div>

                {/* Image Cards Grid */}
                {formData.hotelImages && formData.hotelImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.hotelImages.map((image, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="relative mb-3">
                          <img
                            src={image.src}
                            alt={image.alt || `Hotel image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('hotelImages', index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={image.name || ''}
                              onChange={(e) => updateImageField('hotelImages', e.target.value, index, 'name')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md"
                              placeholder="Enter image title"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={image.alt || ''}
                              onChange={(e) => updateImageField('hotelImages', e.target.value, index, 'alt')}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md"
                              placeholder="Enter image subtitle"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Description
                            </label>
                            <textarea
                              value={image.description || ''}
                              onChange={(e) => updateImageField('hotelImages', e.target.value, index, 'description')}
                              rows={2}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none"
                              placeholder="Enter image description"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Daily Itinerary</h2>
              <button
                type="button"
                onClick={addDay}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Day
              </button>
            </div>

            {formData.days.map((day, dayIndex) => (
              <div key={dayIndex} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium">Day {day.day}</h3>
                  {formData.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove Day
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day Title
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Arrival in Bali"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accommodation
                    </label>
                    <input
                      type="text"
                      value={day.accommodation}
                      onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Hotel/accommodation details"
                    />
                  </div>

                  {/* Activities */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Activities
                      </label>
                      <button
                        type="button"
                        onClick={() => addActivity(dayIndex)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Add Activity
                      </button>
                    </div>
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="Activity description"
                        />
                        {day.activities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeActivity(dayIndex, activityIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Meals */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Meals
                      </label>
                      <button
                        type="button"
                        onClick={() => addMeal(dayIndex)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Add Meal
                      </button>
                    </div>
                    {day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={meal}
                          onChange={(e) => updateMeal(dayIndex, mealIndex, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., Breakfast, Lunch, Dinner"
                        />
                        {day.meals.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMeal(dayIndex, mealIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Inclusions</h2>
                <button
                  type="button"
                  onClick={addInclusion}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Inclusion
                </button>
              </div>
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => updateInclusion(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="What's included..."
                  />
                  {formData.inclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Exclusions</h2>
                <button
                  type="button"
                  onClick={addExclusion}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Add Exclusion
                </button>
              </div>
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => updateExclusion(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="What's not included..."
                  />
                  {formData.exclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExclusion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/destinations/bali/itineraries"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              id="update-itinerary-button"
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
              onClick={(e) => {
                console.log('UPDATE BUTTON CLICKED: Button clicked');
                e.stopPropagation();
              }}
            >
              {saving ? 'Saving...' : '💾 Update Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditBaliItineraryPage; 