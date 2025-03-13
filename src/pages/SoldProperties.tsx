import React, { useState } from 'react';
import { useSoldProperties } from '@/hooks/useSoldProperties';
import SoldPropertyCard from '@/components/SoldPropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Home, RefreshCw, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SoldProperties: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    properties, 
    isLoading, 
    error, 
    retry,
    retryCount,
    maxRetries
  } = useSoldProperties();

  // Get unique cities for the filter dropdown
  const uniqueCities = Array.from(
    new Set(properties.map(property => property.city))
  ).sort();

  // Get unique years for the filter dropdown
  const uniqueYears = Array.from(
    new Set(properties.map(property => property.year))
  ).sort((a, b) => b - a); // Sort years in descending order

  // Filter properties based on search query, city, and year
  const filteredProperties = properties.filter(property => 
    (selectedCity ? property.city === selectedCity : true) &&
    (selectedYear ? property.year.toString() === selectedYear : true) &&
    (
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.year.toString().includes(searchQuery)
    )
  );

  return (
    <div className="container mt-10 py-8 px-4 md:px-6 ">
      <div className="flex flex-col items-start gap-4 mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Home className="h-8 w-8 text-[#F08A5D]" />
          <span>Sold Properties</span>
        </h1>
      
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Properties</CardTitle>
          <CardDescription>
            Use the filters below to narrow down the properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by address, city, or year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={selectedCity}
                onValueChange={(value) => setSelectedCity(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <Home className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={selectedYear}
                onValueChange={(value) => setSelectedYear(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-600 mb-4">
                Retry attempt {retryCount} of {maxRetries}
              </p>
              <Button 
                variant="outline" 
                onClick={retry}
                disabled={retryCount >= maxRetries}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#F08A5D]" />
          <span className="ml-2 text-lg">Loading properties...</span>
        </div>
      )}

      {/* Properties Grid */}
      {!isLoading && !error && (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </p>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <SoldPropertyCard key={property.uuid} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-gray-50">
              <Home className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 max-w-md">
                Try adjusting your search or filter criteria to find properties.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SoldProperties;
