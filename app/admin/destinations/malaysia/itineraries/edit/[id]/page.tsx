'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  hotelImages: {
    src: string;
    alt: string;
    name: string;
    description: string;
  }[];
  days: {
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}
const EditMalaysiaItineraryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const itineraryId = params.id as string;
    fetchItinerary(itineraryId);
    fetchPackages();
  }, [params.id]);

  const fetchItinerary = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/destinations/malaysia/itineraries/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const itineraryData = data.itinerary || data.itineraries || data;
        // Initialize hotelImages if it doesn't exist
        if (!data.hotelImages) {
          data.hotelImages = [];
        }
        setItinerary(itineraryData);
      } else {
        alert('Failed to fetch itinerary');
        router.push('/admin/destinations/malaysia/itineraries');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      alert('Error fetching itinerary');
      router.push('/admin/destinations/malaysia/itineraries');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const response = await fetch('/api/admin/destinations/malaysia/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        console.error('Failed to fetch packages');
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/destinations/malaysia/itineraries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });

      if (response.ok) {
        alert('Itinerary updated successfully!');
        router.push('/admin/destinations/malaysia/itineraries');
      } else {
        const data = await response.json();
        const errorData = data.packages || data.package || data;
        alert(`Failed to update itinerary: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      alert('Error updating itinerary');
    } finally {
      setSaving(false);
    }
  };

  const addDay = () => {
    if (!itinerary) return;
    const newDay = {
      day: itinerary.days.length + 1,
      title: '',
      activities: [''],
      meals: [],
      accommodation: ''
    };
    setItinerary({
      ...itinerary,
      days: [...itinerary.days, newDay]
    });
  };

  const removeDay = (dayIndex: number) => {
    if (!itinerary) return;
    const updatedDays = itinerary.days.filter((_, index) => index !== dayIndex);
    // Renumber days
    const renumberedDays = updatedDays.map((day, index) => ({
      ...day,
      day: index + 1
    }));
    setItinerary({
      ...itinerary,
      days: renumberedDays
    });
  };

  const updateDay = (dayIndex: number, field: string, value: any) => {
    if (!itinerary) return;
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      [field]: value
    };
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const addActivity = (dayIndex: number) => {
    if (!itinerary) return;
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities.push('');
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    if (!itinerary) return;
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter((_, index) => index !== activityIndex);
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    if (!itinerary) return;
    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex].activities[activityIndex] = value;
    setItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const addInclusion = () => {
    if (!itinerary) return;
    setItinerary({
      ...itinerary,
      inclusions: [...itinerary.inclusions, '']
    });
  };

  const removeInclusion = (index: number) => {
    if (!itinerary) return;
    setItinerary({
      ...itinerary,
      inclusions: itinerary.inclusions.filter((_, i) => i !== index)
    });
  };

  const addExclusion = () => {
    if (!itinerary) return;
    setItinerary({
      ...itinerary,
      exclusions: [...itinerary.exclusions, '']
    });
  };

  const removeExclusion = (index: number) => {
    if (!itinerary) return;
    setItinerary({
      ...itinerary,
      exclusions: itinerary.exclusions.filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!itinerary) return;
    
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      const reader = new FileReader();
      return new Promise<{
        src: string;
        alt: string;
        name: string;
        description: string;
      }>((resolve) => {
        reader.onload = (e) => {
          resolve({
            src: e.target?.result as string,
            alt: file.name,
            name: file.name.split('.')[0],
            description: ''
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((images) => {
      setItinerary({
        ...itinerary,
        hotelImages: [...itinerary.hotelImages, ...images]
      });
    });

    // Reset the input
    event.target.value = '';
  };

  const updateImageField = (index: number, field: string, value: string) => {
    if (!itinerary) return;
    const updatedImages = [...itinerary.hotelImages];
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    setItinerary({
      ...itinerary,
      hotelImages: updatedImages
    });
  };

  const removeImage = (index: number) => {
    if (!itinerary) return;
    const updatedImages = itinerary.hotelImages.filter((_, i) => i !== index);
    setItinerary({
      ...itinerary,
      hotelImages: updatedImages
    });
  };

  const handleDelete = async () => {
    if (!itinerary) return;
    
    if (!window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/itineraries/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Itinerary deleted successfully!');
        router.push('/admin/destinations/malaysia/itineraries');
      } else {
        const data = await response.json();
        const errorData = data.packages || data.package || data;
        alert(`Failed to delete itinerary: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Error deleting itinerary');
    } finally {
      setSaving(false);
    }
  };

  const loadSampleData = () => {
    if (!window.confirm('This will replace all current data with sample data. Continue?')) {
      return;
    }

    if (!itinerary) return;

    setItinerary({
      ...itinerary,
      title: 'Malaysia Cultural Adventure - 6 Days',
      duration: '6D/5N',
      overview: 'Experience the rich cultural heritage and modern marvels of Malaysia. From the bustling streets of Kuala Lumpur to the historic charm of Malacca, discover the perfect blend of tradition and modernity.',
      hotelName: 'The Majestic Hotel Kuala Lumpur',
      hotelRating: '5',
      hotelDescription: 'A luxurious 5-star hotel located in the heart of Kuala Lumpur, offering world-class amenities, stunning city views, and exceptional service. Features include a rooftop infinity pool, multiple dining options, spa services, and easy access to major attractions.',
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
        }
      ],
      days: [
        {
          day: 1,
          title: 'Arrival in Kuala Lumpur',
          activities: [
            'Airport pickup and transfer to hotel',
            'Check-in and welcome briefing',
            'Evening city tour of KLCC area',
            'Dinner at traditional Malaysian restaurant'
          ],
          meals: ['Dinner'],
          accommodation: 'The Majestic Hotel Kuala Lumpur'
        },
        {
          day: 2,
          title: 'Kuala Lumpur City Exploration',
          activities: [
            'Visit Petronas Twin Towers',
            'Explore Batu Caves',
            'Lunch at Central Market',
            'Shopping at Bukit Bintang',
            'Evening at KL Tower'
          ],
          meals: ['Breakfast', 'Lunch'],
          accommodation: 'The Majestic Hotel Kuala Lumpur'
        },
        {
          day: 3,
          title: 'Malacca Heritage Tour',
          activities: [
            'Morning drive to Malacca',
            'Visit Christ Church and Red Square',
            'Explore Jonker Street',
            'Traditional Peranakan lunch',
            'Visit A Famosa Fort',
            'Return to Kuala Lumpur'
          ],
          meals: ['Breakfast', 'Lunch'],
          accommodation: 'The Majestic Hotel Kuala Lumpur'
        },
        {
          day: 4,
          title: 'Cameron Highlands Adventure',
          activities: [
            'Early morning drive to Cameron Highlands',
            'Visit tea plantations',
            'Strawberry picking experience',
            'Lunch at local restaurant',
            'Visit butterfly garden',
            'Return to Kuala Lumpur'
          ],
          meals: ['Breakfast', 'Lunch'],
          accommodation: 'The Majestic Hotel Kuala Lumpur'
        },
        {
          day: 5,
          title: 'Free Day & Optional Activities',
          activities: [
            'Free time for personal exploration',
            'Optional: Genting Highlands day trip',
            'Optional: Sunway Lagoon theme park',
            'Optional: Shopping at Pavilion KL',
            'Farewell dinner at hotel'
          ],
          meals: ['Breakfast', 'Dinner'],
          accommodation: 'The Majestic Hotel Kuala Lumpur'
        },
        {
          day: 6,
          title: 'Departure',
          activities: [
            'Check-out from hotel',
            'Last-minute shopping',
            'Transfer to airport',
            'Departure'
          ],
          meals: ['Breakfast'],
          accommodation: 'N/A'
        }
      ],
      inclusions: [
        '5 nights accommodation in 5-star hotel',
        'Daily breakfast',
        'All transfers in air-conditioned vehicle',
        'Professional English-speaking guide',
        'Entrance fees to all attractions',
        'Traditional Malaysian dinner',
        'Airport transfers',
        'All taxes and service charges'
      ],
      exclusions: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Optional activities',
        'Lunch and dinner (except mentioned)',
        'Tips and gratuities',
        'Visa fees (if applicable)'
      ]
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading itinerary...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!itinerary) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Itinerary not found</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Malaysia Itinerary</h1>
            <p className="text-gray-600 mt-2">Update the travel itinerary details</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={loadSampleData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Load Sample Data
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Delete Itinerary
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">

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
                  value={itinerary.title}
                  onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Malaysia Cultural Heritage Tour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  required
                  value={itinerary.duration}
                  onChange={(e) => setItinerary({ ...itinerary, duration: e.target.value })}
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
                  <p>You must create packages for Malaysia before creating itineraries.</p>
                  <Link
                    href="/admin/destinations/malaysia/packages/new"
                    className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
                  >
                    Create Package First
                  </Link>
                </div>
              ) : (
                <select
                  required
                  value={itinerary.packageId || ''}
                  onChange={(e) => setItinerary({ ...itinerary, packageId: e.target.value })}
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
                value={itinerary.overview}
                onChange={(e) => setItinerary({ ...itinerary, overview: e.target.value })}
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
                    value={itinerary.hotelName || ''}
                    onChange={(e) => setItinerary({ ...itinerary, hotelName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Kuala Lumpur Grand Hotel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Rating *
                  </label>
                  <select
                    required
                    value={itinerary.hotelRating || ''}
                    onChange={(e) => setItinerary({ ...itinerary, hotelRating: e.target.value })}
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
                  value={itinerary.hotelDescription || ''}
                  onChange={(e) => setItinerary({ ...itinerary, hotelDescription: e.target.value })}
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
                  {itinerary.hotelImages?.map((image, index) => (
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
                            onChange={(e) => updateImageField(index, 'src', e.target.value)}
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

            {itinerary.days.map((day, dayIndex) => (
              <div key={dayIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Day {day.day}</h3>
                  {itinerary.days.length > 1 && (
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
                      placeholder="e.g., Arrival & Welcome to Kuala Lumpur"
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
                      placeholder="e.g., Kuala Lumpur Hotel"
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
                        placeholder="e.g., Visit Petronas Towers"
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
              
              {itinerary.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => {
                      const updated = [...itinerary.inclusions];
                      updated[index] = e.target.value;
                      setItinerary({ ...itinerary, inclusions: updated });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Airport transfers"
                  />
                  {itinerary.inclusions.length > 1 && (
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
              
              {itinerary.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => {
                      const updated = [...itinerary.exclusions];
                      updated[index] = e.target.value;
                      setItinerary({ ...itinerary, exclusions: updated });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., International flights"
                  />
                  {itinerary.exclusions.length > 1 && (
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

export default EditMalaysiaItineraryPage; 