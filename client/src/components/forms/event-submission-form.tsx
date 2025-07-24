import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { US_STATES } from "@/lib/constants";

const eventCategories = [
  "Academic", "Sports", "Arts & Culture", "Community Service", "Technology",
  "Career Development", "Social", "Health & Wellness", "Environment", "Music",
  "Drama & Theater", "Science", "Leadership", "Volunteer", "Competition"
];

const targetAudiences = [
  "High School", "College", "Young Adults", "All Ages"
];

const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Event description is required"),
  organizer: z.string().min(1, "Organizer name is required"),
  organizerEmail: z.string().email("Valid email is required"),
  organizerPhone: z.string().optional(),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  targetAudience: z.array(z.string()).min(1, "At least one target audience is required"),
  ageRange: z.string().optional(),
  cost: z.string().min(1, "Cost information is required"),
  registrationRequired: z.boolean(),
  registrationLink: z.string().optional(),
  posterUrl: z.string().optional(),
  contactInfo: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventSubmissionFormProps {
  onSuccess: () => void;
}

export function EventSubmissionForm({ onSuccess }: EventSubmissionFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      categories: [],
      targetAudience: [],
      registrationRequired: false,
    },
  });

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    form.setValue("categories", newCategories);
  };

  const handleAudienceToggle = (audience: string) => {
    const newAudiences = selectedAudiences.includes(audience)
      ? selectedAudiences.filter(a => a !== audience)
      : [...selectedAudiences, audience];
    
    setSelectedAudiences(newAudiences);
    form.setValue("targetAudience", newAudiences);
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...data,
        eventDate: data.eventDate.toISOString().split('T')[0],
        isApproved: false,
        isActive: false,
        viewCount: 0,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit event");
      }

      toast({
        title: "Success",
        description: "Event submitted successfully! It will be reviewed before being published.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting event:", error);
      toast({
        title: "Error",
        description: "Failed to submit event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter event title"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="organizer">Organizer Name *</Label>
              <Input
                id="organizer"
                {...form.register("organizer")}
                placeholder="Enter organizer name"
              />
              {form.formState.errors.organizer && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.organizer.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Event Description *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe your event in detail..."
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizerEmail">Email *</Label>
              <Input
                id="organizerEmail"
                type="email"
                {...form.register("organizerEmail")}
                placeholder="organizer@example.com"
              />
              {form.formState.errors.organizerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.organizerEmail.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="organizerPhone">Phone (Optional)</Label>
              <Input
                id="organizerPhone"
                {...form.register("organizerPhone")}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contactInfo">Additional Contact Info (Optional)</Label>
            <Textarea
              id="contactInfo"
              {...form.register("contactInfo")}
              placeholder="Any additional contact information or instructions..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date and Time */}
      <Card>
        <CardHeader>
          <CardTitle>Date and Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Event Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("eventDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("eventDate") ? (
                      format(form.watch("eventDate"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("eventDate")}
                    onSelect={(date) => form.setValue("eventDate", date!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.eventDate && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.eventDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="startTime">Start Time (Optional)</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time (Optional)</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register("endTime")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="venue">Venue *</Label>
            <Input
              id="venue"
              {...form.register("venue")}
              placeholder="Enter venue name"
            />
            {form.formState.errors.venue && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.venue.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Street Address (Optional)</Label>
            <Input
              id="address"
              {...form.register("address")}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...form.register("city")}
                placeholder="Enter city"
              />
              {form.formState.errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select
                value={form.watch("state") || ""}
                onValueChange={(value) => form.setValue("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="zipcode">Zipcode (Optional)</Label>
              <Input
                id="zipcode"
                {...form.register("zipcode")}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories and Audience */}
      <Card>
        <CardHeader>
          <CardTitle>Categories and Audience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Event Categories *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {form.formState.errors.categories && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.categories.message}
              </p>
            )}
          </div>

          <div>
            <Label>Target Audience *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
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
            {selectedAudiences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAudiences.map((audience) => (
                  <Badge key={audience} variant="outline">
                    {audience}
                    <button
                      type="button"
                      onClick={() => handleAudienceToggle(audience)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {form.formState.errors.targetAudience && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.targetAudience.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="ageRange">Age Range (Optional)</Label>
            <Input
              id="ageRange"
              {...form.register("ageRange")}
              placeholder="e.g., 14-18, 16+, All Ages"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost and Registration */}
      <Card>
        <CardHeader>
          <CardTitle>Cost and Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cost">Cost *</Label>
            <Input
              id="cost"
              {...form.register("cost")}
              placeholder="Free, $10, $10-20, etc."
            />
            {form.formState.errors.cost && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.cost.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="registrationRequired"
              checked={form.watch("registrationRequired")}
              onCheckedChange={(checked) => form.setValue("registrationRequired", !!checked)}
            />
            <Label htmlFor="registrationRequired">
              Registration is required for this event
            </Label>
          </div>

          {form.watch("registrationRequired") && (
            <div>
              <Label htmlFor="registrationLink">Registration Link</Label>
              <Input
                id="registrationLink"
                {...form.register("registrationLink")}
                placeholder="https://example.com/register"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="posterUrl">Event Poster URL (Optional)</Label>
            <Input
              id="posterUrl"
              {...form.register("posterUrl")}
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div>
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              {...form.register("specialInstructions")}
              placeholder="Any special instructions for attendees..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? "Submitting..." : "Submit Event"}
        </Button>
      </div>
    </form>
  );
}