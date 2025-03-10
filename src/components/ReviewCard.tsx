
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: {
    id: number;
    reviewername: string;
    reviewerscreenname: string;
    rating: number;
    createdate: string;
    comment: string;
    workdescription: string;
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
  const displayName = review.reviewername || review.reviewerscreenname || "Anonymous";

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
        transform: 'translateY(20px)',
        animation: `fade-in 0.6s ease-out forwards ${animationDelay}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-6">
            <p className="text-sm font-medium text-gray-700 mb-2">{displayName}</p>
            <p className="text-gray-600 mb-4">{review.comment}</p>
            {review.workdescription && (
              <p className="text-sm text-gray-500">{review.workdescription}</p>
            )}
            <p className="text-sm text-gray-500 hover:text-gray-700 transition-colors tracking-wide mt-2">
              {formatDate(review.createdate)}
            </p>
          </div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={`star-${i}`}
                className={cn(
                  "w-5 h-5",
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-2">
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
