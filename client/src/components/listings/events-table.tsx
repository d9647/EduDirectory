import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users2, DollarSign, Eye, ThumbsUp, Star } from "lucide-react";
import { format } from "date-fns";

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
}

export function EventsTable({ events, isLoading, onEventClick }: EventsTableProps) {
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
                  {format(new Date(event.eventDate), "MMM d, yyyy")}
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
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {event.thumbsUpCount}
                </div>
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