import { Star } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ReviewCardProps {
  review: {
    author: string;
    rating: number;
    createdate: string;
    content: string;
    title: string;
    propertyType: string;
    buyerType: string;
    updatedAt?: string;
  };
  index: number;
}

const ReviewCard = ({ review, index }: ReviewCardProps) => {
  const formattedDate = new Date(review.createdate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card 
      variant="lifted"
      className={cn(
        "flex flex-col",
        "relative transition-all hover:shadow-lg",
        "p-6 md:p-8 bg-background"
      )}
    >
      <CardHeader className="flex justify-between items-start space-y-0">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">{review.author}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {review.propertyType}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {review.buyerType}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn(
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-grow pt-0">
        <p className="text-pretty text-base text-muted-foreground">
          {review.content}
        </p>
      </CardContent>

      <CardFooter className="mt-auto pt-4 flex items-center justify-between border-t">
        <p className="text-sm text-muted-foreground">
          {review.updatedAt ? `Updated ${new Date(review.updatedAt).toLocaleDateString()}` : formattedDate}
        </p>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`} />
            <AvatarFallback>{review.author[0]}</AvatarFallback>
          </Avatar>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
