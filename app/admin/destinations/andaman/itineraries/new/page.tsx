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

const NewAndamanItineraryPage = () => {
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
      const response = await fetch('/api/admin/destinations/andaman/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
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

  const addActivity = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? { ...day, activities: [...day.activities, ''] } : day
      )
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? { 
          ...day, 
          activities: day.activities.filter((_, j) => j !== activityIndex) 
        } : day
      )
    }));
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? {
              ...day, 
          activities: day.activities.map((activity, j) => 
            j === activityIndex ? value : activity
              )
        } : day
      )
    }));
  };

  const addMeal = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? { ...day, meals: [...day.meals, ''] } : day
      )
    }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? { 
          ...day, 
          meals: day.meals.filter((_, j) => j !== mealIndex) 
        } : day
      )
    }));
  };

  const updateMeal = (dayIndex: number, mealIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, i) => 
        i === dayIndex ? {
          ...day,
          meals: day.meals.map((meal, j) => 
            j === mealIndex ? value : meal
          )
        } : day
      )
    }));
  };

  const addHotelImage = () => {
    setFormData(prev => ({
      ...prev,
      hotelImages: [
        ...prev.hotelImages,
        { src: '', alt: '', name: '', description: '' }
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

  const addArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/destinations/andaman/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination: 'andaman'
        }),
      });

      if (response.ok) {
        alert('Itinerary created successfully!');
        router.push('/admin/destinations/andaman/itineraries');
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Andaman Itinerary</h1>
            <p className="text-gray-600 mt-2">Add a new itinerary for Andaman packages</p>
          </div>
          <Link
            href="/admin/destinations/andaman/itineraries"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Itineraries
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Andaman Paradise Adventure"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the itinerary overview..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linked Package *
                  </label>
                  <select
                    required
                    value={formData.packageId}
                    onChange={(e) => handlePackageChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hotelName}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Andaman Resort & Spa"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    required
                    rows={3}
                    value={formData.hotelDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotelDescription: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the hotel..."
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Image
                  </button>
                </div>

                {formData.hotelImages.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-700">Image {index + 1}</h4>
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
                          placeholder="e.g., Beautiful hotel facade"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Daily Itinerary */}
            <div>
              <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Daily Itinerary</h2>
              <button
                type="button"
                onClick={addDay}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Day
              </button>
            </div>

            {formData.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Day {day.day}</h3>
                  {formData.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIndex)}
                        className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Day
                    </button>
                  )}
                </div>

                  <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={day.title}
                      onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Arrival in Port Blair"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activities
                    </label>
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                            value={activity}
                            onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Visit Cellular Jail"
                          />
                          <button
                            type="button"
                            onClick={() => removeActivity(dayIndex, activityIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                  </div>
                      ))}
                    <button
                      type="button"
                      onClick={() => addActivity(dayIndex)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      + Add Activity
                    </button>
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meals
                      </label>
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                            value={meal}
                            onChange={(e) => updateMeal(dayIndex, mealIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Breakfast at hotel"
                          />
                        <button
                          type="button"
                            onClick={() => removeMeal(dayIndex, mealIndex)}
                            className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                    </div>
                  ))}
                    <button
                      type="button"
                        onClick={() => addMeal(dayIndex)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      + Add Meal
                    </button>
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accommodation
                      </label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Hotel in Port Blair"
                      />
                    </div>
                </div>
              </div>
            ))}
          </div>

            {/* Highlights, Inclusions, Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Highlights</h3>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Snorkeling at Havelock"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('highlights', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                  <button
                    type="button"
                  onClick={() => addArrayItem('highlights')}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                  + Add Highlight
                  </button>
                </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Inclusions</h3>
                {formData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => updateArrayItem('inclusions', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., All meals included"
                    />
                      <button
                        type="button"
                      onClick={() => removeArrayItem('inclusions', index)}
                      className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                  </div>
                ))}
                  <button
                    type="button"
                  onClick={() => addArrayItem('inclusions')}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                  + Add Inclusion
                  </button>
                </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Exclusions</h3>
                {formData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => updateArrayItem('exclusions', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Flight tickets"
                    />
                      <button
                        type="button"
                      onClick={() => removeArrayItem('exclusions', index)}
                      className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('exclusions')}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  + Add Exclusion
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/admin/destinations/andaman/itineraries"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Creating...' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewAndamanItineraryPage; 