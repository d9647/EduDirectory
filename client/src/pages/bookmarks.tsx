import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, MapPin, Calendar, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import ListingDetailModal from "@/components/listings/listing-detail-modal";

export default function Bookmarks() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: bookmarkData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["/api/bookmarks", limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      const response = await fetch(`/api/bookmarks?${params}`);
      if (!response.ok) throw new Error('Failed to fetch bookmarks');
      return response.json();
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const bookmarks = bookmarkData?.bookmarks || [];
  const total = bookmarkData?.total || 0;

  // Pagination handlers
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setOffset(0); // Reset to first page when changing limit
  };

  const removeBookmarkMutation = useMutation({
    mutationFn: async ({ listingType, listingId }: { listingType: string; listingId: number }) => {
      await apiRequest("POST", "/api/bookmarks", { listingType, listingId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Success",
        description: "Bookmark removed successfully",
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
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    },
  });

  if (isLoading || bookmarksLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case "tutoring":
        return "Tutoring Provider";
      case "services":
        return "Services Provider";
      case "camps":
        return "Summer Camp";
      case "internships":
        return "Internship";
      case "jobs":
        return "Job";
      default:
        return type;
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case "tutoring":
        return "bg-blue-100 text-blue-800";
      case "services":
          return "bg-yellow-100 text-yellow-800";
      case "camps":
        return "bg-green-100 text-green-800";
      case "internships":
        return "bg-purple-100 text-purple-800";
      case "jobs":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
          <p className="mt-2 text-gray-600">Your bookmarked listings and services</p>
        </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved items</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start browsing to save your favorite listings.
          </p>
          <div className="mt-6">
            <Button onClick={() => window.location.href = "/"}>
              Browse Listings
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Pagination controls at the top */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-700">
              Showing {Math.min(offset + 1, total)} - {Math.min(offset + limit, total)} of {total} saved items
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {bookmarks.map((bookmark: any) => {
              const listing = bookmark.listing;
              const listingType = bookmark.listingType;
            
              return (
              <Card key={`${listingType}-${listing.id}`} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getListingTypeColor(listingType)}>
                          {getListingTypeLabel(listingType)}
                        </Badge>
                        {listing.isApproved && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">
                        {listing.name || listing.title || listing.companyName}
                      </CardTitle>
                      {(listing.companyName && listing.title) && (
                        <p className="text-sm text-gray-600 mt-1">{listing.title}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmarkMutation.mutate({ listingType, listingId: listing.id })}
                      className="text-gray-500 hover:text-red-500"
                      disabled={removeBookmarkMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {listing.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    {(listing.city || listing.location) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.city || listing.location}</span>
                        {listing.state && <span>, {listing.state}</span>}
                        {listing.zipcode && <span> {listing.zipcode}</span>}
                      </div>
                    )}
                    {listing.isRemote && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Remote
                      </Badge>
                    )}
                    {listing.compensation && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Compensation:</span>
                        <span>{listing.compensation}</span>
                      </div>
                    )}
                  </div>

                  {(listing.categories || listing.subjects || listing.types) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.categories?.slice(0, 3).map((category: string) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {listing.subjects?.slice(0, 3).map((subject: string) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {listing.types?.slice(0, 3).map((type: string) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {listing.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(listing.website, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit Website
                        </Button>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          // Add listingType to the listing object for the modal
                          const listingWithType = {
                            ...bookmark.listing,
                            listingType: bookmark.listingType
                          };
                          setSelectedListing(listingWithType);
                          setDetailModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>

          {/* Pagination controls at the bottom */}
          {total > limit && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(0, offset - limit))}
                disabled={offset === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(total / limit) }, (_, i) => {
                  const pageNumber = i + 1;
                  const pageOffset = i * limit;
                  const isCurrentPage = offset === pageOffset;
                  
                  // Show first page, last page, current page, and pages around current
                  const shouldShow = 
                    pageNumber === 1 || 
                    pageNumber === Math.ceil(total / limit) ||
                    Math.abs(Math.floor(offset / limit) + 1 - pageNumber) <= 1;
                  
                  if (!shouldShow) {
                    // Show ellipsis for gaps
                    if (pageNumber === 2 && Math.floor(offset / limit) > 2) {
                      return <span key={i} className="px-2 text-gray-400">...</span>;
                    }
                    if (pageNumber === Math.ceil(total / limit) - 1 && Math.floor(offset / limit) < Math.ceil(total / limit) - 3) {
                      return <span key={i} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageOffset)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(Math.floor(total / limit) * limit, offset + limit))}
                disabled={offset + limit >= total}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
      </main>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          listingType={selectedListing.listingType as "tutoring" | "camps" | "internships" | "jobs"}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
}