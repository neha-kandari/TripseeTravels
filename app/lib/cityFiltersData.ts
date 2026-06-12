// Shared city filters data storage
// This module maintains the data in memory and can be imported by multiple API routes

export interface CityFilter {
  id: number;
  name: string;
  count: number;
  isActive: boolean;
  order: number;
}

export interface CityFiltersData {
  [destination: string]: CityFilter[];
}

// Initialize with default city filters
export const cityFilters: CityFiltersData = {
  bali: [
    { id: 1, name: "Kuta", count: 0, isActive: true, order: 1 },
    { id: 2, name: "Ubud", count: 0, isActive: true, order: 2 },
    { id: 3, name: "Seminyak", count: 0, isActive: true, order: 3 },
    { id: 4, name: "Umalas", count: 0, isActive: true, order: 4 },
    { id: 5, name: "Nusa Penida", count: 0, isActive: true, order: 5 },
    { id: 6, name: "Gili T", count: 0, isActive: true, order: 6 },
    { id: 7, name: "Benoa", count: 0, isActive: true, order: 7 },
    { id: 8, name: "Jineng", count: 0, isActive: true, order: 8 }
  ],
  vietnam: [
    { id: 9, name: "Ho Chi Minh", count: 0, isActive: true, order: 1 },
    { id: 10, name: "Da Nang", count: 0, isActive: true, order: 2 },
    { id: 11, name: "Hanoi", count: 0, isActive: true, order: 3 },
    { id: 12, name: "Ha Long Bay", count: 0, isActive: true, order: 4 },
    { id: 13, name: "Krong Siem Reap", count: 0, isActive: true, order: 5 },
    { id: 14, name: "Phnom Penh", count: 0, isActive: true, order: 6 },
    { id: 15, name: "Hoi An", count: 0, isActive: true, order: 7 },
    { id: 16, name: "Phu Quoc", count: 0, isActive: true, order: 8 },
    { id: 17, name: "Sa Pa", count: 0, isActive: true, order: 9 },
    { id: 18, name: "Mui Ne", count: 0, isActive: true, order: 10 },
    { id: 19, name: "Nha Trang", count: 0, isActive: true, order: 11 },
    { id: 20, name: "Hue", count: 0, isActive: true, order: 12 }
  ],
  thailand: [
    { id: 21, name: "Bangkok", count: 0, isActive: true, order: 1 },
    { id: 22, name: "Phuket", count: 0, isActive: true, order: 2 },
    { id: 23, name: "Chiang Mai", count: 0, isActive: true, order: 3 },
    { id: 24, name: "Krabi", count: 0, isActive: true, order: 4 },
    { id: 25, name: "Koh Samui", count: 0, isActive: true, order: 5 },
    { id: 26, name: "Ayutthaya", count: 0, isActive: true, order: 6 },
    { id: 27, name: "Pattaya", count: 0, isActive: true, order: 7 },
    { id: 28, name: "Hua Hin", count: 0, isActive: true, order: 8 }
  ],
  singapore: [
    { id: 29, name: "Singapore City", count: 0, isActive: true, order: 1 },
    { id: 30, name: "Sentosa", count: 0, isActive: true, order: 2 },
    { id: 31, name: "Marina Bay", count: 0, isActive: true, order: 3 },
    { id: 32, name: "Chinatown", count: 0, isActive: true, order: 4 },
    { id: 33, name: "Little India", count: 0, isActive: true, order: 5 },
    { id: 34, name: "Orchard Road", count: 0, isActive: true, order: 6 },
    { id: 35, name: "Clarke Quay", count: 0, isActive: true, order: 7 }
  ],
  malaysia: [
    { id: 36, name: "Kuala Lumpur", count: 0, isActive: true, order: 1 },
    { id: 37, name: "Penang", count: 0, isActive: true, order: 2 },
    { id: 38, name: "Langkawi", count: 0, isActive: true, order: 3 },
    { id: 39, name: "Malacca", count: 0, isActive: true, order: 4 },
    { id: 40, name: "Cameron Highlands", count: 0, isActive: true, order: 5 },
    { id: 41, name: "Taman Negara", count: 0, isActive: true, order: 6 },
    { id: 42, name: "Borneo", count: 0, isActive: true, order: 7 }
  ],
  dubai: [
    { id: 43, name: "Dubai City", count: 0, isActive: true, order: 1 },
    { id: 44, name: "Abu Dhabi", count: 0, isActive: true, order: 2 },
    { id: 45, name: "Sharjah", count: 0, isActive: true, order: 3 },
    { id: 46, name: "Ajman", count: 0, isActive: true, order: 4 },
    { id: 47, name: "Fujairah", count: 0, isActive: true, order: 5 },
    { id: 48, name: "Ras Al Khaimah", count: 0, isActive: true, order: 6 },
    { id: 49, name: "Umm Al Quwain", count: 0, isActive: true, order: 7 }
  ],
  maldives: [
    { id: 50, name: "Male", count: 0, isActive: true, order: 1 },
    { id: 51, name: "Hulhumale", count: 0, isActive: true, order: 2 },
    { id: 52, name: "Maafushi", count: 0, isActive: true, order: 3 },
    { id: 53, name: "Gulhi", count: 0, isActive: true, order: 4 },
    { id: 54, name: "Thulusdhoo", count: 0, isActive: true, order: 5 },
    { id: 55, name: "Dhiffushi", count: 0, isActive: true, order: 6 },
    { id: 56, name: "Ukulhas", count: 0, isActive: true, order: 7 }
  ],
  andaman: [
    { id: 57, name: "Port Blair", count: 0, isActive: true, order: 1 },
    { id: 58, name: "Havelock Island", count: 0, isActive: true, order: 2 },
    { id: 59, name: "Neil Island", count: 0, isActive: true, order: 3 },
    { id: 60, name: "Baratang", count: 0, isActive: true, order: 4 },
    { id: 61, name: "Ross Island", count: 0, isActive: true, order: 5 },
    { id: 62, name: "Viper Island", count: 0, isActive: true, order: 6 },
    { id: 63, name: "North Bay", count: 0, isActive: true, order: 7 }
  ]
};

