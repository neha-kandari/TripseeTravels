'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CityFilter {
  id: number;
  name: string;
  count: number;
  isActive: boolean;
  order: number;
}

interface CityFiltersData {
  [destination: string]: CityFilter[];
}

const CityFiltersPage = () => {
  const router = useRouter();
  const [cityFilters, setCityFilters] = useState<CityFiltersData>({});
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<CityFilter | null>(null);
  const [addingCity, setAddingCity] = useState<{ destination: string; name: string }>({ destination: '', name: '' });
  const [selectedDestination, setSelectedDestination] = useState<string>('bali');

  const destinations = [
    { key: 'bali', name: 'Bali' },
    { key: 'vietnam', name: 'Vietnam' },
    { key: 'thailand', name: 'Thailand' },
    { key: 'singapore', name: 'Singapore' },
    { key: 'malaysia', name: 'Malaysia' },
    { key: 'dubai', name: 'Dubai' },
    { key: 'maldives', name: 'Maldives' },
    { key: 'andaman', name: 'Andaman' }
  ];

  useEffect(() => {
    fetchCityFilters();
  }, []);

  const fetchCityFilters = async () => {
    try {
      const response = await fetch('/api/admin/city-filters');
      const data = await response.json();
      setCityFilters(data);
    } catch (error) {
      console.error('Error fetching city filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async () => {
    if (!addingCity.destination || !addingCity.name.trim()) {
      alert('Please select a destination and enter a city name');
      return;
    }

    try {
      const response = await fetch('/api/admin/city-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: addingCity.destination,
          name: addingCity.name.trim(),
        }),
      });

      if (response.ok) {
        await fetchCityFilters();
        setAddingCity({ destination: '', name: '' });
        alert('City added successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding city:', error);
      alert('Failed to add city');
    }
  };

  const handleEditCity = async (city: CityFilter) => {
    try {
      const response = await fetch('/api/admin/city-filters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: selectedDestination,
          id: city.id,
          name: city.name,
          isActive: city.isActive,
          order: city.order,
        }),
      });

      if (response.ok) {
        await fetchCityFilters();
        setEditingCity(null);
        alert('City updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating city:', error);
      alert('Failed to update city');
    }
  };

  const handleDeleteCity = async (cityId: number) => {
    if (!confirm('Are you sure you want to delete this city?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/city-filters?destination=${selectedDestination}&id=${cityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCityFilters();
        alert('City deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting city:', error);
      alert('Failed to delete city');
    }
  };

  const handleToggleActive = async (city: CityFilter) => {
    const updatedCity = { ...city, isActive: !city.isActive };
    await handleEditCity(updatedCity);
  };

  const handleReorder = async (city: CityFilter, newOrder: number) => {
    const updatedCity = { ...city, order: newOrder };
    await handleEditCity(updatedCity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading city filters...</div>
      </div>
    );
  }

  const currentCities = cityFilters[selectedDestination] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">City Filters Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage city filters for all destinations
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Destination Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Destination
          </label>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            {destinations.map((dest) => (
              <option key={dest.key} value={dest.key}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New City */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New City</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Name
              </label>
              <input
                type="text"
                value={addingCity.name}
                onChange={(e) => setAddingCity({ ...addingCity, name: e.target.value })}
                placeholder="Enter city name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button
              onClick={handleAddCity}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Add City
            </button>
          </div>
        </div>

        {/* City Filters List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {destinations.find(d => d.key === selectedDestination)?.name} Cities
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCities
                  .sort((a, b) => a.order - b.order)
                  .map((city) => (
                    <tr key={city.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={city.order}
                          onChange={(e) => handleReorder(city, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCity?.id === city.id ? (
                          <input
                            type="text"
                            value={editingCity.name}
                            onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{city.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(city)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            city.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {city.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingCity?.id === city.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCity(editingCity)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCity(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCity(city)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCity(city.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Order:</strong> Change the number to reorder cities in the filter</li>
            <li>• <strong>Status:</strong> Toggle between Active/Inactive to show/hide cities</li>
            <li>• <strong>Edit:</strong> Click edit to modify city names</li>
            <li>• <strong>Delete:</strong> Remove cities you no longer want to show</li>
            <li>• <strong>Real-time:</strong> Changes automatically reflect on the website</li>
            <li>• <strong>Auto-refresh:</strong> Website refreshes cities every 30 seconds</li>
          </ul>
        </div>

        {/* Test Changes Section */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-900 mb-2">Test Your Changes:</h3>
          <p className="text-sm text-green-800 mb-3">
            After making changes in the admin panel, you can test them on the website:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/destination/bali"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🏝️ View Bali Page
            </a>
            <a
              href="/destination/vietnam"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🏛️ View Vietnam Page
            </a>
            <a
              href="/destination/thailand"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🏮 View Thailand Page
            </a>
            <a
              href="/destination/singapore"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🏙️ View Singapore Page
            </a>
            <a
              href="/destination/malaysia"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🌴 View Malaysia Page
            </a>
            <a
              href="/destination/dubai"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🕌 View Dubai Page
            </a>
            <a
              href="/destination/maldives"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🏝️ View Maldives Page
            </a>
            <a
              href="/destination/andaman"
              target="_blank"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🏖️ View Andaman Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityFiltersPage; 