import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import ReviewModal from "./review-modal";
import { UserDisplayName } from "@/components/common/user-display-name";
import { 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Flag, 
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Award,
  Clock,
  X,
  Monitor,
  User,
  GraduationCap,
} from "lucide-react";
import type { ReviewData } from "@/lib/types";
import { formatDescription, formatArrayField, formatSalary, formatDate, formatBoolean } from "@/lib/textUtils";

interface ListingDetailModalProps {
  listing: any;
  listingType: "tutoring" | "camps" | "internships" | "jobs";
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingDetailModal({
  listing,
  listingType,
  isOpen,
  onClose,
}: ListingDetailModalProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  const listingTypeMap = {
    tutoring: "tutoring",
    camps: "camp",
    internships: "internship",
    jobs: "job",
  };

  const apiListingType = listingTypeMap[listingType];

  // Fetch reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/reviews", apiListingType, listing.id],
    enabled: isOpen,
  });

  // Fetch contributor stats for badge display
  const { data: contributorStats } = useQuery({
    queryKey: [`/api/auth/contribution-stats-${listing.userId}`],
    queryFn: async () => {
      if (!listing.userId) return null;
      return await apiRequest("GET", `/api/auth/contribution-stats?userId=${listing.userId}`);
    },
    enabled: isOpen && !!listing.userId,
    retry: false,
  });

  // Fetch user interactions
  const { data: userInteractions } = useQuery({
    queryKey: [`/api/thumbs-up/${apiListingType}/${listing.id}/user`],
    enabled: isAuthenticated && isOpen,
    retry: false,
  });

  const { data: userBookmark } = useQuery({
    queryKey: [`/api/bookmarks/${apiListingType}/${listing.id}/user`],
    enabled: isAuthenticated && isOpen,
    retry: false,
  });

  // Thumbs up mutation
  const thumbsUpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/thumbs-up", {
        listingType: apiListingType,
        listingId: listing.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/thumbs-up/${apiListingType}/${listing.id}/user`] });
      toast({
        title: "Success",
        description: "Thumbs up toggled successfully",
      });
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
        description: "Failed to toggle thumbs up",
        variant: "destructive",
      });
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/bookmarks", {
        listingType: apiListingType,
        listingId: listing.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookmarks/${apiListingType}/${listing.id}/user`] });
      toast({
        title: "Success",
        description: "Bookmark toggled successfully",
      });
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
        description: "Failed to toggle bookmark",
        variant: "destructive",
      });
    },
  });

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: async (data: { reason: string; description: string }) => {
      await apiRequest("POST", "/api/reports", {
        reportType: "listing",
        itemType: apiListingType,
        itemId: listing.id,
        ...data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Report submitted successfully",
      });
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
        description: "Failed to submit report",
        variant: "destructive",
      });
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.name || listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Link has been copied to clipboard",
      });
    }
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }

    const reason = prompt("Please provide a reason for reporting this listing:");
    if (reason) {
      reportMutation.mutate({ reason, description: "" });
    }
  };

  const calculateAverageRating = (reviews: ReviewData[] | undefined) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = (reviews: ReviewData[] | undefined) => {
    if (!reviews || reviews.length === 0) return [0, 0, 0, 0, 0];
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const averageRating = calculateAverageRating(reviews);
  const ratingDistribution = getRatingDistribution(reviews);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mt-8 sm:mt-12 mb-4 sm:mb-8">
          {/* Modal Header */}
          <DialogHeader className="pb-3 sm:pb-4 px-4 sm:px-8">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mr-3 sm:mr-4 flex-shrink-0">
                <AvatarImage 
                  src={listing.photoUrl || listing.photo_url || ""} 
                  alt={listing.name || listing.title}
                  className="object-cover"
                />
                <AvatarFallback>
                  {(listing.name || listing.title || "").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                  {listing.name || listing.title}
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600">
                  {listingType === "services" 
                    ? (listing.type === "individual" ? "Individual / Private" : listing.type === "company" ? "Company / Agency" : listing.type || "Provider")
                    : (listing.type || listing.companyName)} • {listingType === "tutoring" ? "Tutoring" : 
                   listingType === "camps" ? "Summer Camp" :
                   listingType === "internships" ? "Internship" : 
                   listingType === "services" ? "Service" : "Job"}
                </DialogDescription>
                <div className="flex items-center mt-1 space-x-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${star <= Math.floor(averageRating) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({(reviews as any)?.length || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Monitor className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {listing.viewCount || 0} views
                  </div>
                  {(listing.contributorNickname || listing.contributorFirstName || listing.contributorLastName) && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      by <UserDisplayName 
                        user={{
                          id: listing.userId,
                          nickname: listing.contributorNickname,
                          firstName: listing.contributorFirstName,
                          lastName: listing.contributorLastName,
                          email: null,
                          createdAt: null
                        }} 
                        contributionStats={contributorStats}
                        showBadge={true}
                        className="font-medium text-primary ml-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    window.location.href = "/api/login";
                    return;
                  }
                  thumbsUpMutation.mutate();
                }}
                disabled={thumbsUpMutation.isPending}
                variant={(userInteractions as any)?.hasThumbedUp ? "default" : "outline"}
              >
                <ThumbsUp className={`h-4 w-4 mr-2 ${(userInteractions as any)?.hasThumbedUp ? "fill-current" : ""}`} />
                Thumbs Up ({listing.thumbsUpCount || 0})
              </Button>
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    window.location.href = "/api/login";
                    return;
                  }
                  bookmarkMutation.mutate();
                }}
                disabled={bookmarkMutation.isPending}
                variant={(userBookmark as any)?.isBookmarked ? "default" : "outline"}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${(userBookmark as any)?.isBookmarked ? "fill-current" : ""}`} />
                {(userBookmark as any)?.isBookmarked ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={handleReport}>
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>

            {/* Provider Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">About</h4>
                <div className="text-sm">
                  {formatDescription(listing.description)}
                </div>

                {/* Prerequisites/Requirements */}
                {listing.prerequisites && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Prerequisites & Requirements</h5>
                    <div className="text-sm text-gray-700">
                      {formatDescription(listing.prerequisites)}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Details</h4>
                <div className="space-y-2 text-sm">
                  {listing.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-3" />
                      <a 
                        href={listing.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 allow-select"
                      >
                        {listing.website}
                      </a>
                    </div>
                  )}
                  {listing.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700 allow-select">{listing.phone}</span>
                    </div>
                  )}
                  {listing.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700 allow-select">{listing.email}</span>
                    </div>
                  )}
                  {(listing.city || listing.location || listing.address) && (
                    <div className="flex items-center">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent([listing.address, listing.location || listing.city, listing.state, listing.zipcode].filter(Boolean).join(", "))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Open in Maps"
                      >
                        <MapPin className="h-4 w-4 mr-3" />
                      </a>
                      <span className="text-gray-700 allow-select">
                        {/* Only show "Remote" if it's ONLY remote delivery, otherwise show full address */}
                        {(Array.isArray(listing.deliveryMode) && listing.deliveryMode.length === 1 && listing.deliveryMode.includes("Remote")) || listing.isRemote ? "Remote" : 
                         [listing.address, listing.location || listing.city, listing.state, listing.zipcode].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  {listing.deliveryMode && (
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Delivery Mode: {formatArrayField(listing.deliveryMode)}</span>
                    </div>
                  )}
                  {(listing.costRange || listing.compensation || listing.salaryRange || listing.tuition || (listing.salaryMin && listing.salaryMax)) && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {listing.costRange || listing.tuition || 
                         (listing.salaryMin && listing.salaryMax ? 
                           `$${listing.salaryMin} - $${listing.salaryMax} ${listing.salaryType || ''}`.trim() :
                           formatSalary(listing.salaryRange, listing.salaryType)) || 
                         listing.compensation}
                      </span>
                    </div>
                  )}
                  {listing.minimumAge && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Minimum Age: {listing.minimumAge}+</span>
                    </div>
                  )}
                  {listing.selectivityLevel && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-gray-400 mr-3" />
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">Selectivity:</span>
                        <div className={`w-3 h-3 rounded-full ${
                          listing.selectivityLevel === 1 ? 'bg-green-500' :
                          listing.selectivityLevel === 2 ? 'bg-yellow-500' :
                          listing.selectivityLevel === 3 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-gray-700">
                          {listing.selectivityLevel === 1 ? 'Open Enrollment' :
                           listing.selectivityLevel === 2 ? 'Application-Based' :
                           listing.selectivityLevel === 3 ? 'Competitive' :
                           'Very Competitive'}
                        </span>
                      </div>
                    </div>
                  )}
                  {listing.hasScholarship && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Scholarships Available</span>
                    </div>
                  )}
                  {listing.hasMentorship && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Mentorship Provided</span>
                    </div>
                  )}
                  {listing.hasTraining && (
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Training Provided</span>
                    </div>
                  )}
                  {(listing.applicationOpen || listing.openingDate) && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        Opens: {formatDate(listing.applicationOpen || listing.openingDate)}
                      </span>
                    </div>
                  )}
                  {(listing.applicationDeadline || listing.closingDate) && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        Due: {formatDate(listing.applicationDeadline || listing.closingDate)}
                      </span>
                    </div>
                  )}
                  {(listing.dates || listing.internshipDates) && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        Dates: {listing.dates || listing.internshipDates}
                      </span>
                    </div>
                  )}
                  {listing.length && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Duration: {listing.length}</span>
                    </div>
                  )}
                  {listing.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-3" />
                      <a 
                        href={listing.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        Apply Here
                      </a>
                    </div>
                  )}
                  {listing.hasAdvancement && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Advancement Opportunities</span>
                    </div>
                  )}
                  {listing.requiresTransportation && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Transportation Required</span>
                    </div>
                  )}
                  {listing.requiresResume && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Resume Required</span>
                    </div>
                  )}
                  {listing.isOngoing && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">Ongoing Position</span>
                    </div>
                  )}
                  {listing.eligibility && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Eligibility</h5>
                      <div className="text-sm text-gray-700">
                        {formatDescription(listing.eligibility)}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Categories, Tags, Job Types, and Schedule */}
            <div>
              {listingType === "tutoring" ? (
                <>
                  {/* Categories Section */}
                  {listing.categories && listing.categories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {listing.categories.map((item: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subjects Section */}
                  {listing.subjects && listing.subjects.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Subjects & Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {listing.subjects.map((item: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {listingType === "camps" ? "Categories" : 
                     listingType === "internships" ? "Categories" : "Categories"}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(listing.categories || listing.types || []).map((item: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </>
              )}

              {/* Tags section for camps and services */}
              {(listingType === "camps" || listingType === "services") && listing.tags && listing.tags.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">{listingType === "services" ? "Service Tags" : "Program Tags"}</h5>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration for Internships */}
              {listingType === "internships" && listing.duration && listing.duration.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Duration Options</h5>
                  <div className="flex flex-wrap gap-2">
                    {listing.duration.map((dur: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dur}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Type and Schedule for Jobs */}
              {listingType === "jobs" && (
                <div className="space-y-3">
                  {listing.jobType && listing.jobType.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Job Types</h5>
                      <div className="flex flex-wrap gap-2">
                        {listing.jobType.map((type: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {listing.schedule && listing.schedule.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Schedule</h5>
                      <div className="flex flex-wrap gap-2">
                        {listing.schedule.map((sched: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                            {sched}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Reviews ({(reviews as any)?.length || 0})
                </h4>
                <Button
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = "/api/login";
                      return;
                    }
                    setSelectedReview(null);
                    setReviewModalOpen(true);
                  }}
                >
                  Write a Review
                </Button>
              </div>

              {/* Review Summary */}
              {reviews && (reviews as any).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                      <div className="ml-3">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= Math.floor(averageRating) ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">Based on {(reviews as any).length} reviews</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center text-xs">
                            <span className="w-8">{rating}★</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2 ml-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ 
                                  width: `${(reviews as any).length > 0 ? (ratingDistribution[rating - 1] / (reviews as any).length) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            <span className="ml-2 text-gray-600">
                              {ratingDistribution[rating - 1]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="text-center py-4">Loading reviews...</div>
                ) : reviews && (reviews as any).length > 0 ? (
                  (reviews as any).map((review: any) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage 
                              src={review.reviewerProfileImageUrl || ""} 
                              alt={review.reviewerFirstName || review.reviewerEmail || ""}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {(review.reviewerFirstName || review.reviewerEmail || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              <UserDisplayName 
                                user={{
                                  firstName: review.reviewerFirstName,
                                  lastName: review.reviewerLastName,
                                  nickname: review.reviewerNickname,
                                  email: review.reviewerEmail,
                                  createdAt: review.reviewerCreatedAt
                                }}
                                showBadge={true}
                              />
                            </h5>
                            <div className="flex items-center">
                              <div className="flex text-yellow-400 text-sm">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-3 w-3 ${star <= review.rating ? "fill-current" : ""}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {((user as any)?.id === review.userId || (user as any)?.role === 'admin') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReview(review);
                                setReviewModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReport()}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h6 className="font-medium text-gray-900 mb-1">{review.title}</h6>
                      {review.content && (
                        <p className="text-sm text-gray-700">{review.content}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-2">No reviews yet</div>
                    <p className="text-sm text-gray-400">Be the first to review this listing!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedReview(null);
        }}
        listing={listing}
        listingType={apiListingType}
        review={selectedReview}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/reviews", apiListingType, listing.id] });
        }}
      />
    </>
  );
}
