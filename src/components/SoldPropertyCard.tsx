import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import { SoldProperty } from '@/hooks/useSoldProperties';

interface SoldPropertyCardProps {
  property: SoldProperty;
}

const SoldPropertyCard: React.FC<SoldPropertyCardProps> = ({ property }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to handle click and redirect to Zillow
  const handleZillowRedirect = () => {
    // Format the address for the URL - replace spaces with hyphens and make lowercase
    const formattedAddress = property.address.replace(/\s+/g, '-').toLowerCase();
    const formattedCity = property.city.replace(/\s+/g, '-').toLowerCase();
    
    // Since state is not in the SoldProperty interface, we'll use a default
    const defaultState = 'oh'; // Default state code
    
    // Create the Zillow URL format similar to the example provided
    // Example: https://www.zillow.com/b/505-e-temple-st-washington-court-house-oh-9QmMGN/
    const zillowUrl = `https://www.zillow.com/homes/${formattedAddress}-${formattedCity}-${defaultState}/`;
    
    // Open in a new tab
    window.open(zillowUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer" 
      onClick={handleZillowRedirect}
    >
      <CardHeader className="bg-[#1b2232] text-white p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          <h3 className="font-semibold text-lg truncate">
  {property.address.length > 30 ? property.address.slice(0, 30) + "..." : property.address}
</h3>
        </div>
        <Badge className="bg-[#F08A5D] hover:bg-[#F08A5D]/90">{property.year}</Badge>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">City</span>
            <span className="font-medium">{property.city}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Added</span>
            <span className="font-medium">{formatDate(property.date_added)}</span>
          </div>
         
        </div>
      </CardContent>
    </Card>
  );
};

export default SoldPropertyCard;
