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
}

interface HotelImage {
  src: string;
  alt: string;
  name: string;
  description: string;
}

const NewMalaysiaItineraryPage = () => {
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
      }
    ] as HotelImage[],
    days: [
      {
        day: 1,
        title: '',
        activities: [''],
        meals: [''],
        accommodation: ''
      }
    ] as Day[],
    highlights: [''],
    inclusions: [''],
    exclusions: ['']
  });

  // Fetch packages for dropdown
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/destinations/malaysia/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId,
        duration: selectedPackage.days,
        hotelRating: selectedPackage.type === 'Luxury' ? '5' : selectedPackage.type === 'Premium' ? '4' : '3'
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
          activities: [''],
          meals: [''],
          accommodation: ''
        }
      ]
    }));
  };

  const removeDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  const updateDay = (index: number, field: keyof Day, value: any) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const addArrayItem = (field: 'activities' | 'meals' | 'highlights' | 'inclusions' | 'exclusions', dayIndex?: number) => {
    setFormData(prev => {
      if (dayIndex !== undefined) {
        // Update day-specific arrays (activities, meals)
        if (field === 'activities' || field === 'meals') {
          return {
            ...prev,
            days: prev.days.map((day, i) => 
              i === dayIndex ? { ...day, [field]: [...(day[field] as string[]), ''] } : day
            )
          };
        }
        return prev;
      } else {
        // Update form-level arrays (highlights, inclusions, exclusions)
        if (field === 'highlights' || field === 'inclusions' || field === 'exclusions') {
          return {
            ...prev,
            [field]: [...prev[field], '']
          };
        }
        return prev;
      }
    });
  };

  const removeArrayItem = (field: 'activities' | 'meals' | 'highlights' | 'inclusions' | 'exclusions', index: number, dayIndex?: number) => {
    setFormData(prev => {
      if (dayIndex !== undefined) {
        // Update day-specific arrays (activities, meals)
        if (field === 'activities' || field === 'meals') {
          return {
            ...prev,
            days: prev.days.map((day, i) => 
              i === dayIndex ? { ...day, [field]: (day[field] as string[]).filter((_, i) => i !== index) } : day
            )
          };
        }
        return prev;
      } else {
        // Update form-level arrays (highlights, inclusions, exclusions)
        if (field === 'highlights' || field === 'inclusions' || field === 'exclusions') {
          return {
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
          };
        }
        return prev;
      }
    });
  };

  const updateArrayItem = (field: 'activities' | 'meals' | 'highlights' | 'inclusions' | 'exclusions', index: number, value: string, dayIndex?: number) => {
    setFormData(prev => {
      if (dayIndex !== undefined) {
        // Update day-specific arrays (activities, meals)
        if (field === 'activities' || field === 'meals') {
          return {
            ...prev,
            days: prev.days.map((day, i) => 
              i === dayIndex ? { 
                ...day, 
                [field]: (day[field] as string[]).map((item, i) => i === index ? value : item) 
              } : day
            )
          };
        }
        return prev;
      } else {
        // Update form-level arrays (highlights, inclusions, exclusions)
        if (field === 'highlights' || field === 'inclusions' || field === 'exclusions') {
          return {
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
          };
        }
        return prev;
      }
    });
  };

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
    setFormData(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.filter((_, i) => i !== index)
    }));
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
      const response = await fetch('/api/admin/destinations/malaysia/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination: 'malaysia'
        }),
      });

      if (response.ok) {
        alert('Itinerary created successfully!');
        router.push('/admin/destinations/malaysia/itineraries');
      } else {
        const errorData = await response.json();
        alert(`Failed to create itinerary: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert('Failed to create itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Malaysia Itinerary</h1>
            <p className="text-gray-600 mt-2">Design a detailed itinerary for Malaysia packages</p>
          </div>
          <Link
            href="/admin/destinations/malaysia/itineraries"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Back to Itineraries
          </Link>
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
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Kuala Lumpur City Explorer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., 5 Nights 6 Days"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overview *
                </label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the itinerary highlights and what makes it special..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Package *
                </label>
                <select
                  value={formData.packageId}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - {pkg.days} - {pkg.location}
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
                  Hotel Name *
                </label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., The Majestic Hotel Kuala Lumpur"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Rating *
                </label>
                <select
                  value={formData.hotelRating}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelRating: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select rating</option>
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Description *
                </label>
                <textarea
                  value={formData.hotelDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the hotel amenities, location, and unique features..."
                  required
                />
              </div>
            </div>

            {/* Hotel Images */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Hotel Images</h3>
                <button
                  type="button"
                  onClick={addHotelImage}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  Add Image
                </button>
              </div>

              <div className="space-y-4">
                {formData.hotelImages.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={image.src}
                          onChange={(e) => updateHotelImage(index, 'src', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateHotelImage(index, 'alt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Hotel exterior view"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image Name
                        </label>
                        <input
                          type="text"
                          value={image.name}
                          onChange={(e) => updateHotelImage(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Hotel Exterior View"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={image.description}
                          onChange={(e) => updateHotelImage(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Beautiful hotel facade with modern architecture"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHotelImage(index)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Itinerary</h2>
              <button
                type="button"
                onClick={addDay}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Add Day
              </button>
            </div>

            <div className="space-y-6">
              {formData.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Day {day.day}</h3>
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

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day Title *
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., Arrival in Kuala Lumpur"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activities
                      </label>
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) => updateArrayItem('activities', activityIndex, e.target.value, dayIndex)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., Visit Petronas Twin Towers"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('activities', activityIndex, dayIndex)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('activities', dayIndex)}
                        className="text-orange-600 hover:text-orange-800 text-sm"
                      >
                        + Add Activity
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meals
                      </label>
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={meal}
                            onChange={(e) => updateArrayItem('meals', mealIndex, e.target.value, dayIndex)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="e.g., Breakfast, Lunch"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('meals', mealIndex, dayIndex)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('meals', dayIndex)}
                        className="text-orange-600 hover:text-orange-800 text-sm"
                      >
                        + Add Meal
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Accommodation *
                      </label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., The Majestic Hotel Kuala Lumpur"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights, Inclusions, Exclusions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlights
                </label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Petronas Twin Towers visit"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('highlights', index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('highlights')}
                  className="text-orange-600 hover:text-orange-800 text-sm"
                >
                  + Add Highlight
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inclusions
                </label>
                {formData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => updateArrayItem('inclusions', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., All transfers"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('inclusions', index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('inclusions')}
                  className="text-orange-600 hover:text-orange-800 text-sm"
                >
                  + Add Inclusion
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exclusions
                </label>
                {formData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => updateArrayItem('exclusions', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., International flights"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('exclusions', index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('exclusions')}
                  className="text-orange-600 hover:text-orange-800 text-sm"
                >
                  + Add Exclusion
                </button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/destinations/malaysia/itineraries"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewMalaysiaItineraryPage;