import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, X, Upload } from "lucide-react";
import {
  TUTORING_CATEGORIES,
  TUTORING_SUBJECTS,
  CAMP_CATEGORIES,
  CAMP_TAGS,
  CAMP_COST_OPTIONS,
  SELECTIVITY_LEVELS,
  INTERNSHIP_TYPES,
  INTERNSHIP_DURATION_OPTIONS,
  COMPENSATION_TYPES,
  JOB_CATEGORIES,
  JOB_COMPENSATION_TYPES,
  DELIVERY_MODE_OPTIONS,
  JOB_TYPE_OPTIONS,
  SALARY_TYPE_OPTIONS,
  SCHEDULE_OPTIONS,
  US_STATES,
  AGE_RANGE_OPTIONS,
  EVENT_CATEGORIES,
  TARGET_AUDIENCE_OPTIONS,
} from "@/lib/constants";

interface AdminEditModalProps {
  type: "tutoring-provider" | "summer-camp" | "internship" | "job" | "event";
  listing: any;
}

export default function AdminEditModal({ type, listing }: AdminEditModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(() => {
    // Format date fields for HTML date inputs
    const formatted = { ...listing };
    const dateFields = ['applicationOpen', 'applicationDeadline', 'openingDate', 'closingDate', 'startDate', 'endDate'];
    
    dateFields.forEach(field => {
      if (formatted[field]) {
        const date = new Date(formatted[field]);
        if (!isNaN(date.getTime())) {
          formatted[field] = date.toISOString().split('T')[0];
        }
      }
    });
    
    return formatted;
  });
  
  // State for checkbox selections - initialize from existing data
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(listing.categories) ? listing.categories : []
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    Array.isArray(listing.subjects) ? listing.subjects : []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    Array.isArray(listing.types) ? listing.types : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    Array.isArray(listing.tags) ? listing.tags : []
  );
  const [selectedDuration, setSelectedDuration] = useState<string[]>(
    Array.isArray(listing.duration) ? listing.duration : []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(
    Array.isArray(listing.jobType) ? listing.jobType : []
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>(
    Array.isArray(listing.schedule) ? listing.schedule : []
  );
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>(
    Array.isArray(listing.deliveryMode) ? listing.deliveryMode : []
  );
  
  // Event-specific state
  const [selectedEventCategories, setSelectedEventCategories] = useState<string[]>(
    Array.isArray(listing.categories) ? listing.categories : []
  );
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string[]>(
    Array.isArray(listing.targetAudience) ? listing.targetAudience : []
  );
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>(
    Array.isArray(listing.ageRange) ? listing.ageRange : 
    (listing.ageRange ? [listing.ageRange] : [])
  );
  
  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    listing.photoUrl || null
  );
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      // Upload photo if there's a new file
      let photoUrl = formData.photoUrl;
      if (photoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("photo", photoFile);
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          photoUrl = uploadResult.url;
        } else {
          throw new Error("Photo upload failed");
        }
      }
      
      // Prepare data with checkbox selections
      const updatedData = {
        ...data,
        categories: type === 'event' ? selectedEventCategories : selectedCategories,
        subjects: selectedSubjects,
        types: selectedTypes,
        tags: selectedTags,
        duration: selectedDuration,
        jobType: selectedJobTypes,
        schedule: selectedSchedule,
        deliveryMode: selectedDeliveryModes,
        targetAudience: selectedTargetAudience,
        ageRange: selectedAgeRanges,
        photoUrl: photoUrl,
      };
      
      await apiRequest("PUT", `/api/admin/edit/${type}/${listing.id}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/live-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tutoring-providers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summer-camps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/internships"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: "Listing updated successfully",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  // Toggle functions for checkboxes
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleType = (typeValue: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeValue) 
        ? prev.filter(t => t !== typeValue)
        : [...prev, typeValue]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleDuration = (duration: string) => {
    setSelectedDuration(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const toggleJobType = (jobType: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(jobType) 
        ? prev.filter(jt => jt !== jobType)
        : [...prev, jobType]
    );
  };

  const toggleSchedule = (schedule: string) => {
    setSelectedSchedule(prev => 
      prev.includes(schedule) 
        ? prev.filter(s => s !== schedule)
        : [...prev, schedule]
    );
  };

  // Remove functions for badges
  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects(prev => prev.filter(s => s !== subject));
  };

  const removeType = (typeValue: string) => {
    setSelectedTypes(prev => prev.filter(t => t !== typeValue));
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const removeDuration = (duration: string) => {
    setSelectedDuration(prev => prev.filter(d => d !== duration));
  };

  const removeJobType = (jobType: string) => {
    setSelectedJobTypes(prev => prev.filter(jt => jt !== jobType));
  };

  const removeSchedule = (schedule: string) => {
    setSelectedSchedule(prev => prev.filter(s => s !== schedule));
  };

  const toggleDeliveryMode = (mode: string) => {
    setSelectedDeliveryModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const removeDeliveryMode = (mode: string) => {
    setSelectedDeliveryModes(prev => prev.filter(m => m !== mode));
  };

  // Photo upload functions
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, photoUrl: "" }));
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        {/* Basic Information */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">
              {type === "tutoring-provider" ? "Provider Name" : 
               type === "summer-camp" ? "Camp Name" : "Company Name"} *
            </Label>
            <Input
              id="name"
              value={formData.name || formData.companyName || formData.title || ""}
              onChange={(e) => {
                if (formData.name !== undefined) handleChange("name", e.target.value);
                else if (formData.companyName !== undefined) handleChange("companyName", e.target.value);
                else handleChange("title", e.target.value);
              }}
            />
          </div>

          {(type === "internship" || type === "job") && (
            <div className="space-y-2">
              <Label htmlFor="title">Position Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              placeholder="Provide a detailed description..."
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
          
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm">City *</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm">State *</Label>
              <Select value={formData.state || ""} onValueChange={(value) => handleChange("state", value)}>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                id="zipcode"
                value={formData.zipcode || ""}
                onChange={(e) => handleChange("zipcode", e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Mode</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DELIVERY_MODE_OPTIONS.map((mode) => (
                <div key={mode.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`delivery-${mode.value}`}
                    checked={selectedDeliveryModes.includes(mode.value)}
                    onCheckedChange={() => toggleDeliveryMode(mode.value)}
                  />
                  <Label htmlFor={`delivery-${mode.value}`} className="text-sm cursor-pointer">
                    {mode.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedDeliveryModes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedDeliveryModes.map((mode) => (
                  <Badge key={mode} variant="secondary" className="text-xs">
                    {mode}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeDeliveryMode(mode)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Logo/Photo Upload
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {photoPreview ? "Replace Photo" : "Choose Photo"}
                </Label>
                <span className="text-sm text-gray-500">
                  Max size: 5MB. Supported: JPG, PNG, GIF
                </span>
              </div>

              {photoPreview && (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );

    switch (type) {
      case "tutoring-provider":
        return (
          <>
            {commonFields}
            
            {/* Categories & Subjects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Categories & Subjects</h3>
              
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Service Type</Label>
                <Select value={formData.type || ""} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Group">Group</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Categories */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Subject Categories *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {TUTORING_CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.value}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <Label htmlFor={category.value} className="text-sm">
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Specific Subjects */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Specific Subjects
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {TUTORING_SUBJECTS.map((subject) => (
                    <div key={subject.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject.value}
                        checked={selectedSubjects.includes(subject.value)}
                        onCheckedChange={() => toggleSubject(subject.value)}
                      />
                      <Label htmlFor={subject.value} className="text-sm">
                        {subject.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSubjects.map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                        <button
                          type="button"
                          onClick={() => removeSubject(subject)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case "summer-camp":
        return (
          <>
            {commonFields}
            
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Camp Categories *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {CAMP_CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.value}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <Label htmlFor={category.value} className="text-sm">
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Camp Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Camp Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selectivityLevel">Selectivity Level</Label>
                  <Select value={formData.selectivityLevel?.toString() || ""} onValueChange={(value) => handleChange("selectivityLevel", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select selectivity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELECTIVITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Program Tags */}
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-3 block">Program Tags</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {CAMP_TAGS.map((tag) => (
                      <div key={tag.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.value}
                          checked={selectedTags.includes(tag.value)}
                          onCheckedChange={() => toggleTag(tag.value)}
                        />
                        <Label htmlFor={tag.value} className="text-sm text-gray-700">
                          {tag.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scholarship Available */}
                <div className="space-y-2">
                  <Label>Scholarship Available</Label>
                  <div className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id="hasScholarship"
                      checked={formData.hasScholarship === true}
                      onCheckedChange={(checked) => handleChange("hasScholarship", checked)}
                    />
                    <Label htmlFor="hasScholarship" className="text-sm">
                      Scholarship Available
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dates">Camp Dates</Label>
                  <Input
                    id="dates"
                    value={formData.dates || ""}
                    onChange={(e) => handleChange("dates", e.target.value)}
                    placeholder="e.g., June 15-29, July 6-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    value={formData.length || ""}
                    onChange={(e) => handleChange("length", e.target.value)}
                    placeholder="e.g., 2 weeks, 1 week"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumAge">Minimum Age</Label>
                  <Input
                    id="minimumAge"
                    type="number"
                    min="5"
                    max="18"
                    value={formData.minimumAge || ""}
                    onChange={(e) => handleChange("minimumAge", parseInt(e.target.value) || undefined)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costRange">Cost Range</Label>
                <Select value={formData.costRange || ""} onValueChange={(value) => handleChange("costRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cost range" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMP_COST_OPTIONS.map((cost) => (
                      <SelectItem key={cost.value} value={cost.value}>
                        {cost.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Important Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationOpen">Application Open Date</Label>
                  <Input
                    id="applicationOpen"
                    type="date"
                    value={formData.applicationOpen || ""}
                    onChange={(e) => handleChange("applicationOpen", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline || ""}
                    onChange={(e) => handleChange("applicationDeadline", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility Requirements</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility || ""}
                  onChange={(e) => handleChange("eligibility", e.target.value)}
                  rows={3}
                  placeholder="Describe eligibility requirements..."
                />
              </div>

              <div className="space-y-2">
                <Label>Application Available</Label>
                <div className="flex items-center space-x-3 rounded-md border p-4">
                  <Checkbox
                    id="applicationAvailable"
                    checked={formData.applicationAvailable === true}
                    onCheckedChange={(checked) => handleChange("applicationAvailable", checked)}
                  />
                  <Label htmlFor="applicationAvailable" className="text-sm">
                    Application Available
                  </Label>
                </div>
              </div>
            </div>
          </>
        );

      case "internship":
        return (
          <>
            {commonFields}
            
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Categories *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {INTERNSHIP_TYPES.map((typeOption) => (
                    <div key={typeOption.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={typeOption.value}
                        checked={selectedTypes.includes(typeOption.value)}
                        onCheckedChange={() => toggleType(typeOption.value)}
                      />
                      <Label htmlFor={typeOption.value} className="text-sm">
                        {typeOption.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map((typeValue) => (
                      <Badge key={typeValue} variant="secondary">
                        {typeValue}
                        <button
                          type="button"
                          onClick={() => removeType(typeValue)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Internship Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Internship Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compensation">Compensation Type</Label>
                  <Select value={formData.compensation || ""} onValueChange={(value) => handleChange("compensation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compensation" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPENSATION_TYPES.map((comp) => (
                        <SelectItem key={comp.value} value={comp.value}>
                          {comp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selectivityLevel">Selectivity Level</Label>
                  <Select value={formData.selectivityLevel?.toString() || ""} onValueChange={(value) => handleChange("selectivityLevel", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select selectivity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELECTIVITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumAge">Minimum Age</Label>
                  <Input
                    id="minimumAge"
                    type="number"
                    min="14"
                    max="25"
                    value={formData.minimumAge || ""}
                    onChange={(e) => handleChange("minimumAge", parseInt(e.target.value) || undefined)}
                  />
                </div>

                {/* Mentorship Available */}
                <div className="space-y-2">
                  <Label>Mentorship Available</Label>
                  <div className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id="hasMentorship"
                      checked={formData.hasMentorship === true}
                      onCheckedChange={(checked) => handleChange("hasMentorship", checked)}
                    />
                    <Label htmlFor="hasMentorship" className="text-sm">
                      Mentorship Available
                    </Label>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Duration
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {INTERNSHIP_DURATION_OPTIONS.map((duration) => (
                    <div key={duration.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={duration.value}
                        checked={selectedDuration.includes(duration.value)}
                        onCheckedChange={() => toggleDuration(duration.value)}
                      />
                      <Label htmlFor={duration.value} className="text-sm">
                        {duration.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedDuration.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDuration.map((duration) => (
                      <Badge key={duration} variant="secondary">
                        {duration}
                        <button
                          type="button"
                          onClick={() => removeDuration(duration)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Internship Dates and Length */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="internshipDates">Internship Dates</Label>
                  <Input
                    id="internshipDates"
                    value={formData.internshipDates || ""}
                    onChange={(e) => handleChange("internshipDates", e.target.value)}
                    placeholder="e.g., June 1 - August 15, 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    value={formData.length || ""}
                    onChange={(e) => handleChange("length", e.target.value)}
                    placeholder="e.g., 10 weeks, 3 months"
                  />
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationOpen">Application Open Date</Label>
                  <Input
                    id="applicationOpen"
                    type="date"
                    value={formData.applicationOpen || ""}
                    onChange={(e) => handleChange("applicationOpen", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline || ""}
                    onChange={(e) => handleChange("applicationDeadline", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Textarea
                    id="prerequisites"
                    value={formData.prerequisites || ""}
                    onChange={(e) => handleChange("prerequisites", e.target.value)}
                    rows={3}
                    placeholder="e.g., GPA requirements, coursework, skills..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tuition">Tuition</Label>
                  <Input
                    id="tuition"
                    value={formData.tuition || ""}
                    onChange={(e) => handleChange("tuition", e.target.value)}
                    placeholder="e.g., $500, Free, N/A"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case "job":
        return (
          <>
            {commonFields}
            
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Job Categories *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {JOB_CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.value}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      />
                      <Label htmlFor={category.value} className="text-sm">
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compensation">Compensation Type</Label>
                  <Select value={formData.compensation || ""} onValueChange={(value) => handleChange("compensation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compensation" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_COMPENSATION_TYPES.map((comp) => (
                        <SelectItem key={comp.value} value={comp.value}>
                          {comp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Job Type
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {JOB_TYPE_OPTIONS.map((jobType) => (
                    <div key={jobType.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={jobType.value}
                        checked={selectedJobTypes.includes(jobType.value)}
                        onCheckedChange={() => toggleJobType(jobType.value)}
                      />
                      <Label htmlFor={jobType.value} className="text-sm">
                        {jobType.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedJobTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedJobTypes.map((jobType) => (
                      <Badge key={jobType} variant="secondary">
                        {jobType}
                        <button
                          type="button"
                          onClick={() => removeJobType(jobType)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Schedule
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {SCHEDULE_OPTIONS.map((schedule) => (
                    <div key={schedule.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={schedule.value}
                        checked={selectedSchedule.includes(schedule.value)}
                        onCheckedChange={() => toggleSchedule(schedule.value)}
                      />
                      <Label htmlFor={schedule.value} className="text-sm">
                        {schedule.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedSchedule.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSchedule.map((schedule) => (
                      <Badge key={schedule} variant="secondary">
                        {schedule}
                        <button
                          type="button"
                          onClick={() => removeSchedule(schedule)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Salary Range</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Minimum</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salaryMin || ""}
                      onChange={(e) => handleChange("salaryMin", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Maximum</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salaryMax || ""}
                      onChange={(e) => handleChange("salaryMax", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salaryType">Salary Type</Label>
                    <Select value={formData.salaryType || ""} onValueChange={(value) => handleChange("salaryType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALARY_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingDate">Opening Date</Label>
                  <Input
                    id="openingDate"
                    type="date"
                    value={formData.openingDate || ""}
                    onChange={(e) => handleChange("openingDate", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="closingDate">Closing Date</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    value={formData.closingDate || ""}
                    onChange={(e) => handleChange("closingDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Ongoing Option */}
              <div className="space-y-2">
                <Label>Ongoing Position</Label>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isOngoing"
                    checked={formData.isOngoing === true}
                    onCheckedChange={(checked) => handleChange("isOngoing", checked)}
                  />
                  <Label htmlFor="isOngoing" className="text-sm">
                    Ongoing Position (no closing date)
                  </Label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Training Provided */}
                <div className="space-y-2">
                  <Label>Training Provided</Label>
                  <div className="flex items-center space-x-3 rounded-md border p-4">
                    <Checkbox
                      id="hasTraining"
                      checked={formData.hasTraining === true}
                      onCheckedChange={(checked) => handleChange("hasTraining", checked)}
                    />
                    <Label htmlFor="hasTraining" className="text-sm">
                      Training Provided
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimumAge">Minimum Age</Label>
                  <Input
                    id="minimumAge"
                    type="number"
                    min="14"
                    max="25"
                    value={formData.minimumAge || ""}
                    onChange={(e) => handleChange("minimumAge", parseInt(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>
          </>
        );

      case "event":
        return (
          <>
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer Name *</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer || ""}
                    onChange={(e) => handleChange("organizer", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizerEmail">Email *</Label>
                  <Input
                    id="organizerEmail"
                    type="email"
                    value={formData.organizerEmail || ""}
                    onChange={(e) => handleChange("organizerEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizerPhone">Phone</Label>
                  <Input
                    id="organizerPhone"
                    value={formData.organizerPhone || ""}
                    onChange={(e) => handleChange("organizerPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Event Categories *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {["Academic", "Sports", "Arts & Culture", "Community Service", "Technology", "Career Development", "Social", "Health & Wellness", "Environment", "Music", "Drama & Theater", "Science", "Leadership", "Volunteer", "Competition"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedEventCategories.includes(category)}
                        onCheckedChange={() => {
                          const newCategories = selectedEventCategories.includes(category)
                            ? selectedEventCategories.filter(c => c !== category)
                            : [...selectedEventCategories, category];
                          setSelectedEventCategories(newCategories);
                          handleChange("categories", newCategories);
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedEventCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEventCategories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const newCategories = selectedEventCategories.filter(c => c !== category);
                            setSelectedEventCategories(newCategories);
                            handleChange("categories", newCategories);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Target Audience</h3>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Target Audience *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {["High School", "College", "Young Adults", "All Ages"].map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <Checkbox
                        id={audience}
                        checked={selectedTargetAudience.includes(audience)}
                        onCheckedChange={() => {
                          const newAudience = selectedTargetAudience.includes(audience)
                            ? selectedTargetAudience.filter(a => a !== audience)
                            : [...selectedTargetAudience, audience];
                          setSelectedTargetAudience(newAudience);
                          handleChange("targetAudience", newAudience);
                        }}
                      />
                      <Label htmlFor={audience} className="text-sm">
                        {audience}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedTargetAudience.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTargetAudience.map((audience) => (
                      <Badge key={audience} variant="secondary">
                        {audience}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => {
                            const newAudience = selectedTargetAudience.filter(a => a !== audience);
                            setSelectedTargetAudience(newAudience);
                            handleChange("targetAudience", newAudience);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate || ""}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime || ""}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime || ""}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  value={formData.venue || ""}
                  onChange={(e) => handleChange("venue", e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state || ""} onValueChange={(value) => handleChange("state", value)}>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">Zipcode</Label>
                  <Input
                    id="zipcode"
                    value={formData.zipcode || ""}
                    onChange={(e) => handleChange("zipcode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    value={formData.cost || ""}
                    onChange={(e) => handleChange("cost", e.target.value)}
                    placeholder="Free, $10, $5-$20, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="space-y-2">
                    {AGE_RANGE_OPTIONS.map((ageRangeOption) => (
                      <div key={ageRangeOption.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ageRange-${ageRangeOption.value}`}
                          checked={selectedAgeRanges.includes(ageRangeOption.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAgeRanges([...selectedAgeRanges, ageRangeOption.value]);
                            } else {
                              setSelectedAgeRanges(selectedAgeRanges.filter(a => a !== ageRangeOption.value));
                            }
                          }}
                        />
                        <Label htmlFor={`ageRange-${ageRangeOption.value}`} className="text-sm">
                          {ageRangeOption.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedAgeRanges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedAgeRanges.map((ageRange) => (
                        <Badge key={ageRange} variant="secondary" className="text-xs">
                          {ageRange}
                          <button
                            type="button"
                            onClick={() => setSelectedAgeRanges(selectedAgeRanges.filter(a => a !== ageRange))}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Registration Required</Label>
                <div className="flex items-center space-x-3 rounded-md border p-4">
                  <Checkbox
                    id="registrationRequired"
                    checked={formData.registrationRequired === true}
                    onCheckedChange={(checked) => handleChange("registrationRequired", checked)}
                  />
                  <Label htmlFor="registrationRequired" className="text-sm">
                    Registration Required
                  </Label>
                </div>
              </div>

              {formData.registrationRequired && (
                <div className="space-y-2">
                  <Label htmlFor="registrationLink">Registration Link</Label>
                  <Input
                    id="registrationLink"
                    type="url"
                    value={formData.registrationLink || ""}
                    onChange={(e) => handleChange("registrationLink", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Additional Contact Info</Label>
                <Textarea
                  id="contactInfo"
                  value={formData.contactInfo || ""}
                  onChange={(e) => handleChange("contactInfo", e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Event Photo Upload (Optional)
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {photoPreview ? "Replace Photo" : "Choose Photo"}
                    </Label>
                    <span className="text-sm text-gray-500">
                      Max size: 5MB. Supported: JPG, PNG, GIF
                    </span>
                  </div>
                  
                  {photoPreview && (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions || ""}
                  onChange={(e) => handleChange("specialInstructions", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-2 sm:mx-auto w-[calc(100vw-1rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Edit {type.replace('-', ' ')} Listing</DialogTitle>
          <DialogDescription className="text-sm">
            Update the details for this listing
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editMutation.isPending}
              className="w-full sm:w-auto"
            >
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}