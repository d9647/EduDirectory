import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit } from "lucide-react";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", `/api/admin/edit/${type}/${listing.id}`, data);
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

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div className="space-y-2">
          <Label htmlFor="name">Name/Title</Label>
          <Input
            id="name"
            value={formData.name || formData.title || ""}
            onChange={(e) => handleChange(formData.name ? "name" : "title", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
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
        </div>
      </>
    );

    switch (type) {
      case "tutoring-provider":
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type || ""}
                onChange={(e) => handleChange("type", e.target.value)}
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
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input
                id="subjects"
                value={Array.isArray(formData.subjects) ? formData.subjects.join(", ") : formData.subjects || ""}
                onChange={(e) => handleArrayChange("subjects", e.target.value)}
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
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                value={formData.photoUrl || ""}
                onChange={(e) => handleChange("photoUrl", e.target.value)}
              />
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