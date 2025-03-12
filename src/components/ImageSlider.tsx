import React, { useState, useEffect, useRef } from 'react';
import '../styles/ImageSlider.css';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  url?: string;
}

interface ImageSliderProps {
  slides: Slide[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const sliderRef = useRef<HTMLDivElement>(null);
  const length = slides.length;

  // Handle loading of images
  useEffect(() => {
    let loadedImages = 0;
    const totalImages = slides.length;
    
    const preloadImages = () => {
      slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
        img.onload = () => {
          loadedImages++;
          setLoadingProgress(Math.floor((loadedImages / totalImages) * 100));
          
          if (loadedImages === totalImages) {
            setTimeout(() => {
              setIsLoading(false);
            }, 500); // Small delay for smooth transition
          }
        };
      });
    };
    
    preloadImages();
  }, [slides]);

  // Handle tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate tilt based on mouse position relative to center
      const tiltX = ((e.clientY - centerY) / (rect.height / 2)) * 5;
      const tiltY = ((centerX - e.clientX) / (rect.width / 2)) * 5;
      
      setTiltValues({ x: tiltX, y: tiltY });
    }
  };

  const handleMouseLeave = () => {
    // Reset tilt when mouse leaves
    setTiltValues({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <div className="slider-container">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader">
            <div className="loader-bar" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <div className="loader-text">{loadingProgress}%</div>
        </div>
      ) : (
        <div 
          className="slider" 
          ref={sliderRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tiltValues.x}deg) rotateY(${tiltValues.y}deg)`
          }}
        >
          <div className="slider-controls">
            <button className="slider-button prev" onClick={prevSlide}>
              &lt;
            </button>
            <button className="slider-button next" onClick={nextSlide}>
              &gt;
            </button>
          </div>
          
          {slides.map((slide, index) => (
            <div 
              className={index === current ? 'slide active' : 'slide'} 
              key={index}
            >
              {index === current && (
                <>
                  <div className="slide-image" style={{ backgroundImage: `url(${slide.image})` }}></div>
                  <div className="slide-content">
                    <h2>{slide.title}</h2>
                    <h3>{slide.subtitle}</h3>
                    <p>{slide.description}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
