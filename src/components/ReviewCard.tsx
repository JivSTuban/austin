
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: {
    id: string | number;
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

  // Get the display name
  const displayName = review.author || "Anonymous";

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Animation delay based on index for staggered effect
  const animationDelay = `${100 + index * 50}ms`;

  const RatingDetail = ({ label, rating }: { label: string; rating: number }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={`detail-star-${i}`}
            className={cn(
              "w-3.5 h-3.5",
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
        "glass rounded-lg overflow-hidden transition-all duration-300",
        isHovered ? "shadow-md translate-y-[-2px]" : "hover:shadow-sm"
      )}
      style={{
        transform: 'translateY(20px)',
        animation: `fade-in 0.6s ease-out forwards ${animationDelay}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <p className="text-base font-semibold text-gray-900 mb-1">{displayName}</p>
            <p className="text-base leading-relaxed text-gray-700 mb-3">{review.content}</p>
            {review.title && review.title !== 'Review' && (
              <p className="text-sm font-medium text-gray-600 mb-2">{review.title}</p>
            )}
            <p className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors tracking-wide">
              {formatDate(review.createdate)}
            </p>
          </div>
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={`star-${i}`}
                className={cn(
                  "w-4 h-4",
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <RatingDetail label="Local Knowledge" rating={review.localKnowledge} />
            <RatingDetail label="Process Expertise" rating={review.processExpertise} />
            <RatingDetail label="Responsiveness" rating={review.responsiveness} />
            <RatingDetail label="Negotiation Skills" rating={review.negotiationSkills} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