// Helper functions for managing city filters
export const cityFiltersManager = {
  // Get cities for a specific destination
  getCities: (destination: string): CityFilter[] => {
    return cityFilters[destination] || [];
  },

  // Get all city filters
  getAllCities: (): CityFiltersData => {
    return cityFilters;
  },

  // Add a new city
  addCity: (destination: string, name: string, order?: number): CityFilter => {
    if (!cityFilters[destination]) {
      throw new Error('Invalid destination');
    }

    const newId = Math.max(...Object.values(cityFilters).flat().map(city => city.id)) + 1;
    const newCity: CityFilter = {
      id: newId,
      name,
      count: 0,
      isActive: true,
      order: order || cityFilters[destination].length + 1
    };

    cityFilters[destination].push(newCity);
    return newCity;
  },

  // Update a city
  updateCity: (destination: string, id: number, updates: Partial<CityFilter>): CityFilter => {
    const destinationFilters = cityFilters[destination];
    if (!destinationFilters) {
      throw new Error('Invalid destination');
    }

    const cityIndex = destinationFilters.findIndex(city => city.id === id);
    if (cityIndex === -1) {
      throw new Error('City not found');
    }

    // Update the city with new values
    cityFilters[destination][cityIndex] = {
      ...cityFilters[destination][cityIndex],
      ...updates
    };

    return cityFilters[destination][cityIndex];
  },

  // Delete a city
  deleteCity: (destination: string, id: number): CityFilter => {
    const destinationFilters = cityFilters[destination];
    if (!destinationFilters) {
      throw new Error('Invalid destination');
    }

    const cityIndex = destinationFilters.findIndex(city => city.id === id);
    if (cityIndex === -1) {
      throw new Error('City not found');
    }

    const deletedCity = destinationFilters.splice(cityIndex, 1)[0];
    return deletedCity;
  },

  // Toggle city active status
  toggleCityStatus: (destination: string, id: number): CityFilter => {
    const city = cityFilters[destination]?.find(c => c.id === id);
    if (!city) {
      throw new Error('City not found');
    }

    return cityFiltersManager.updateCity(destination, id, { isActive: !city.isActive });
  }
}; 