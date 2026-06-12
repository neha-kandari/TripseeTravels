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

const NewSingaporeItineraryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    overview: '',
    destination: 'singapore', // Set default destination
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
        meals: [] as string[],
        accommodation: ''
      }
    ],
    inclusions: [] as string[],
    exclusions: [] as string[]
  });

  // Fetch packages from API
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/destinations/singapore/packages');
      if (response.ok) {
        const data = await response.json();
        const packages = data.packages || data.package || data;
        setPackages(packages);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/destinations/singapore/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          days: formData.days.map(day => ({
            ...day,
            activities: day.activities.filter(activity => activity.trim() !== ''),
            meals: day.meals.filter(meal => meal.trim() !== '')
          })).filter(day => day.title.trim() !== '' || day.accommodation.trim() !== ''), // Remove empty days
          inclusions: formData.inclusions.filter(inclusion => inclusion.trim() !== ''),
          exclusions: formData.exclusions.filter(exclusion => exclusion.trim() !== ''),
          hotelImages: formData.hotelImages || []
        }),
      });

      if (response.ok) {
        alert('Itinerary created successfully!');
        router.push('/admin/destinations/singapore/itineraries');
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

  const addDay = () => {
    setFormData({
      ...formData,
      days: [
        ...formData.days,
        {
          day: formData.days.length + 1,
          title: '',
          activities: [''],
          meals: [''],
          accommodation: ''
        }
      ]
    });
  };

  const removeDay = (index: number) => {
    if (formData.days.length > 1) {
      const newDays = formData.days.filter((_, i) => i !== index);
      // Renumber days
      const renumberedDays = newDays.map((day, i) => ({
        ...day,
        day: i + 1
      }));
      setFormData({
        ...formData,
        days: renumberedDays
      });
    }
  };

  const updateDay = (index: number, field: keyof Day, value: any) => {
    const newDays = [...formData.days];
    newDays[index] = { ...newDays[index], [field]: value };
    setFormData({ ...formData, days: newDays });
  };

  const addActivity = (dayIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].activities.push('');
    setFormData({ ...formData, days: newDays });
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newDays = [...formData.days];
    if (newDays[dayIndex].activities.length > 1) {
      newDays[dayIndex].activities.splice(activityIndex, 1);
      setFormData({ ...formData, days: newDays });
    }
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    const newDays = [...formData.days];
    newDays[dayIndex].activities[activityIndex] = value;
    setFormData({ ...formData, days: newDays });
  };

  const addMeal = (dayIndex: number) => {
    const newDays = [...formData.days];
    newDays[dayIndex].meals.push('');
    setFormData({ ...formData, days: newDays });
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    const newDays = [...formData.days];
    if (newDays[dayIndex].meals.length > 1) {
      newDays[dayIndex].meals.splice(mealIndex, 1);
      setFormData({ ...formData, days: newDays });
    }
  };

  const updateMeal = (dayIndex: number, mealIndex: number, value: string) => {
    const newDays = [...formData.days];
    newDays[dayIndex].meals[mealIndex] = value;
    setFormData({ ...formData, days: newDays });
  };

  const addHotelImage = () => {
    setFormData({
      ...formData,
      hotelImages: [
        ...formData.hotelImages,
        {
          src: '',
          alt: '',
          name: '',
          description: ''
        }
      ]
    });
  };

  const removeHotelImage = (index: number) => {
    if (formData.hotelImages.length > 1) {
      setFormData({
        ...formData,
        hotelImages: formData.hotelImages.filter((_, i) => i !== index)
      });
    }
  };

  const updateHotelImage = (index: number, field: keyof HotelImage, value: string) => {
    const newImages = [...formData.hotelImages];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, hotelImages: newImages });
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Singapore Itinerary</h1>
          <p className="text-gray-600">Add a new itinerary for Singapore packages</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Itinerary Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter itinerary title"
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
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5 Days 4 Nights"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview *
              </label>
              <textarea
                required
                value={formData.overview}
                onChange={(e) => setFormData({...formData, overview: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter itinerary overview"
              />
            </div>
          </div>

          {/* Package Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Package</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package *
              </label>
              <select
                required
                value={formData.packageId}
                onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} - {pkg.days} - {pkg.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hotel Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hotelName}
                  onChange={(e) => setFormData({...formData, hotelName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hotel name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Rating *
                </label>
                <select
                  required
                  value={formData.hotelRating}
                  onChange={(e) => setFormData({...formData, hotelRating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Description *
              </label>
              <textarea
                required
                value={formData.hotelDescription}
                onChange={(e) => setFormData({...formData, hotelDescription: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter hotel description"
              />
            </div>
          </div>

          {/* Hotel Images */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Hotel Images</h2>
              <button
                type="button"
                onClick={addHotelImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                Add Image
              </button>
            </div>
            
            {formData.hotelImages.map((image, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Hotel Image {index + 1}</h3>
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
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
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
              <div key={dayIndex} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Day {day.day}</h3>
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
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={day.title}
                      onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., Arrival in Singapore"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Activities *
                    </label>
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          required
                          value={activity}
                          onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Enter activity"
                        />
                        {day.activities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeActivity(dayIndex, activityIndex)}
                            className="px-3 py-2 text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addActivity(dayIndex)}
                      className="px-3 py-1 text-blue-500 hover:text-blue-700 text-sm"
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
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Accommodation *
                    </label>
                    <input
                      type="text"
                      required
                      value={day.accommodation}
                      onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., Hotel in Marina Bay"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inclusions and Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Inclusions</h2>
                <button
                  type="button"
                  onClick={addInclusion}
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
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
                      className="px-3 py-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              {formData.inclusions.length === 0 && (
                <button
                  type="button"
                  onClick={addInclusion}
                  className="w-full text-left text-green-500 hover:text-green-700 text-sm font-medium"
                >
                  + Add inclusion
                </button>
              )}
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Exclusions</h2>
                <button
                  type="button"
                  onClick={addExclusion}
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
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
                      className="px-3 py-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              {formData.exclusions.length === 0 && (
                <button
                  type="button"
                  onClick={addExclusion}
                  className="w-full text-left text-green-500 hover:text-green-700 text-sm font-medium"
                >
                  + Add exclusion
                </button>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/destinations/singapore/itineraries"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewSingaporeItineraryPage;