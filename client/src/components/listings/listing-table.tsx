import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import ListingDetailModal from "./listing-detail-modal";
import { ThumbsUp, Bookmark, Share2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import type { FilterState, ListingData, TableColumn, UserInteractions } from "@/lib/types";
import { formatArrayField, formatSalary, formatDate, formatBoolean } from "@/lib/textUtils";

interface ListingTableProps {
  data: ListingData | undefined;
  isLoading: boolean;
  error: Error | null;
  listingType: "tutoring" | "camps" | "internships" | "jobs";
  title: string;
  columns: TableColumn[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export default function ListingTable({
  data,
  isLoading,
  error,
  listingType,
  title,
  columns,
  filters,
  setFilters,
}: ListingTableProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "name", label: "Name (A-Z)" },
    { value: "rating", label: "Rating" },
    { value: "thumbsUp", label: "Most Thumbs Up" },
    ...(listingType === "camps" ? [{ value: "costRange", label: "Cost Range" }] : []),
  ];

  // Get the listings array based on type
  const getListings = () => {
    if (!data) return [];
    switch (listingType) {
      case "tutoring":
        return data.providers || [];
      case "camps":
        return data.camps || [];
      case "internships":
        return data.internships || [];
      case "jobs":
        return data.jobs || [];
      default:
        return [];
    }
  };

  const listings = getListings();

  // Thumbs up mutation
  const thumbsUpMutation = useMutation({
    mutationFn: async ({ listingId }: { listingId: number }) => {
      const response = await apiRequest("POST", "/api/thumbs-up", {
        listingType: listingType === "tutoring" ? "tutoring" : 
                     listingType === "camps" ? "camp" :
                     listingType === "internships" ? "internship" :
                     listingType === "jobs" ? "job" :
                     listingType,
        listingId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${listingType === "tutoring" ? "tutoring-providers" : listingType === "camps" ? "summer-camps" : listingType}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/thumbs-up/${listingType === "tutoring" ? "tutoring" : listingType === "camps" ? "camp" : listingType === "internships" ? "internship" : listingType === "jobs" ? "job" : listingType}`] });
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
    mutationFn: async ({ listingId }: { listingId: number }) => {
      const response = await apiRequest("POST", "/api/bookmarks", {
        listingType: listingType === "tutoring" ? "tutoring" : 
                     listingType === "camps" ? "camp" :
                     listingType === "internships" ? "internship" :
                     listingType === "jobs" ? "job" :
                     listingType,
        listingId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${listingType === "tutoring" ? "tutoring-providers" : listingType === "camps" ? "summer-camps" : listingType}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/bookmarks/${listingType === "tutoring" ? "tutoring" : listingType === "camps" ? "camp" : listingType === "internships" ? "internship" : listingType === "jobs" ? "job" : listingType}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
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

  // Get user interactions for a listing
  const { data: userInteractions } = useQuery({
    queryKey: [`/api/thumbs-up/${listingType === "tutoring" ? "tutoring" : listingType === "camps" ? "camp" : listingType === "internships" ? "internship" : listingType === "jobs" ? "job" : listingType}`, selectedListing?.id, "user"],
    enabled: isAuthenticated && !!selectedListing,
    retry: false,
  });

  // Row Actions Component with individual state tracking
  const RowActions = ({ listing }: { listing: any }) => {
    const { data: bookmarkData } = useQuery({
      queryKey: [`/api/bookmarks/${listingType === "tutoring" ? "tutoring" : listingType === "camps" ? "camp" : listingType === "internships" ? "internship" : listingType === "jobs" ? "job" : listingType}`, listing.id, "user"],
      enabled: isAuthenticated,
      retry: false,
    });

    const { data: thumbsUpData } = useQuery({
      queryKey: [`/api/thumbs-up/${listingType === "tutoring" ? "tutoring" : listingType === "camps" ? "camp" : listingType === "internships" ? "internship" : listingType === "jobs" ? "job" : listingType}`, listing.id, "user"],
      enabled: isAuthenticated,
      retry: false,
    });

    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (!isAuthenticated) {
              window.location.href = "/api/login";
              return;
            }
            thumbsUpMutation.mutate({ listingId: listing.id });
          }}
          disabled={thumbsUpMutation.isPending}
          className={`text-gray-400 ${thumbsUpData?.hasThumbedUp ? "text-red-500" : "hover:text-red-500"}`}
        >
          <ThumbsUp className={`h-4 w-4 ${thumbsUpData?.hasThumbedUp ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (!isAuthenticated) {
              window.location.href = "/api/login";
              return;
            }
            bookmarkMutation.mutate({ listingId: listing.id });
          }}
          disabled={bookmarkMutation.isPending}
          className={`text-gray-400 ${bookmarkData?.isBookmarked ? "text-yellow-500" : "hover:text-yellow-500"}`}
        >
          <Bookmark className={`h-4 w-4 ${bookmarkData?.isBookmarked ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleShare(listing);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const handleSort = (column: string) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters({
      ...filters,
      sortBy: column,
      sortOrder: newOrder,
      offset: 0,
    });
  };

  const handlePageChange = (newOffset: number) => {
    setFilters({
      ...filters,
      offset: newOffset,
    });
  };

  const handleLimitChange = (newLimit: string) => {
    setFilters({
      ...filters,
      limit: parseInt(newLimit),
      offset: 0,
    });
  };

  const handleViewDetails = (listing: any) => {
    setSelectedListing(listing);
    setDetailModalOpen(true);
  };

  const handleShare = (listing: any) => {
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

  const renderCellContent = (column: string, listing: any) => {
    switch (column) {
      case "name":
      case "companyName":
        return (
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage 
                src={listing.photoUrl || listing.photo_url || ""} 
                alt={listing.name || listing.companyName} 
                className="object-cover"
              />
              <AvatarFallback>
                {(listing.name || listing.companyName || "").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {listing.name || listing.companyName}
              </div>
              {listing.type && (
                <div className="text-sm text-gray-500">{listing.type}</div>
              )}
              <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                {listing.description}
              </div>
              {/* Show delivery mode if available */}
              {listing.deliveryMode && (
                <div className="text-xs text-blue-600 mt-1">
                  {formatArrayField(listing.deliveryMode)}
                </div>
              )}
            </div>
          </div>
        );

      case "title":
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{listing.title}</div>
            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
              {listing.description}
            </div>
            {/* Show job types and schedule if available */}
            {listing.jobType && (
              <div className="text-xs text-purple-600 mt-1">
                {formatArrayField(listing.jobType)}
              </div>
            )}
            {listing.schedule && (
              <div className="text-xs text-green-600 mt-1">
                {formatArrayField(listing.schedule)}
              </div>
            )}
          </div>
        );

      case "rating":
        return (
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= Math.floor(Number(listing.averageRating || 0)) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 mr-2">
              {Number(listing.averageRating || 0).toFixed(1)}
            </span>
            <span className="text-xs text-primary-600">
              ({Number(listing.reviewCount || 0)} reviews)
            </span>
          </div>
        );

      case "thumbsUp":
      case "thumbsUpCount":
        return (
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-gray-900">
              {Math.floor(listing.thumbsUpCount) || 0}
            </span>
          </div>
        );

      case "categories":
      case "types":
      case "tags":
      case "subjects":
      case "jobType":
      case "schedule":
      case "duration":
        const values = listing[column] || [];
        const displayValues = formatArrayField(values).split(", ").filter(Boolean);
        return (
          <div className="flex flex-wrap gap-1">
            {displayValues.slice(0, 2).map((value: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {value}
              </Badge>
            ))}
            {displayValues.length > 2 && (
              <span className="text-xs text-gray-500">+{displayValues.length - 2} more</span>
            )}
          </div>
        );

      case "location":
        return (
          <div className="text-sm text-gray-900">
            {(Array.isArray(listing.deliveryMode) && listing.deliveryMode.includes("Remote")) || listing.isRemote
              ? "Remote" 
              : listing.location || [listing.city, listing.state, listing.zipcode].filter(Boolean).join(", ")}
          </div>
        );

      case "difficultyLevel":
        return (
          <Badge variant="outline">
            Level {listing.difficultyLevel}
          </Badge>
        );

      case "costRange":
        return (
          <div className="text-sm text-gray-900">
            {listing.costRange || "Not specified"}
          </div>
        );

      case "selectivityLevel":
        const selectivityLevels = [
          { value: 1, label: "Open Enrollment", color: "bg-green-500" },
          { value: 2, label: "Application-Based", color: "bg-yellow-500" },
          { value: 3, label: "Competitive", color: "bg-orange-500" },
          { value: 4, label: "Very Competitive", color: "bg-red-500" },
        ];
        const selectivityLevel = selectivityLevels.find(level => level.value === listing.selectivityLevel);
        return selectivityLevel ? (
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${selectivityLevel.color}`}></div>
            <span className="text-sm text-gray-700">{selectivityLevel.label}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Not specified</span>
        );

      case "compensation":
      case "salaryRange":
        return (
          <div className="text-sm text-gray-900">
            {listing.salaryRange ? formatSalary(listing.salaryRange, listing.salaryType) : 
             listing.compensation || "Not specified"}
          </div>
        );

      case "applicationDueDate":
      case "applicationDeadline":
      case "closingDate":
      case "openingDate":
        const dateValue = listing[column];
        return dateValue ? (
          <div className="text-sm text-gray-900">
            {formatDate(dateValue)}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Not set</span>
        );

      case "deliveryMode":
        return listing.deliveryMode ? (
          <Badge variant="outline" className="text-xs">
            {listing.deliveryMode}
          </Badge>
        ) : (
          <span className="text-sm text-gray-500">Not specified</span>
        );

      case "minimumAge":
        return listing.minimumAge ? (
          <div className="text-sm text-gray-900">
            {listing.minimumAge}+
          </div>
        ) : (
          <span className="text-sm text-gray-500">Any age</span>
        );

      case "actions":
        return <RowActions listing={listing} />;

      default:
        return listing[column] || "-";
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-500 mb-2">Error loading data</div>
          <p className="text-gray-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const totalPages = data ? Math.ceil(data.total / filters.limit) : 0;
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;

  return (
    <main className="flex-1 min-w-0">
      {/* Results Header */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {data ? (
                  <>
                    Showing {Math.min(filters.offset + 1, data.total)}-{Math.min(filters.offset + filters.limit, data.total)} of {data.total} results
                  </>
                ) : (
                  "Loading..."
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700 font-medium hidden sm:inline">Sort by:</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleSort(value)}
                >
                  <SelectTrigger className="w-full sm:w-[160px] md:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Items Per Page */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700 font-medium hidden sm:inline">Show:</label>
                <Select
                  value={filters.limit.toString()}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="hidden sm:table-header-group">
              <TableRow className="bg-gray-50">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && (
                        <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: filters.limit }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    <div className="text-gray-500">No results found</div>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or search terms
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                listings.map((listing: any) => (
                  <TableRow
                    key={listing.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer block sm:table-row border-b sm:border-0 mb-4 sm:mb-0"
                    onClick={() => handleViewDetails(listing)}
                  >
                    {columns.map((column, index) => (
                      <TableCell key={column.key} className="px-3 sm:px-6 py-2 sm:py-4 block sm:table-cell">
                        <div className="sm:hidden">
                          <span className="font-medium text-gray-500 text-sm">{column.label}: </span>
                        </div>
                        {renderCellContent(column.key, listing)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center text-xs sm:text-sm text-gray-700">
              <span>
                Showing <span className="font-medium">{Math.min(filters.offset + 1, data.total)}</span> to{" "}
                <span className="font-medium">{Math.min(filters.offset + filters.limit, data.total)}</span> of{" "}
                <span className="font-medium">{data.total}</span> results
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
                disabled={filters.offset === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange((pageNum - 1) * filters.limit)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange((totalPages - 1) * filters.limit)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.offset + filters.limit)}
                disabled={filters.offset + filters.limit >= data.total}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          listingType={listingType}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedListing(null);
          }}
        />
      )}
    </main>
  );
}
