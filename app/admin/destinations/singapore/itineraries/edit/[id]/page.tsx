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

const EditSingaporeItineraryPage = () => {
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
      const response = await fetch(`/api/admin/destinations/singapore/itineraries/${params.id}`);
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
          hotelName: data.hotelName || '',
          hotelRating: data.hotelRating || '',
          hotelDescription: data.hotelDescription || '',
          hotelImages: data.hotelImages && Array.isArray(data.hotelImages) ? data.hotelImages : [],
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
        router.push('/admin/destinations/singapore/itineraries');
      }
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      alert('Failed to fetch itinerary');
      router.push('/admin/destinations/singapore/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/destinations/singapore/packages');
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
      Array.from(files).forEach(file => {
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
        setFormData(prev => ({
          ...prev,
          hotelImages: prev.hotelImages.map((img, i) =>
            i === index ? { ...img, [property]: value } : img
          )
        }));
      } else { // Add new image
        setFormData(prev => ({
          ...prev,
          hotelImages: [...prev.hotelImages, {
            src: value, alt: 'Hotel Image', name: 'Hotel Image', description: 'Hotel Image'
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

  const loadSampleData = () => {
    setFormData({
      title: 'Singapore City Explorer',
      duration: '3 Days 2 Nights',
      overview: 'Discover the vibrant city of Singapore with its modern architecture, cultural diversity, and world-class attractions.',
      packageId: '',
      hotelName: 'Marina Bay Sands',
      hotelRating: '5',
      hotelDescription: 'Luxury hotel with iconic infinity pool and stunning city views',
      hotelImages: [],
      days: [
        {
          day: 1,
          title: 'Arrival & Marina Bay',
          activities: ['Airport pickup', 'Check-in at hotel', 'Marina Bay Sands exploration', 'Gardens by the Bay'],
          meals: ['Welcome dinner at rooftop restaurant'],
          accommodation: 'Marina Bay Sands'
        },
        {
          day: 2,
          title: 'Cultural Heritage',
          activities: ['Chinatown walking tour', 'Little India exploration', 'Kampong Glam visit', 'Merlion Park'],
          meals: ['Breakfast', 'Local lunch', 'Dinner at hawker center'],
          accommodation: 'Marina Bay Sands'
        },
        {
          day: 3,
          title: 'Sentosa Island',
          activities: ['Universal Studios Singapore', 'S.E.A. Aquarium', 'Beach relaxation', 'Departure'],
          meals: ['Breakfast', 'Lunch at resort'],
          accommodation: 'Departure'
        }
      ],
      inclusions: ['Airport transfers', 'Hotel accommodation', 'Daily breakfast', 'Entrance fees', 'Professional guide'],
      exclusions: ['International flights', 'Personal expenses', 'Optional activities', 'Travel insurance']
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      try {
        const response = await fetch(`/api/admin/destinations/singapore/itineraries/${params.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Itinerary deleted successfully!');
          router.push('/admin/destinations/singapore/itineraries');
        } else {
          alert('Failed to delete itinerary');
        }
      } catch (error) {
        console.error('Error deleting itinerary:', error);
        alert('Failed to delete itinerary');
      }
    }
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
      const response = await fetch(`/api/admin/destinations/singapore/itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination: 'singapore',
          updatedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert('Itinerary updated successfully!');
        router.push('/admin/destinations/singapore/itineraries');
      } else {
        const data = await response.json();
        alert(`Failed to update itinerary: ${data.error || 'Unknown error'}`);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Singapore Itinerary</h1>
          <Link
            href="/admin/destinations/singapore/itineraries"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Itineraries
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g., 4 Days 3 Nights"
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
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Images
                </label>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, 'hotelImages')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload multiple images for the hotel</p>
                  </div>

                  {/* Image Display */}
                  {formData.hotelImages.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.hotelImages.map((image, index) => (
                        <div key={index} className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={image.name}
                              onChange={(e) => updateImageField('hotelImages', e.target.value, index, 'name')}
                              placeholder="Image Title"
                              className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            />
                            <input
                              type="text"
                              value={image.alt}
                              onChange={(e) => updateImageField('hotelImages', e.target.value, index, 'alt')}
                              placeholder="Image Subtitle"
                              className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            />
                            <textarea
                              value={image.description}
                              onChange={(e) => updateImageField('hotelImages', e.target.value, index, 'description')}
                              placeholder="Image Description"
                              rows={2}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage('hotelImages', index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                      placeholder="e.g., Arrival in Singapore"
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
              href="/admin/destinations/singapore/itineraries"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditSingaporeItineraryPage; 