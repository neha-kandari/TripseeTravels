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

const EditDubaiItineraryPage = () => {
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
    destination: 'dubai', // Set default destination
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
        activities: [] as string[],
        meals: [] as string[],
        accommodation: ''
      }
    ],
    inclusions: [] as string[],
    exclusions: [] as string[]
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
        console.log('Fetched itinerary data:', data);
        
        // Handle different response structures
        const itineraryData = data.itinerary || data.itineraries || data;
        console.log('Processed itinerary data:', itineraryData);
        
        // Initialize hotelImages if it doesn't exist
        if (!itineraryData.hotelImages) {
          itineraryData.hotelImages = [];
        }
        
        setItinerary(itineraryData);
        setFormData({
          title: itineraryData.title || '',
          duration: itineraryData.duration || '',
          overview: itineraryData.overview || '',
          destination: itineraryData.destination || 'dubai',
          packageId: itineraryData.packageId || '',
          hotelName: itineraryData.hotelName || '',
          hotelRating: itineraryData.hotelRating || '',
          hotelDescription: itineraryData.hotelDescription || '',
          hotelImages: itineraryData.hotelImages && Array.isArray(itineraryData.hotelImages) ? itineraryData.hotelImages : [],
          days: itineraryData.days && itineraryData.days.length > 0 ? itineraryData.days : [
            {
              day: 1,
              title: '',
              activities: [] as string[],
              meals: [] as string[],
              accommodation: ''
            }
          ],
          inclusions: itineraryData.inclusions && itineraryData.inclusions.length > 0 ? itineraryData.inclusions : [] as string[],
          exclusions: itineraryData.exclusions && itineraryData.exclusions.length > 0 ? itineraryData.exclusions : [] as string[]
        });
        
        console.log('Form data set:', {
          title: itineraryData.title || '',
          hotelName: itineraryData.hotelName || '',
          hotelRating: itineraryData.hotelRating || '',
          hotelDescription: itineraryData.hotelDescription || '',
          hotelImages: itineraryData.hotelImages
        });
      } else {
        console.error('Failed to fetch itinerary:', response.status);
        router.push('/admin/destinations/dubai/itineraries');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      router.push('/admin/destinations/dubai/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/packages?destination=dubai');
      if (response.ok) {
        const data = await response.json();
        const packages = data.packages || data.package || data;
        setPackages(Array.isArray(packages) ? packages : []);
      } else {
        console.error('Failed to fetch packages');
        setPackages([]);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  // Handle package selection and auto-set hotel rating
  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId: packageId,
        hotelRating: selectedPackage.hotelRating?.toString() || '4' // Auto-set hotel rating from package
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        packageId: packageId
      }));
    }
  };

  // Helper functions for form management
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

  const removeDay = (dayIndex: number) => {
    if (formData.days.length > 1) {
      setFormData(prev => ({
        ...prev,
        days: prev.days.filter((_, index) => index !== dayIndex).map((day, i) => ({
          ...day,
          day: i + 1
        }))
      }));
    }
  };

  const updateDay = (dayIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const addActivity = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: [...day.activities, ''] }
          : day
      )
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.filter((_, i) => i !== activityIndex)
            }
          : day
      )
    }));
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, i) =>
                i === activityIndex ? value : activity
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

  const updateHotelImage = (index: number, field: 'src' | 'alt' | 'name' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => {
      return new Promise<{
        src: string;
        alt: string;
        name: string;
        description: string;
      }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            src: e.target?.result as string,
            alt: file.name,
            name: file.name,
            description: ''
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((images) => {
      setFormData(prev => ({
        ...prev,
        hotelImages: [...prev.hotelImages, ...images]
      }));
    });

    // Clear the input
    event.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up empty fields
      const cleanedData = {
        ...formData,
        days: formData.days.map(day => ({
          ...day,
          activities: day.activities.filter(activity => activity.trim() !== ''),
          meals: day.meals.filter(meal => meal.trim() !== '')
        })),
        inclusions: formData.inclusions.filter(inclusion => inclusion.trim() !== ''),
        exclusions: formData.exclusions.filter(exclusion => exclusion.trim() !== ''),
        hotelImages: formData.hotelImages.filter(image => image.src.trim() !== '')
      };

      const response = await fetch(`/api/admin/itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        alert('Itinerary updated successfully!');
        router.push('/admin/destinations/dubai/itineraries');
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/destinations/dubai/itineraries/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Itinerary deleted successfully!');
        router.push('/admin/destinations/dubai/itineraries');
      } else {
        const data = await response.json();
        alert(`Failed to delete itinerary: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete itinerary:', error);
      alert('Failed to delete itinerary');
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Dubai Itinerary</h1>
            <p className="text-gray-600 mt-2">Update the travel itinerary details</p>
          </div>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            🗑️ Delete Itinerary
          </button>
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
                  placeholder="e.g., Dubai Luxury Experience"
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
              {packages.length > 0 ? (
                <select
                  required
                  value={formData.packageId}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a package to link this itinerary to</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} - {pkg.days} - {pkg.price}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-medium">No packages available</p>
                  <p>You must create packages for Dubai before creating itineraries.</p>
                  <Link
                    href="/admin/destinations/dubai/packages/new"
                    className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
                  >
                    Create Package First
                  </Link>
                </div>
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
                  required
                  value={formData.hotelName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hotelName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dubai Resort & Spa"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the hotel amenities, location, and features..."
              />
            </div>

            {/* Hotel Images */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="hotel-image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="hotel-image-upload"
                  className="cursor-pointer bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 inline-flex items-center"
                >
                  <span className="mr-2">📷</span>
                  Upload Hotel Images
                </label>
                <p className="text-sm text-gray-500 mt-2">Click to upload multiple images</p>
              </div>
            </div>

            {formData.hotelImages && formData.hotelImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {formData.hotelImages.map((image, index) => (
                  <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <input
                        type="text"
                        value={image.name}
                        onChange={(e) => updateHotelImage(index, 'name', e.target.value)}
                        className="w-full text-sm font-medium mb-2 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateHotelImage(index, 'alt', e.target.value)}
                        className="w-full text-xs text-gray-600 mb-2 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Subtitle"
                      />
                      <textarea
                        value={image.description}
                        onChange={(e) => updateHotelImage(index, 'description', e.target.value)}
                        className="w-full text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={() => removeHotelImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No hotel images uploaded yet</p>
                <p className="text-sm">Upload images to showcase the hotel</p>
              </div>
            )}
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
                      placeholder="e.g., Arrival & Welcome to Dubai"
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
                      placeholder="e.g., Dubai Hotel"
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
                        placeholder="e.g., Visit Burj Khalifa"
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

export default EditDubaiItineraryPage;