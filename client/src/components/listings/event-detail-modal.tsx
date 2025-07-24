import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, Users2, DollarSign, ExternalLink, Phone, Mail, User, Info } from "lucide-react";
import { format } from "date-fns";

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
  photoUrl: string;
  contactInfo: string;
  specialInstructions: string;
  viewCount: number;
  thumbsUpCount: number;
  averageRating: number;
  reviewCount: number;
}

interface EventDetailModalProps {
  event: Event;
  open: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
  const fullAddress = [event.address, event.city, event.state, event.zipcode]
    .filter(Boolean)
    .join(", ");

  const mapUrl = event.latitude && event.longitude 
    ? `https://www.google.com/maps?q=${event.latitude},${event.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  // Track view when modal opens
  useEffect(() => {
    if (open && event?.id) {
      const trackView = async () => {
        try {
          await fetch('/api/views/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              listingType: 'event',
              listingId: event.id,
            }),
          });
        } catch (error) {
          console.error('Failed to track view:', error);
        }
      };
      
      trackView();
    }
  }, [open, event?.id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Photo */}
            {event.photoUrl && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-3">Event Poster</h3>
                <div className="flex justify-center">
                  <img
                    src={event.photoUrl}
                    alt={`${event.title} photo`}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border border-gray-200"
                    style={{ maxHeight: 'min(70vh, 800px)' }}
                  />
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div>{format(new Date(event.eventDate + 'T00:00:00'), "EEEE, MMMM d, yyyy")}</div>
                  </div>
                </div>

                {(event.startTime || event.endTime) && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div>
                        {event.startTime && format(new Date(`2000-01-01T${event.startTime}`), "h:mm a")}
                        {event.startTime && event.endTime && " - "}
                        {event.endTime && format(new Date(`2000-01-01T${event.endTime}`), "h:mm a")}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div>{event.venue}</div>
                    <div className="text-sm text-gray-500">{fullAddress}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Cost</div>
                    <div>{event.cost}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About This Event</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Categories and Audience */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Target Audience</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.targetAudience.map((audience) => (
                      <Badge key={audience} variant="outline">
                        <Users2 className="h-3 w-3 mr-1" />
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>

                {event.ageRange && (
                  <div>
                    <h4 className="font-medium mb-2">Age Range</h4>
                    <Badge variant="outline">{event.ageRange}</Badge>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              {event.specialInstructions && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Special Instructions
                  </h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {event.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Registration</h3>
              {event.registrationRequired ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Registration is required for this event.
                  </p>
                  {event.registrationLink && (
                    <Button asChild className="w-full">
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Register Now
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No registration required - just show up!
                </p>
              )}
            </div>

            {/* Organizer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Organizer
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{event.organizer}</p>
                
                {event.organizerEmail && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a
                      href={`mailto:${event.organizerEmail}`}
                      className="hover:text-blue-600"
                    >
                      {event.organizerEmail}
                    </a>
                  </div>
                )}
                
                {event.organizerPhone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a
                      href={`tel:${event.organizerPhone}`}
                      className="hover:text-blue-600"
                    >
                      {event.organizerPhone}
                    </a>
                  </div>
                )}

                {event.contactInfo && (
                  <div className="text-sm text-gray-600 mt-2 pt-2 border-t">
                    <p className="whitespace-pre-wrap">{event.contactInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{event.venue}</p>
                  <p>{fullAddress}</p>
                </div>
                
                {/* Embedded Map */}
                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  {event.latitude && event.longitude ? (
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(event.longitude) - 0.01},${parseFloat(event.latitude) - 0.01},${parseFloat(event.longitude) + 0.01},${parseFloat(event.latitude) + 0.01}&layer=mapnik&marker=${event.latitude},${event.longitude}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      title={`Map showing ${event.venue}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      <div className="text-gray-600">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">{event.venue}</p>
                        <p className="text-xs">{fullAddress}</p>
                        <p className="text-xs mt-2">Click "Open in Google Maps" below to view location</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>

            {/* Event Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Event Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Views:</span>
                  <span>{event.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Likes:</span>
                  <span>{event.thumbsUpCount}</span>
                </div>
                {event.reviewCount > 0 && (
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span>{event.averageRating.toFixed(1)} ({event.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}