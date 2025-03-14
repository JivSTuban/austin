import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Calendar } from 'lucide-react';
import { SoldProperty } from '@/hooks/useSoldProperties';
import { motion } from "framer-motion";
import { GlowingEffect } from '@/components/ui/glowing-effect';

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
    const zillowUrl = `https://www.zillow.com/homes/${formattedAddress}-${formattedCity}-${defaultState}/`;
    
    // Open in a new tab
    window.open(zillowUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={handleZillowRedirect}
      className="min-h-[14rem] list-none"
    >
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              <Home className="h-4 w-4 text-[#F08A5D]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground truncate max-w-[300px]">
                  {property.address}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider">Location</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {property.city}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs uppercase tracking-wider">Sold</span>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <Badge 
                    className="bg-[#F08A5D]/10 hover:bg-[#F08A5D]/20 text-[#F08A5D] border-[#F08A5D]/20"
                  >
                    {property.year}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SoldPropertyCard;
