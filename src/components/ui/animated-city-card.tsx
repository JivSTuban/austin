import React from 'react';
import { cn } from '@/lib/utils';
import { Building } from 'lucide-react';

interface AnimatedCityCardProps {
  cityName: string;
  description: string;
  price: string;
  bgColor?: string;
  bgImage?: string;
  className?: string;
}

export function AnimatedCityCard({ 
  cityName, 
  description, 
  price, 
  bgColor = '#313131', 
  bgImage,
  className 
}: AnimatedCityCardProps) {
  return (
    <div 
      className={cn(
        "relative w-full sm:w-[300px] md:w-[350px] h-[250px] sm:h-[300px] md:h-[350px] rounded-[20px] flex flex-col items-center text-white transition-all duration-200 ease-in-out hover:scale-[1.04] hover:rotate-[-1deg] overflow-hidden group",
        className
      )}
      style={{ 
        backgroundColor: bgImage ? 'transparent' : bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: '95%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay with blur effect */}
      <div 
        className="absolute inset-0 w-full h-full bg-black/30 backdrop-blur-[3px] transition-all duration-300 group-hover:backdrop-blur-none z-[1]"
      />

      {/* City name shown when static, hidden on hover */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3] transition-opacity duration-300 group-hover:opacity-0">
        <p className="font-bold text-[22px] sm:text-[24px] md:text-[28px] text-center text-white drop-shadow-lg">{cityName}</p>
      </div>

      <div className="h-[30%] absolute z-[2] transition-all duration-200 ease-in-out group-hover:h-[65%] flex items-center justify-center">
        {!bgImage && <Building size={64} className="text-white/70" />}
      </div>
      
      {/* Description and price shown only on hover */}
      
    </div>
  );
}
