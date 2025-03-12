import React from 'react';
import ImageSlider from './ImageSlider';
import '../styles/PropertySlider.css';

const PropertySlider: React.FC = () => {
  // Property data with images and details
  const propertySlides = [
    {
      image: 'https://photos.zillowstatic.com/fp/0487c0f4907b1f34daa72f4e3d29957b-cc_ft_960.jpg',
      title: '3509 Pittsburg Ave',
      subtitle: 'Dayton, OH 45406',
      description: 'Click to view property details',
      url: 'https://www.zillow.com/homedetails/3509-Pittsburg-Ave-Dayton-OH-45406/34964779_zpid/'
    },
    {
      image: 'https://photos.zillowstatic.com/fp/ca279e614e803f05864e850bf0cae134-cc_ft_960.jpg',
      title: '3851 Merrimac Ave',
      subtitle: 'Dayton, OH 45405',
      description: 'Click to view property details',
      url: 'https://www.zillow.com/homedetails/3851-Merrimac-Ave-Dayton-OH-45405/34963806_zpid/'
    },
    {
      image: 'https://photos.zillowstatic.com/fp/f44175637efd52ae993f7605f600b73d-cc_ft_960.jpg',
      title: '123 Notre Dame Ave',
      subtitle: 'Dayton, OH 45404',
      description: 'Click to view property details',
      url: 'https://www.zillow.com/homedetails/123-Notre-Dame-Ave-Dayton-OH-45404/35090037_zpid/'
    },
    {
      image: 'https://photos.zillowstatic.com/fp/7d3c34641255ff774c323e480fe25bf2-cc_ft_960.jpg',
      title: '1325-1327 Phillips Ave',
      subtitle: 'Dayton, OH 45410',
      description: 'Click to view property details',
      url: 'https://www.zillow.com/homedetails/1325-1327-Phillips-Ave-Dayton-OH-45410/2056958528_zpid/'
    }
  ];

  // Handle click on a property to open the URL
  const handlePropertyClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="property-slider-container">
      {/* Add click handler to the slider container */}
      <div 
        onClick={() => handlePropertyClick(propertySlides[0].url)} 
        className="cursor-pointer"
        style={{ position: 'relative' }}
      >
        <ImageSlider slides={propertySlides} />
        
        {/* Overlay to make the entire slider clickable */}
        <div 
          className="absolute inset-0 z-10 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <button className="property-view-button">
            View Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySlider;
