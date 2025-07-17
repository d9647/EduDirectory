import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
} from "@/lib/constants";

interface AdminEditModalProps {
  type: "tutoring-provider" | "summer-camp" | "internship" | "job";
  listing: any;
}

export default function AdminEditModal({ type, listing }: AdminEditModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(() => {
    // Format date fields for HTML date inputs
    const formatted = { ...listing };
    const dateFields = ['applicationOpen', 'applicationDeadline', 'applicationDueDate', 'openingDate', 'closingDate', 'startDate', 'endDate'];
    
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
        
        const uploadResponse = await apiRequest("POST", "/api/upload", uploadFormData);
        photoUrl = uploadResponse.url;
      }
      
      // Prepare data with checkbox selections
      const updatedData = {
        ...data,
        categories: selectedCategories,
        subjects: selectedSubjects,
        types: selectedTypes,
        tags: selectedTags,
        duration: selectedDuration,
        jobType: selectedJobTypes,
        schedule: selectedSchedule,
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryMode">Delivery Mode</Label>
            <Select value={formData.deliveryMode || ""} onValueChange={(value) => handleChange("deliveryMode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery mode" />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_MODE_OPTIONS.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input
                id="categories"
                value={Array.isArray(formData.categories) ? formData.categories.join(", ") : formData.categories || ""}
                onChange={(e) => handleArrayChange("categories", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags || ""}
                onChange={(e) => handleArrayChange("tags", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selectivityLevel">Selectivity Level (1-5)</Label>
              <Input
                id="selectivityLevel"
                type="number"
                min="1"
                max="5"
                value={formData.selectivityLevel || ""}
                onChange={(e) => handleChange("selectivityLevel", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dates">Dates</Label>
              <Input
                id="dates"
                value={formData.dates || ""}
                onChange={(e) => handleChange("dates", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                value={formData.length || ""}
                onChange={(e) => handleChange("length", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                value={formData.cost || ""}
                onChange={(e) => handleChange("cost", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryMode">Delivery Mode</Label>
              <Input
                id="deliveryMode"
                value={formData.deliveryMode || ""}
                onChange={(e) => handleChange("deliveryMode", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumAge">Minimum Age</Label>
              <Input
                id="minimumAge"
                type="number"
                value={formData.minimumAge || ""}
                onChange={(e) => handleChange("minimumAge", parseInt(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="applicationDueDate">Application Due Date</Label>
                <Input
                  id="applicationDueDate"
                  type="date"
                  value={formData.applicationDueDate || ""}
                  onChange={(e) => handleChange("applicationDueDate", e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility</Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility || ""}
                onChange={(e) => handleChange("eligibility", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hasScholarship">Has Scholarship</Label>
                <select
                  id="hasScholarship"
                  value={formData.hasScholarship === true ? "true" : formData.hasScholarship === false ? "false" : ""}
                  onChange={(e) => handleChange("hasScholarship", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationAvailable">Application Available</Label>
                <select
                  id="applicationAvailable"
                  value={formData.applicationAvailable === true ? "true" : formData.applicationAvailable === false ? "false" : ""}
                  onChange={(e) => handleChange("applicationAvailable", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </>
        );

      case "internship":
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="types">Categories (comma-separated)</Label>
              <Input
                id="types"
                value={Array.isArray(formData.types) ? formData.types.join(", ") : formData.types || ""}
                onChange={(e) => handleArrayChange("types", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compensation">Compensation</Label>
              <Input
                id="compensation"
                value={formData.compensation || ""}
                onChange={(e) => handleChange("compensation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (comma-separated)</Label>
              <Input
                id="duration"
                value={Array.isArray(formData.duration) ? formData.duration.join(", ") : formData.duration || ""}
                onChange={(e) => handleArrayChange("duration", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internshipDates">Internship Dates</Label>
              <Input
                id="internshipDates"
                value={formData.internshipDates || ""}
                onChange={(e) => handleChange("internshipDates", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                value={formData.length || ""}
                onChange={(e) => handleChange("length", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryMode">Delivery Mode</Label>
              <Input
                id="deliveryMode"
                value={formData.deliveryMode || ""}
                onChange={(e) => handleChange("deliveryMode", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumAge">Minimum Age</Label>
              <Input
                id="minimumAge"
                type="number"
                value={formData.minimumAge || ""}
                onChange={(e) => handleChange("minimumAge", parseInt(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites || ""}
                onChange={(e) => handleChange("prerequisites", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuition">Tuition</Label>
              <Input
                id="tuition"
                value={formData.tuition || ""}
                onChange={(e) => handleChange("tuition", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility</Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility || ""}
                onChange={(e) => handleChange("eligibility", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isRemote">Is Remote</Label>
                <select
                  id="isRemote"
                  value={formData.isRemote === true ? "true" : formData.isRemote === false ? "false" : ""}
                  onChange={(e) => handleChange("isRemote", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hasMentorship">Has Mentorship</Label>
                <select
                  id="hasMentorship"
                  value={formData.hasMentorship === true ? "true" : formData.hasMentorship === false ? "false" : ""}
                  onChange={(e) => handleChange("hasMentorship", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </>
        );

      case "job":
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input
                id="categories"
                value={Array.isArray(formData.categories) ? formData.categories.join(", ") : formData.categories || ""}
                onChange={(e) => handleArrayChange("categories", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compensation">Compensation</Label>
              <Input
                id="compensation"
                value={formData.compensation || ""}
                onChange={(e) => handleChange("compensation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compensationRange">Compensation Range</Label>
              <Input
                id="compensationRange"
                value={formData.compensationRange || ""}
                onChange={(e) => handleChange("compensationRange", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  step="0.01"
                  value={formData.salaryMin || ""}
                  onChange={(e) => handleChange("salaryMin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  step="0.01"
                  value={formData.salaryMax || ""}
                  onChange={(e) => handleChange("salaryMax", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryType">Salary Type</Label>
                <Input
                  id="salaryType"
                  value={formData.salaryType || ""}
                  onChange={(e) => handleChange("salaryType", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type (comma-separated)</Label>
              <Input
                id="jobType"
                value={Array.isArray(formData.jobType) ? formData.jobType.join(", ") : formData.jobType || ""}
                onChange={(e) => handleArrayChange("jobType", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule (comma-separated)</Label>
              <Input
                id="schedule"
                value={Array.isArray(formData.schedule) ? formData.schedule.join(", ") : formData.schedule || ""}
                onChange={(e) => handleArrayChange("schedule", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workSchedule">Work Schedule</Label>
              <Input
                id="workSchedule"
                value={formData.workSchedule || ""}
                onChange={(e) => handleChange("workSchedule", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumAge">Minimum Age</Label>
              <Input
                id="minimumAge"
                type="number"
                value={formData.minimumAge || ""}
                onChange={(e) => handleChange("minimumAge", parseInt(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="applicationLink">Application Link</Label>
              <Input
                id="applicationLink"
                value={formData.applicationLink || ""}
                onChange={(e) => handleChange("applicationLink", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility</Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility || ""}
                onChange={(e) => handleChange("eligibility", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isRemote">Is Remote</Label>
                <select
                  id="isRemote"
                  value={formData.isRemote === true ? "true" : formData.isRemote === false ? "false" : ""}
                  onChange={(e) => handleChange("isRemote", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hasTraining">Has Training</Label>
                <select
                  id="hasTraining"
                  value={formData.hasTraining === true ? "true" : formData.hasTraining === false ? "false" : ""}
                  onChange={(e) => handleChange("hasTraining", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isOngoing">Is Ongoing</Label>
                <select
                  id="isOngoing"
                  value={formData.isOngoing === true ? "true" : formData.isOngoing === false ? "false" : ""}
                  onChange={(e) => handleChange("isOngoing", e.target.value === "true" ? true : e.target.value === "false" ? false : undefined)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
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
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {type.replace('-', ' ')} Listing</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}