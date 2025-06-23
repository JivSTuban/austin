import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  isSubmitting?: boolean;
}

export function ReviewDialog({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  isEditing = false,
  isSubmitting = false,
}: ReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
