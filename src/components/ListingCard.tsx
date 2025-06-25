import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Bed, Bath, Square, DollarSign, ExternalLink } from "lucide-react";
import { Listing } from "@/hooks/useListings";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  // Format price to be more readable
  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for Price";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format square footage
  const formatSqft = (sqft: number | null) => {
    if (!sqft) return "N/A";
    return new Intl.NumberFormat("en-US").format(sqft);
  };

  // Function to handle click and redirect to Zillow
  const handleZillowRedirect = () => {
    if (listing.zillow_link) {
      window.open(listing.zillow_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={handleZillowRedirect}
      className="min-h-[16rem] list-none"
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
        <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden cursor-pointer rounded-xl border-[0.75px] bg-white p-4 shadow-sm md:p-6">
          {/* Header with icon and price */}
          <div className="flex items-start justify-between">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-white p-2">
              <Home className="h-4 w-4 text-green-500" />
            </div>
            {listing.zillow_link && (
              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            )}
          </div>

          {/* Property Image */}
          {listing.imagelink && (
            <div className="relative w-full h-32 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={listing.imagelink}
                alt={listing.title || listing.address || "Property"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Property Details */}
          <div className="flex flex-1 flex-col gap-3">
            {/* Title */}
            <h3 className="text-lg leading-tight font-semibold font-sans tracking-[-0.02em] text-balance text-gray-900 line-clamp-2">
              {listing.title || listing.address || "Property Listing"}
            </h3>

            {/* Address */}
            {listing.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{listing.address}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-green-600">
                {formatPrice(listing.price)}
              </span>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {listing.beds !== null && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Bed className="h-3 w-3" />
                  <span>{listing.beds} {listing.beds === 1 ? 'bed' : 'beds'}</span>
                </div>
              )}
              {listing.baths !== null && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Bath className="h-3 w-3" />
                  <span>{listing.baths} {listing.baths === 1 ? 'bath' : 'baths'}</span>
                </div>
              )}
              {listing.sqft !== null && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Square className="h-3 w-3" />
                  <span>{formatSqft(listing.sqft)} sqft</span>
                </div>
              )}
            </div>

            {/* Updated timestamp */}
            {listing.last_updated_from_zillow && (
              <div className="mt-auto">
                <Badge className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/20 text-xs">
                  Updated {new Date(listing.last_updated_from_zillow).toLocaleDateString()}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard; 