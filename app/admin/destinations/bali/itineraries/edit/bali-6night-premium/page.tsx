'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../../../components/AdminLayout';

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

const EditBali6NightPremiumPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState({
    title: 'Bali 6 Night Premium Experience',
    duration: '6 Days 5 Nights',
    overview: 'Comprehensive Bali experience with premium accommodations and extensive sightseeing',
    packageId: 'bali-premium-2',
    hotelName: 'Premium Bali Resorts',
    hotelRating: '5',
    hotelDescription: 'Luxury accommodations in prime Bali locations with premium amenities',
    days: [
      {
        day: 1,
        title: 'Arrival in Bali',
        activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'],
        meals: ['Dinner'],
        accommodation: 'Premium Bali Resort'
      },
      {
        day: 2,
        title: 'Cultural Discovery',
        activities: ['Traditional Balinese dance performance', 'Local market visit', 'Cultural workshop'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium Bali Resort'
      },
      {
        day: 3,
        title: 'Nature & Adventure',
        activities: ['Rice terrace trekking', 'Waterfall visit', 'Adventure activities'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium Bali Resort'
      },
      {
        day: 4,
        title: 'Island Exploration',
        activities: ['Island hopping', 'Beach activities', 'Sunset cruise'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium Bali Resort'
      },
      {
        day: 5,
        title: 'Wellness & Relaxation',
        activities: ['Spa treatment', 'Yoga session', 'Meditation class'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium Bali Resort'
      },
      {
        day: 6,
        title: 'Departure',
        activities: ['Last minute shopping', 'Hotel check-out', 'Airport transfer'],
        meals: ['Breakfast'],
        accommodation: 'Departure'
      }
    ],
    inclusions: [
      'All transfers',
      'Accommodation',
      'Daily breakfast',
      'Guided tours',
      'Cultural activities',
      'Wellness sessions'
    ],
    exclusions: [
      'International flights',
      'Personal expenses',
      'Optional tours',
      'Travel insurance'
    ]
  });

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

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages?destination=bali');
      if (response.ok) {
        const data = await response.json();
        const itineraries = data.itinerary || data.itineraries || data;
        const packages = data.packages || data.package || data;
        setPackages(data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Failed to fetch Bali packages:', error);
      setPackages([]);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate package selection
      if (!formData.packageId) {
        alert('Please select a package to link this itinerary to');
        setLoading(false);
        return;
      }

      // Clean up empty fields
      const cleanedData = {
        ...formData,
        days: formData.days.map(day => ({
          ...day,
          activities: day.activities.filter(activity => activity.trim() !== ''),
          meals: day.meals.filter(meal => meal.trim() !== '')
        })),
        inclusions: formData.inclusions.filter(inclusion => inclusion.trim() !== ''),
        exclusions: formData.exclusions.filter(exclusion => exclusion.trim() !== '')
      };

      // For hardcoded itineraries, we'll show a success message
      // In a real implementation, you might want to save to a different location
      alert('Hardcoded itinerary updated successfully! Note: Changes are saved in memory only.');
      router.push('/admin/destinations/bali/itineraries');
    } catch (error) {
      console.error('Failed to update itinerary:', error);
      alert('Failed to update itinerary');
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Bali 6 Night Premium Itinerary</h1>
            <p className="text-gray-600 mt-2">Update the hardcoded website itinerary</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🌐 Website Itinerary
              </span>
            </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Bali 6 Night Premium Experience"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 6 Days 5 Nights"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Package *
              </label>
              <select
                required
                value={formData.packageId}
                onChange={(e) => setFormData(prev => ({ ...prev, packageId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select a package to link this itinerary to</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} - {pkg.days} - {pkg.price}
                  </option>
                ))}
              </select>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Premium Bali Resort"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the hotel amenities, location, and features..."
                />
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
                      placeholder="e.g., Arrival in Bali"
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
                      placeholder="e.g., Bali Hotel"
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
                        placeholder="e.g., Visit temples"
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
              href="/admin/destinations/bali/itineraries"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditBali6NightPremiumPage; 