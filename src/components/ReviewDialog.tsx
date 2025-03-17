import React from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";

interface ReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  isEditing?: boolean;
}

export function ReviewDialog({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  isEditing = false,
}: ReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
          <Star className="w-4 h-4" />
          {isEditing ? "Edit Review" : "Write a Review"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with the property and service
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ReviewForm
            initialData={initialData}
            onSubmit={(data) => {
              onSubmit(data);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
            isEditing={isEditing}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
