import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewFormProps {
  initialData?: {
    rating: number;
    comment: string;
    propertyType: string;
    buyerType: string;
    workDescription: string;
  };
  onSubmit: (data: {
    rating: number;
    comment: string;
    propertyType: string;
    buyerType: string;
    workDescription: string;
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const propertyTypes = [
  "Single Family",
  "Multi-Family",
  "Condo",
  "Apartment",
  "Other",
];
const buyerTypes = ["Buyer", "Seller", "Both", "Other"];

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [propertyType, setPropertyType] = useState(
    initialData?.propertyType || ""
  );
  const [buyerType, setBuyerType] = useState(initialData?.buyerType || "");
  const [workDescription, setWorkDescription] = useState(
    initialData?.workDescription || ""
  );
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment,
      propertyType,
      buyerType,
      workDescription,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredStar(value)}
              onMouseLeave={() => setHoveredStar(null)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-6 h-6 ${
                  value <= (hoveredStar || rating)
                    ? "fill-[#F08A5D] text-[#F08A5D]"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type
        </label>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Type
        </label>
        <Select value={buyerType} onValueChange={setBuyerType}>
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            {buyerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Description
        </label>
        <Input
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          placeholder="e.g., Bought a Single Family home in 2024"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            !rating ||
            !comment ||
            !propertyType ||
            !buyerType ||
            !workDescription
          }
        >
          {isEditing ? "Update Review" : "Submit Review"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
