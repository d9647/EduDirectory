import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  insertTutoringProviderSchema,
  insertSummerCampSchema,
  insertInternshipSchema,
  insertJobSchema,
} from "@shared/schema";
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
import { Calendar, X, CheckCircle } from "lucide-react";
import { z } from "zod";

interface BusinessSubmissionFormProps {
  type: "tutoring" | "camp" | "internship" | "job";
}

export default function BusinessSubmissionForm({ type }: BusinessSubmissionFormProps) {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>([]);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Get the appropriate schema based on type
  const getSchema = () => {
    switch (type) {
      case "tutoring":
        return insertTutoringProviderSchema;
      case "camp":
        return insertSummerCampSchema;
      case "internship":
        return insertInternshipSchema;
      case "job":
        return insertJobSchema;
      default:
        return insertTutoringProviderSchema;
    }
  };

  const schema = getSchema();
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      city: "",
      state: "",
      website: "",
      phone: "",
      email: "",
      address: "",
      location: "",
      companyName: "",
      title: "",
      compensation: "",
      duration: [],
      types: [],
      categories: [],
      subjects: [],
      eligibility: "",
      costRange: "",
      dates: "",
      difficultyLevel: 1,
      minimumAge: 14,
      hasScholarship: false,
      applicationAvailable: true,
      isRemote: false,
      hasMentorship: false,
      hasTraining: false,
      type: "",
      internshipDates: "",
      length: "",
      jobType: [],
      schedule: [],
      deliveryMode: [],
      streetAddress: "",
      tuition: "",
      prerequisites: "",
      applicationOpenDate: "",
      applicationDeadline: "",
      salaryRange: "",
      salaryType: "",
      openingDate: "",
      closingDate: "",
      isOngoing: false,
    } as any,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const endpoint = {
        tutoring: "/api/tutoring-providers",
        camp: "/api/summer-camps",
        internship: "/api/internships",
        job: "/api/jobs",
      }[type];

      // Prepare data with array fields and clean up empty date fields
      let submitData = {
        ...data,
        categories: selectedCategories,
        subjects: selectedSubjects,
        types: selectedTypes,
        tags: selectedTags,
        duration: selectedDuration,
        jobType: selectedJobTypes,
        schedule: selectedSchedule,
        deliveryMode: selectedDeliveryModes,
      };

      // Clean up empty date fields by converting empty strings to null
      const dateFields = ['openingDate', 'closingDate', 'applicationOpen', 'applicationDeadline', 'applicationDueDate'];
      dateFields.forEach(field => {
        if (submitData[field] === '') {
          delete submitData[field];
        }
      });

      // Handle photo upload if there's a photo file
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        
        // Upload photo first
        const photoResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          submitData.photoUrl = photoData.url;
        }
      }

      await apiRequest("POST", endpoint, submitData);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your listing has been submitted for review. You will receive a confirmation email shortly.",
      });
      form.reset();
      setSelectedCategories([]);
      setSelectedSubjects([]);
      setSelectedTypes([]);
      setSelectedTags([]);
      setSelectedDuration([]);
      setSelectedJobTypes([]);
      setSelectedSchedule([]);
      setSelectedDeliveryModes([]);
      setPhotoFile(null);
      setPhotoPreview(null);
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
        description: "Failed to submit listing. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects(prev => prev.filter(s => s !== subject));
  };

  const removeType = (typeValue: string) => {
    setSelectedTypes(prev => prev.filter(t => t !== typeValue));
  };

  const toggleDuration = (duration: string) => {
    setSelectedDuration(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const removeDuration = (duration: string) => {
    setSelectedDuration(prev => prev.filter(d => d !== duration));
  };

  // Job Type management functions
  const toggleJobType = (jobType: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(jobType)
        ? prev.filter(t => t !== jobType)
        : [...prev, jobType]
    );
  };

  const removeJobType = (jobType: string) => {
    setSelectedJobTypes(prev => prev.filter(t => t !== jobType));
  };

  // Schedule management functions
  const toggleSchedule = (schedule: string) => {
    setSelectedSchedule(prev => 
      prev.includes(schedule)
        ? prev.filter(s => s !== schedule)
        : [...prev, schedule]
    );
  };

  const removeSchedule = (schedule: string) => {
    setSelectedSchedule(prev => prev.filter(s => s !== schedule));
  };

  // Delivery Mode management functions
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
  };

  const onSubmit = (data: FormData) => {
    if (type === "tutoring" && selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }
    if (type === "camp" && selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }
    if (type === "internship" && selectedTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one type",
        variant: "destructive",
      });
      return;
    }
    if (type === "job" && selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Submission Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your listing has been submitted for review. Our team will review it and notify you once it's approved.
          </p>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Listing
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "tutoring" && "Tutoring Service Details"}
          {type === "camp" && "Summer Camp Details"}
          {type === "internship" && "Internship Details"}
          {type === "job" && "Job Opportunity Details"}
        </CardTitle>
        <CardDescription>
          Fill out the form below to list your {type === "tutoring" ? "tutoring service" : type} on our platform.
          All submissions require admin approval before going live.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={type === "tutoring" ? "name" : type === "camp" ? "name" : "companyName" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {type === "tutoring" ? "Provider Name" : 
                         type === "camp" ? "Camp Name" : "Company Name"} *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(type === "internship" || type === "job") && (
                  <FormField
                    control={form.control}
                    name="title" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {type === "internship" ? "Internship Title" : "Job Title"} *
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {type === "tutoring" && (
                  <FormField
                    control={form.control}
                    name="type" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="private_tutor">Private Tutor</SelectItem>
                            <SelectItem value="business">Business/Agency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Provide a detailed description of your service..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              
              {(type === "tutoring" || type === "camp" || type === "internship" || type === "job") && (
                <FormField
                  control={form.control}
                  name="address" as any
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main Street" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipcode" as any
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zipcode</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12345" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Delivery Mode */}
              <div className="space-y-2">
                <Label>Delivery Mode *</Label>
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
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Logo/Photo Upload (Optional)
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
                      Choose Photo
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

            {/* Categories/Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {type === "tutoring" ? "Categories & Subjects" :
                 type === "camp" ? "Categories" :
                 type === "internship" ? "Categories" : "Categories"}
              </h3>

              {/* Categories */}
              {(type === "tutoring" || type === "camp" || type === "job") && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    {type === "tutoring" ? "Subject Categories" : "Categories"} *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {(type === "tutoring" ? TUTORING_CATEGORIES : 
                      type === "camp" ? CAMP_CATEGORIES : JOB_CATEGORIES).map((category) => (
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
              )}

              {/* Types (Internships) */}
              {type === "internship" && (
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
              )}

              {/* Subjects (Tutoring) */}
              {type === "tutoring" && (
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
              )}
            </div>

            {/* Type-specific fields */}
            {type === "camp" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Camp Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="selectivityLevel" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selectivity Level</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select selectivity level" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <div>
                    <Label className="text-base font-medium text-gray-900 mb-3 block">Program Tags</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {CAMP_TAGS.map((tag) => (
                        <div key={tag.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag.value}
                            checked={selectedTags.includes(tag.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTags([...selectedTags, tag.value]);
                              } else {
                                setSelectedTags(selectedTags.filter((t) => t !== tag.value));
                              }
                            }}
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
                              onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="hasScholarship" as any
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Scholarship Available</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dates" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Camp Dates</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., June 15-29, July 6-20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 2 weeks, 1 week" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumAge" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Age</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0" 
                            max="18"
                            placeholder="e.g., 10"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicationOpen" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Open</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationDeadline" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costRange" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cost range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CAMP_COST_OPTIONS.map((cost) => (
                              <SelectItem key={cost.value} value={cost.value}>
                                {cost.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {(type === "internship" || type === "job") && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {type === "internship" ? "Internship" : "Job"} Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="compensation" as any
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compensation Type</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select compensation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(type === "internship" ? COMPENSATION_TYPES : JOB_COMPENSATION_TYPES).map((comp) => (
                              <SelectItem key={comp.value} value={comp.value}>
                                {comp.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {type === "internship" && (
                    <>
                      <FormField
                        control={form.control}
                        name="selectivityLevel" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Selectivity Level</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select selectivity level" />
                                </SelectTrigger>
                              </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="minimumAge" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Age</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number"
                                min="14"
                                max="25"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hasMentorship" as any
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Mentorship Available</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                {type === "internship" && (
                  <>
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
                      <FormField
                        control={form.control}
                        name="internshipDates" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Internship Dates</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., June 1 - August 15, 2024" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="length" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 10 weeks, 3 months" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Application Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="applicationOpen" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Open</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="applicationDeadline" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Deadline</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Prerequisites and Tuition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="prerequisites" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prerequisites</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                                placeholder="e.g., GPA requirements, coursework, skills..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tuition" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tuition</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., $500, Free, N/A" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {type === "job" && (
                  <div className="space-y-4">
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
                        <FormField
                          control={form.control}
                          name="salaryMin" as any
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="salaryMax" as any
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="salaryType" as any
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Period</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select period" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SALARY_TYPE_OPTIONS.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Opening and Closing Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="openingDate" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Date</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="closingDate" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Date</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Ongoing Option */}
                    <FormField
                      control={form.control}
                      name="isOngoing" as any
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Ongoing Position (no closing date)</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Existing Job Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hasTraining" as any
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Training Provided</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="minimumAge" as any
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Age</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number"
                                min="14"
                                max="25"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}





            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full md:w-auto"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
