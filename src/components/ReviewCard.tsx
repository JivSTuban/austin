
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: {
    id: number;
    author: string;
    rating: number;
    createdate: string;
    title: string;
    content: string;
    propertyType: string;
    buyerType: string;
    localKnowledge: number;
    processExpertise: number;
    responsiveness: number;
    negotiationSkills: number;
  };
  index: number;
}

const ReviewCard = ({ review, index }: ReviewCardProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 3D card effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation delay based on index for staggered effect
  const animationDelay = `${100 + index * 50}ms`;

  const RatingDetail = ({ label, rating }: { label: string; rating: number }) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={`detail-star-${i}`}
            className={cn(
              "w-4 h-4", 
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
            )} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className={cn(
        "card-3d glass rounded-lg overflow-hidden transition-all duration-500",
        isHovered ? "shadow-lg scale-105" : "hover:shadow-md"
      )}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        animation: `fade-in 0.6s ease-out forwards ${animationDelay}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-xl mb-3 hover:text-blue-600 transition-colors leading-snug tracking-tight">
              {review.title}
            </h3>
            <p className="text-sm text-gray-500 hover:text-gray-700 transition-colors tracking-wide">
              {formatDate(review.createdate)}
            </p>
          </div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={`main-star-${i}`}
                className={cn(
                  "w-4 h-4",
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                )}
              />
            ))}
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 text-base leading-relaxed tracking-normal">{review.content}</p>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 focus:outline-none"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <RatingDetail label="Local Knowledge" rating={review.localKnowledge} />
            <RatingDetail label="Process Expertise" rating={review.processExpertise} />
            <RatingDetail label="Responsiveness" rating={review.responsiveness} />
            <RatingDetail label="Negotiation Skills" rating={review.negotiationSkills} />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-gray-600 font-medium text-sm tracking-wide hover:text-gray-800 transition-colors">
            {review.author}
          </div>
          <div className="flex space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              {review.propertyType}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
              {review.buyerType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
