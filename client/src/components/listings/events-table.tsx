import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users2, DollarSign, Eye, ThumbsUp, Star } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  state: string;
  categories: string[];
  targetAudience: string[];
  cost: string;
  registrationRequired: boolean;
  viewCount: number;
  thumbsUpCount: number;
  averageRating: number;
  reviewCount: number;
}

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
  onEventClick: (event: Event) => void;
  onThumbsUpChange?: () => void;
}

export function EventsTable({ events, isLoading, onEventClick, onThumbsUpChange }: EventsTableProps) {
  const [thumbsUpStates, setThumbsUpStates] = useState<Record<number, { count: number; isLoading: boolean; hasThumbedUp: boolean }>>({});
  const { toast } = useToast();

  // Fetch thumbs up states for all visible events
  useEffect(() => {
    const fetchThumbsUpStates = async () => {
      if (!events.length) return;

      const statePromises = events.map(async (event) => {
        try {
          const response = await fetch(`/api/thumbs-up/event/${event.id}/user`);
          if (response.ok) {
            const result = await response.json();
            return {
              eventId: event.id,
              hasThumbedUp: result.hasThumbedUp,
              count: event.thumbsUpCount
            };
          }
        } catch (error) {
          console.error(`Error fetching thumbs up state for event ${event.id}:`, error);
        }
        return {
          eventId: event.id,
          hasThumbedUp: false,
          count: event.thumbsUpCount
        };
      });

      const states = await Promise.all(statePromises);
      const statesMap = states.reduce((acc, state) => ({
        ...acc,
        [state.eventId]: {
          count: state.count,
          isLoading: false,
          hasThumbedUp: state.hasThumbedUp
        }
      }), {});

      setThumbsUpStates(statesMap);
    };

    fetchThumbsUpStates();
  }, [events]);

  const handleThumbsUp = async (eventId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (thumbsUpStates[eventId]?.isLoading) return;

    setThumbsUpStates(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], isLoading: true }
    }));

    try {
      const response = await fetch('/api/thumbs-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingType: 'event',
          listingId: eventId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Fetch the updated count
        const countResponse = await fetch(`/api/thumbs-up/event/${eventId}`);
        const countData = await countResponse.json();
        
        setThumbsUpStates(prev => ({
          ...prev,
          [eventId]: {
            count: countData.count,
            isLoading: false,
            hasThumbedUp: result.isThumbedUp
          }
        }));

        if (onThumbsUpChange) {
          onThumbsUpChange();
        }

        toast({
          title: result.isThumbedUp ? "👍 Thumbs up added!" : "Thumbs up removed",
          duration: 2000,
        });
      } else {
        throw new Error('Failed to toggle thumbs up');
      }
    } catch (error) {
      console.error('Error toggling thumbs up:', error);
      toast({
        title: "Error",
        description: "Failed to update thumbs up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setThumbsUpStates(prev => ({
        ...prev,
        [eventId]: { ...prev[eventId], isLoading: false }
      }));
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search terms to find more events.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEventClick(event)}
                className="ml-4"
              >
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {format(new Date(event.eventDate + 'T00:00:00'), "MMM d, yyyy")}
                </span>
              </div>
              
              {(event.startTime || event.endTime) && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {event.startTime && format(new Date(`2000-01-01T${event.startTime}`), "h:mm a")}
                    {event.startTime && event.endTime && " - "}
                    {event.endTime && format(new Date(`2000-01-01T${event.endTime}`), "h:mm a")}
                  </span>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {event.venue && `${event.venue}, `}
                  {event.city}, {event.state}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>{event.cost}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {event.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
              {event.categories.length > 3 && (
                <Badge variant="outline">
                  +{event.categories.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {event.organizer}</span>
                {event.registrationRequired && (
                  <Badge variant="outline" className="text-xs">
                    Registration Required
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {event.viewCount}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleThumbsUp(event.id, e)}
                  disabled={thumbsUpStates[event.id]?.isLoading}
                  className={`flex items-center space-x-1 h-8 px-2 text-sm ${
                    thumbsUpStates[event.id]?.hasThumbedUp ? 'text-blue-600' : 'text-gray-500'
                  } hover:text-blue-600 hover:bg-blue-50`}
                >
                  <ThumbsUp className={`h-4 w-4 ${
                    thumbsUpStates[event.id]?.hasThumbedUp ? 'fill-current' : ''
                  }`} />
                  <span>
                    {thumbsUpStates[event.id]?.count ?? event.thumbsUpCount}
                  </span>
                </Button>
                {event.reviewCount > 0 && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {event.averageRating.toFixed(1)} ({event.reviewCount})
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}