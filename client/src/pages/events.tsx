import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Users2, DollarSign, Search, Plus } from "lucide-react";
import Header from "@/components/layout/header";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { EventsTable } from "@/components/listings/events-table";
import { EventDetailModal } from "@/components/listings/event-detail-modal";
import { EventSubmissionForm } from "@/components/forms/event-submission-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  organizerEmail: string;
  organizerPhone: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: string;
  longitude: string;
  categories: string[];
  targetAudience: string[];
  ageRange: string;
  cost: string;
  registrationRequired: boolean;
  registrationLink: string;
  posterUrl: string;
  contactInfo: string;
  specialInstructions: string;
  viewCount: number;
  thumbsUpCount: number;
  averageRating: number;
  reviewCount: number;
}

const eventCategories = [
  "Academic", "Sports", "Arts & Culture", "Community Service", "Technology",
  "Career Development", "Social", "Health & Wellness", "Environment", "Music",
  "Drama & Theater", "Science", "Leadership", "Volunteer", "Competition"
];

const targetAudiences = [
  "High School", "College", "Young Adults", "All Ages"
];

const costRanges = [
  "Free", "$1-10", "$11-25", "$26-50", "$51-100", "$100+"
];

export default function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<string[]>([]);
  const [zipcode, setZipcode] = useState("");
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [registrationFilter, setRegistrationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("eventDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const pageSize = 10;

  // Build query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedAudiences.length > 0) params.set("targetAudience", selectedAudiences.join(","));
    if (selectedCosts.length > 0) params.set("cost", selectedCosts.join(","));
    if (zipcode) params.set("zipcode", zipcode);
    if (distance) params.set("distance", distance.toString());
    if (selectedDate) params.set("eventDate", selectedDate.toISOString().split('T')[0]);
    if (registrationFilter !== "all") {
      params.set("registrationRequired", registrationFilter === "required" ? "true" : "false");
    }
    
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("limit", pageSize.toString());
    params.set("offset", ((currentPage - 1) * pageSize).toString());

    return params.toString();
  };

  // Fetch events
  const { data: eventsData, isLoading, refetch } = useQuery({
    queryKey: ["/api/events", buildQueryParams()],
    queryFn: async () => {
      const response = await fetch(`/api/events?${buildQueryParams()}`);
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    }
  });

  const events = eventsData?.events || [];
  const totalEvents = eventsData?.total || 0;
  const totalPages = Math.ceil(totalEvents / pageSize);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedAudiences, selectedCosts, selectedDate, zipcode, distance, registrationFilter]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAudienceToggle = (audience: string) => {
    setSelectedAudiences(prev => 
      prev.includes(audience) 
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  const handleCostToggle = (cost: string) => {
    setSelectedCosts(prev => 
      prev.includes(cost) 
        ? prev.filter(c => c !== cost)
        : [...prev, cost]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedAudiences([]);
    setSelectedCosts([]);
    setSelectedDate(undefined);
    setZipcode("");
    setDistance(undefined);
    setRegistrationFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Events</h1>
            <p className="text-gray-600 mt-2">
              Discover local events for high schoolers and young adults
            </p>
          </div>
          
          <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Community Event</DialogTitle>
              </DialogHeader>
              <EventSubmissionForm onSuccess={() => {
                setShowSubmissionForm(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Calendar and Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Event Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Showing events for: {selectedDate.toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(undefined)}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Clear date filter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search events, organizers, venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
              </CardContent>
            </Card>

            {/* Location Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zipcode">Zipcode</Label>
                  <Input
                    id="zipcode"
                    placeholder="Enter zipcode"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance (miles)</Label>
                  <Select value={distance?.toString() || "any"} onValueChange={(value) => setDistance(value === "any" ? undefined : parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any distance</SelectItem>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                      <SelectItem value="100">Within 100 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Categories Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {eventCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users2 className="h-5 w-5 mr-2" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {targetAudiences.map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <Checkbox
                        id={audience}
                        checked={selectedAudiences.includes(audience)}
                        onCheckedChange={() => handleAudienceToggle(audience)}
                      />
                      <Label htmlFor={audience} className="text-sm">
                        {audience}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {costRanges.map((cost) => (
                    <div key={cost} className="flex items-center space-x-2">
                      <Checkbox
                        id={cost}
                        checked={selectedCosts.includes(cost)}
                        onCheckedChange={() => handleCostToggle(cost)}
                      />
                      <Label htmlFor={cost} className="text-sm">
                        {cost}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Registration Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={registrationFilter} onValueChange={setRegistrationFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="required">Registration Required</SelectItem>
                    <SelectItem value="not-required">No Registration Needed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Right Panel - Events Listing */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {totalEvents} events found
                </span>
                {selectedDate && (
                  <Badge variant="secondary">
                    {selectedDate.toLocaleDateString()}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eventDate">Event Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="thumbsUp">Most Liked</SelectItem>
                    <SelectItem value="viewCount">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">↑ Asc</SelectItem>
                    <SelectItem value="desc">↓ Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <EventsTable
              events={events}
              isLoading={isLoading}
              onEventClick={setSelectedEvent}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}