'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ItineraryDay {
  title: string;
  description: string;
  activities: string[];
  meals: string[];
}

interface RomanticItinerary {
  id: string;
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

const EditRomanticItineraryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<RomanticItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchItinerary();
    }
  }, [params.id]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/romantic-itineraries/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setItinerary(data);
      } else {
        setError('Failed to fetch itinerary');
      }
    } catch (error) {
      setError('Error fetching itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinerary) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/romantic-itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });

      if (response.ok) {
        alert('Itinerary updated successfully!');
        router.push('/admin/romantic-itineraries');
      } else {
        alert('Failed to update itinerary');
      }
    } catch (error) {
      alert('Error updating itinerary');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for managing form data
  const updateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const addDay = () => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: [...prev!.days, { title: '', description: '', activities: [''], meals: [''] }]
    }));
  };

  const removeDay = (index: number) => {
    if (!itinerary || itinerary.days.length <= 1) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.filter((_, i) => i !== index)
    }));
  };

  const addActivity = (dayIndex: number) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: [...day.activities, ''] }
          : day
      )
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: day.activities.filter((_, ai) => ai !== activityIndex) }
          : day
      )
    }));
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
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
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, meals: [...day.meals, ''] }
          : day
      )
    }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
        i === dayIndex 
          ? { ...day, meals: day.meals.filter((_, mi) => mi !== mealIndex) }
          : day
      )
    }));
  };

  const updateMeal = (dayIndex: number, mealIndex: number, value: string) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      days: prev!.days.map((day, i) => 
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
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      inclusions: [...prev!.inclusions, '']
    }));
  };

  const removeInclusion = (index: number) => {
    if (!itinerary || itinerary.inclusions.length <= 1) return;
    setItinerary(prev => ({
      ...prev!,
      inclusions: prev!.inclusions.filter((_, i) => i !== index)
    }));
  };

  const updateInclusion = (index: number, value: string) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      inclusions: prev!.inclusions.map((inclusion, i) => i === index ? value : inclusion)
    }));
  };

  const addExclusion = () => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      exclusions: [...prev!.exclusions, '']
    }));
  };

  const removeExclusion = (index: number) => {
    if (!itinerary || itinerary.exclusions.length <= 1) return;
    setItinerary(prev => ({
      ...prev!,
      exclusions: prev!.exclusions.filter((_, i) => i !== index)
    }));
  };

  const updateExclusion = (index: number, value: string) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      exclusions: prev!.exclusions.map((exclusion, i) => i === index ? value : exclusion)
    }));
  };

  // Hotel image helper functions
  const addHotelImage = () => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      hotelImages: [...prev!.hotelImages, { src: '', alt: '', name: '', description: '' }]
    }));
  };

  const removeHotelImage = (index: number) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      hotelImages: prev!.hotelImages.filter((_, i) => i !== index)
    }));
  };

  const updateHotelImage = (index: number, field: 'src' | 'alt' | 'name' | 'description', value: string) => {
    if (!itinerary) return;
    setItinerary(prev => ({
      ...prev!,
      hotelImages: prev!.hotelImages.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  const handleHotelImageUpload = (index: number, file: File) => {
    if (!itinerary) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateHotelImage(index, 'src', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Itinerary</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested itinerary could not be found.'}</p>
            <button
              onClick={() => router.push('/admin/romantic-itineraries')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Itineraries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Romantic Itinerary</h1>
            <p className="text-gray-600 mt-2">Modify itinerary details for {itinerary.title}</p>
          </div>
          <button
            onClick={() => router.push('/admin/romantic-itineraries')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Itineraries
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itinerary.title}
                    onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itinerary.destination}
                    onChange={(e) => setItinerary({ ...itinerary, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itinerary.duration}
                    onChange={(e) => setItinerary({ ...itinerary, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 5 Nights 6 Days"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Overview <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={itinerary.overview}
                    onChange={(e) => setItinerary({ ...itinerary, overview: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hotel Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itinerary.hotelName}
                    onChange={(e) => setItinerary({ ...itinerary, hotelName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Rating <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={itinerary.hotelRating}
                    onChange={(e) => setItinerary({ ...itinerary, hotelRating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={itinerary.hotelDescription}
                  onChange={(e) => setItinerary({ ...itinerary, hotelDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {/* Hotel Images */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Images</h2>
              <div className="space-y-4">
                {itinerary.hotelImages.map((image, imageIndex) => (
                  <div key={imageIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                        <label className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={image.src}
                          onChange={(e) => updateHotelImage(imageIndex, 'src', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateHotelImage(imageIndex, 'alt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        value={image.description}
                        onChange={(e) => updateHotelImage(imageIndex, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
              <div className="space-y-4">
                {itinerary.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Day {dayIndex + 1}</h4>
                      {itinerary.days.length > 1 && (
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          value={day.description}
                          onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Meals</label>
                      <div className="space-y-2">
                        {day.meals.map((meal, mealIndex) => (
                          <div key={mealIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={meal}
                              onChange={(e) => updateMeal(dayIndex, mealIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-2">
                  {itinerary.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={inclusion}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      {itinerary.inclusions.length > 1 && (
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h3>
                <div className="space-y-2">
                  {itinerary.exclusions.map((exclusion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={exclusion}
                        onChange={(e) => updateExclusion(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      {itinerary.exclusions.length > 1 && (
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

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-8 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Itinerary'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/romantic-itineraries')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRomanticItineraryPage; 