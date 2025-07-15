import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertReviewSchema } from "@shared/schema";
import { Star, X } from "lucide-react";
import { z } from "zod";
import type { ReviewData } from "@/lib/types";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
  listingType: string;
  review?: ReviewData | null;
  onSuccess: () => void;
}

const reviewFormSchema = insertReviewSchema.pick({
  title: true,
  rating: true,
  content: true,
}).extend({
  content: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function ReviewModal({
  isOpen,
  onClose,
  listing,
  listingType,
  review,
  onSuccess,
}: ReviewModalProps) {
  const { toast } = useToast();
  const [currentRating, setCurrentRating] = useState(review?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: review?.title || "",
      rating: review?.rating || 0,
      content: review?.content || "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const payload = {
        ...data,
        listingType,
        listingId: listing.id,
      };

      if (review) {
        // Update existing review
        await apiRequest("PUT", `/api/reviews/${review.id}`, payload);
      } else {
        // Create new review
        await apiRequest("POST", "/api/reviews", payload);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: review ? "Review updated successfully" : "Review submitted successfully",
      });
      onSuccess();
      onClose();
      form.reset();
      setCurrentRating(0);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: review ? "Failed to update review" : "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      if (!review) return;
      await apiRequest("DELETE", `/api/reviews/${review.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    },
  });

  const handleRatingClick = (rating: number) => {
    setCurrentRating(rating);
    form.setValue("rating", rating);
  };

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const onSubmit = (data: ReviewFormData) => {
    if (currentRating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    
    reviewMutation.mutate({
      ...data,
      rating: currentRating,
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setCurrentRating(review?.rating || 0);
    setHoveredRating(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {review ? "Edit Review" : "Write a Review"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {review ? "Update your review and rating" : "Share your experience and rate this listing"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Reviewing: <span className="font-medium">{listing.name || listing.title}</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Rating */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rating *
                </Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="text-2xl transition-colors focus:outline-none"
                      onClick={() => handleRatingClick(rating)}
                      onMouseEnter={() => handleRatingHover(rating)}
                      onMouseLeave={handleRatingLeave}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= (hoveredRating || currentRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {currentRating > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentRating === 1 && "Poor"}
                    {currentRating === 2 && "Fair"}
                    {currentRating === 3 && "Good"}
                    {currentRating === 4 && "Very Good"}
                    {currentRating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Review Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Summarize your experience..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Review Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share details about your experience..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <div>
                  {review && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this review?")) {
                          deleteReviewMutation.mutate();
                        }
                      }}
                      disabled={deleteReviewMutation.isPending}
                    >
                      Delete Review
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={reviewMutation.isPending || currentRating === 0}
                  >
                    {reviewMutation.isPending 
                      ? "Submitting..." 
                      : review 
                        ? "Update Review" 
                        : "Submit Review"
                    }
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
