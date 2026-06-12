'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../../../components/AdminLayout';

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
  days: any[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

const EditBali4StarPropertiesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '4 Star Properties Package - Golden Tulip & Desa Swan',
    duration: '5 Nights 6 Days',
    overview: 'Premium 4-star accommodations with private pool villas and comprehensive activities',
    packageId: 'bali-premium-2',
    hotelName: 'Golden Tulip Jineng & Desa Swan Villa',
    hotelRating: '4',
    hotelDescription: '2 nights @ Golden Tulip Jineng (Deluxe Room) + 3 nights @ Desa Swan Villa (Private Pool Villa)',
    days: [
      { day: 1, title: 'Arrival in Bali', activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'], meals: ['Dinner'], accommodation: 'Golden Tulip Jineng' },
      { day: 2, title: 'Beach & Watersports', activities: ['Watersports activities', 'Beach relaxation', 'Sunset at Tanah Lot'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Golden Tulip Jineng' },
      { day: 3, title: 'Transfer to Ubud', activities: ['Check-out from Jineng', 'Transfer to Ubud', 'Ubud Palace visit'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Desa Swan Villa' },
      { day: 4, title: 'Cultural Ubud', activities: ['Tegallalang rice terraces', 'Ubud market', 'Traditional dance performance'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Desa Swan Villa' },
      { day: 5, title: 'Temple Tour', activities: ['Ulun Danu Temple', 'Handara Gate', 'Tirta Empul Temple'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Desa Swan Villa' },
      { day: 6, title: 'Departure', activities: ['Last minute shopping', 'Hotel check-out', 'Airport transfer'], meals: ['Breakfast'], accommodation: 'Departure' }
    ],
    inclusions: [
      'All transfers',
      'Accommodation',
      'Daily breakfast',
      'Watersports activities',
      'Temple tours',
      'Cultural experiences'
    ],
    exclusions: [
      'International flights',
      'Personal expenses',
      'Optional tours',
      'Travel insurance'
    ]
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages?destination=bali');
      if (response.ok) {
        const data = await response.json();
        const itineraries = data.itinerary || data.itineraries || data;
        const packages = data.packages || data.package || data;
        setPackages(data);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      setPackages([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/itineraries/bali-4star-properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        router.push('/admin/destinations/bali/itineraries');
      } else {
        const data = await response.json();
        const itineraries = data.itinerary || data.itineraries || data;      
          const errorData = data.packages || data.package || data;
        alert(`Failed to update itinerary: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update itinerary:', error);
      alert('Failed to update itinerary: Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayChange = (dayIndex: number, field: string, value: any) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const handleActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].activities[activityIndex] = value;
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const handleMealChange = (dayIndex: number, mealIndex: number, value: string) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].meals[mealIndex] = value;
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const addActivity = (dayIndex: number) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].activities.push('');
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const addMeal = (dayIndex: number) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].meals.push('');
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    const updatedDays = [...formData.days];
    updatedDays[dayIndex].meals.splice(mealIndex, 1);
    setFormData(prev => ({ ...prev, days: updatedDays }));
  };

  const handleInclusionChange = (index: number, value: string) => {
    const updatedInclusions = [...formData.inclusions];
    updatedInclusions[index] = value;
    setFormData(prev => ({ ...prev, inclusions: updatedInclusions }));
  };

  const addInclusion = () => {
    setFormData(prev => ({ ...prev, inclusions: [...prev.inclusions, ''] }));
  };

  const removeInclusion = (index: number) => {
    const updatedInclusions = formData.inclusions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, inclusions: updatedInclusions }));
  };

  const handleExclusionChange = (index: number, value: string) => {
    const updatedExclusions = [...formData.exclusions];
    updatedExclusions[index] = value;
    setFormData(prev => ({ ...prev, exclusions: updatedExclusions }));
  };

  const addExclusion = () => {
    setFormData(prev => ({ ...prev, exclusions: [...prev.exclusions, ''] }));
  };

  const removeExclusion = (index: number) => {
    const updatedExclusions = formData.exclusions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, exclusions: updatedExclusions }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Bali 4 Star Properties Itinerary</h1>
            <p className="text-gray-600 mt-2">Update the 4-star properties package itinerary details</p>
          </div>
          <Link
            href="/admin/destinations/bali/itineraries"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
          >
            ← Back to Itineraries
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Package & Hotel Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Package & Hotel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
                <select
                  value={formData.packageId}
                  onChange={(e) => handleInputChange('packageId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Rating</label>
                <select
                  value={formData.hotelRating}
                  onChange={(e) => handleInputChange('hotelRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select rating</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => handleInputChange('hotelName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Description</label>
                <textarea
                  value={formData.hotelDescription}
                  onChange={(e) => handleInputChange('hotelDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Itinerary</h3>
            <div className="space-y-6">
              {formData.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day {day.day}</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => handleDayChange(dayIndex, 'accommodation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activities</label>
                    <div className="space-y-2">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeActivity(dayIndex, activityIndex)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addActivity(dayIndex)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        + Add Activity
                      </button>
                    </div>
                  </div>

                  {/* Meals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meals</label>
                    <div className="space-y-2">
                      {day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={meal}
                            onChange={(e) => handleMealChange(dayIndex, mealIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeMeal(dayIndex, mealIndex)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addMeal(dayIndex)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        + Add Meal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inclusions</h3>
            <div className="space-y-2">
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => handleInclusionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeInclusion(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addInclusion}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                + Add Inclusion
              </button>
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exclusions</h3>
            <div className="space-y-2">
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => handleExclusionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeExclusion(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExclusion}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                + Add Exclusion
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/destinations/bali/itineraries"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditBali4StarPropertiesPage; 