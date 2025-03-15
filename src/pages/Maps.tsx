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

// Sample locations from the KML file
const locations: Location[] = [
  {
    name: "404 Wampler Ave, Dayton, OH 45405, USA",
    description: "A | Kettering - Popular suburban area",
    coordinates: { lat: 39.8024017, lng: -84.211857 }
  },
  {
    name: "Oakwood",
    description: "A | Oakwood - Upscale residential area",
    coordinates: { lat: 39.7234, lng: -84.1702 }
  },
  {
    name: "Oregon District",
    description: "A | Oregon District - Popular for bars and restaurants",
    coordinates: { lat: 39.7591, lng: -84.1857 }
  },
  {
    name: "Shroyer Park",
    description: "A | Shroyer Park - Residential neighborhood",
    coordinates: { lat: 39.7299, lng: -84.1547 }
  },
  {
    name: "Woodbourne-Hyde Park",
    description: "A | Woodbourne-Hyde Park - Residential area",
    coordinates: { lat: 39.6389, lng: -84.1597 }
  }
];

const Maps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);
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

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    // Update the iframe URL to zoom to the selected location
    if (iframeRef.current) {
      // Create a new URL with zoom parameters
      const baseUrl = "https://www.google.com/maps/d/u/0/embed?mid=1A0dmA2i1Ptobe10tRuicZAba8bUN97I&ehbc=2E312F&noprof=1";
      const zoomParam = `&ll=${location.coordinates.lat},${location.coordinates.lng}&z=15`;
      iframeRef.current.src = baseUrl + zoomParam;
      
      // Clear search and hide results
      setSearchTerm(location.name);
      setShowResults(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredLocations.length > 0) {
      handleLocationSelect(filteredLocations[0]);
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
              >
                Search
              </button>
            </form>
            
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