import React, { useState, useEffect, useRef } from 'react';

// Define the locations from the KML file
interface Location {
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
const rapidApiKey = import.meta.env.VITE_NEXT_PUBLIC_RAPIDAPI_KEY;

// Default locations to use while API data is loading or if API fails
const defaultLocations: Location[] = [
  {
    name: "404 Wampler Ave, Dayton, OH 45405, USA",
    description: "A | Kettering - Popular suburban area",
    coordinates: { lat: 39.80234, lng: -84.2118587 }
  },
  {
    name: "Oakwood",
    description: "A | Oakwood - Upscale residential area",
    coordinates: { lat: 39.7234, lng: -84.1702 }
  }
];

const Maps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredLocations([]);
      setShowResults(false);
    } else {
      const filtered = locations.filter(location => 
        location.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowResults(true);
    }
  };

  // Fetch location data from API
  const fetchLocationFromAPI = async (address: string) => {
    setIsLoading(true);
    
    try {
      const url = new URL('https://google-map-places.p.rapidapi.com/maps/api/geocode/json');
      url.searchParams.append('address', address);
      url.searchParams.append('language', 'en');
      url.searchParams.append('region', 'en');
      
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
        }
      };
      
      const response = await fetch(url.toString(), options);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        
        // Create a new location object from the API response
        const newLocation: Location = {
          name: result.formatted_address || address,
          description: `Search result for: ${address}`,
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          }
        };
        console.log('New location:', newLocation.coordinates.lat, newLocation.coordinates.lng);
        
        // Add the new location to the locations array if it doesn't already exist
        const locationExists = locations.some(loc => 
          loc.name === newLocation.name || 
          (loc.coordinates.lat === newLocation.coordinates.lat && 
           loc.coordinates.lng === newLocation.coordinates.lng)
        );
        
        if (!locationExists) {
          const updatedLocations = [...locations, newLocation];
          setLocations(updatedLocations);
        }
        
        // Return the new location for immediate use
        return newLocation;
      } else {
        console.error('No results found for address:', address);
        return null;
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    // Update the iframe URL to zoom to the selected location
    if (iframeRef.current) {
      // Create a new URL with zoom parameters
      const baseUrl = "https://www.google.com/maps/d/u/0/embed?mid=1A0dmA2i1Ptobe10tRuicZAba8bUN97I&ehbc=2E312F&noprof=1";
      const zoomParam = `&ll=${location.coordinates.lat},${location.coordinates.lng}&z=22`;
      iframeRef.current.src = baseUrl + zoomParam;
      
      // Clear search and hide results
      setSearchTerm(location.name);
      setShowResults(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim() === '') {
      return;
    }
    
    // First check if the location already exists in our list
    const existingLocation = locations.find(location => 
      location.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (existingLocation) {
      handleLocationSelect(existingLocation);
      return;
    }
    
    // If we have filtered locations from the search, use the first one
    if (filteredLocations.length > 0) {
      handleLocationSelect(filteredLocations[0]);
      return;
    }
    
    // If no existing location is found, fetch from API
    const newLocation = await fetchLocationFromAPI(searchTerm);
    
    if (newLocation) {
      handleLocationSelect(newLocation);
    } else {
      // If API call fails, show an alert
      alert('Could not find location. Please try a different search term.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Maps Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Area Map
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the neighborhoods and areas where I provide real estate services
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto mb-8 relative">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for a neighborhood or area..."
                className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="text-center py-4">
                <p>Searching for location...</p>
              </div>
            )}
            
            {/* Search Results Dropdown */}
            {showResults && filteredLocations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredLocations.map((location, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-600">{location.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-7x2 shadow-lg rounded-lg overflow-hidden">
              <iframe 
                ref={iframeRef}
                src="https://www.google.com/maps/d/u/0/embed?mid=1A0dmA2i1Ptobe10tRuicZAba8bUN97I&ehbc=2E312F&noprof=1" 
                width="100%" 
                height="780px"
                title="Service Areas Map"
                className="border-10"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-grow"></div>
     
    </div>
  );
};

export default Maps;