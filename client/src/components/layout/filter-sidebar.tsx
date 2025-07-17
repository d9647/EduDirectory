import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { US_STATES } from "@/lib/constants";
import type { FilterState, FilterOptions } from "@/lib/types";

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filterOptions: FilterOptions;
  listingType: "tutoring" | "camps" | "internships" | "jobs";
}

export default function FilterSidebar({
  filters,
  setFilters,
  filterOptions,
  listingType,
}: FilterSidebarProps) {
  const updateFilter = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value,
      offset: 0, // Reset to first page when filters change
    });
  };

  const toggleArrayFilter = (key: string, value: string | number) => {
    const currentArray = (filters as any)[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: any) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const removeArrayFilterItem = (key: string, value: string | number) => {
    const currentArray = (filters as any)[key] || [];
    const newArray = currentArray.filter((item: any) => item !== value);
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      categories: [],
      subjects: [],
      types: [],
      type: "",
      city: "",
      state: "",
      difficultyLevel: [],
      hasScholarship: undefined,
      isRemote: undefined,
      hasMentorship: undefined,
      minimumAge: undefined,
      hasTraining: undefined,
      compensation: [],
      tags: [],
      selectivityLevel: [],
      cost: [],
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 10,
      offset: 0,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories?.length) count++;
    if (filters.subjects?.length) count++;
    if (filters.types?.length) count++;
    if (filters.type) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.difficultyLevel?.length) count++;
    if (filters.hasScholarship !== undefined) count++;
    if (filters.isRemote !== undefined) count++;
    if (filters.hasMentorship !== undefined) count++;
    if (filters.minimumAge !== undefined) count++;
    if (filters.hasTraining !== undefined) count++;
    if (filters.compensation?.length) count++;
    if ((filters as any).tags?.length) count++;
    if ((filters as any).selectivityLevel?.length) count++;
    if ((filters as any).cost?.length) count++;
    return count;
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <Card className="sticky top-24">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Search & Filter
            </CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          {/* Global Search */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Search</Label>
            <div className="relative mt-2">
              <Input
                type="text"
                placeholder="Search providers, subjects..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <ScrollArea className="h-80 sm:h-96">
            <div className="space-y-4 sm:space-y-6 pr-2 sm:pr-4">
              {/* Location Filters */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  Location
                </Label>
                <div className="space-y-2">
                  <Select value={filters.state || "all"} onValueChange={(value) => updateFilter("state", value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                  />
                </div>
              </div>

              {/* Business Type Filter (Tutoring only) */}
              {listingType === "tutoring" && filterOptions.types && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Business Type
                  </Label>
                  <RadioGroup
                    value={filters.type || ""}
                    onValueChange={(value) => updateFilter("type", value)}
                  >
                    {filterOptions.types.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="text-sm text-gray-700">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Categories Filter */}
              {filterOptions.categories && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Categories
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.categories.map((category) => (
                      <div key={category.value} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={category.value}
                            checked={filters.categories?.includes(category.value)}
                            onCheckedChange={() => toggleArrayFilter("categories", category.value)}
                          />
                          <Label htmlFor={category.value} className="text-sm text-gray-700">
                            {category.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filters.categories && filters.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                          <button
                            onClick={() => removeArrayFilterItem("categories", category)}
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

              {/* Subjects Filter (Tutoring only) */}
              {listingType === "tutoring" && filterOptions.subjects && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Specific Subjects
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., Algebra, SAT Prep..."
                    className="max-w-xs px-2 py-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = e.currentTarget.value.trim();
                        if (value && !filters.subjects?.includes(value)) {
                          toggleArrayFilter("subjects", value);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                  {filters.subjects && filters.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                          <button
                            onClick={() => removeArrayFilterItem("subjects", subject)}
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

              {/* Selectivity Level Filter (Camps only) */}
              {listingType === "camps" && filterOptions.selectivityLevels && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Selectivity Level
                  </Label>
                  <div className="space-y-2">
                    {filterOptions.selectivityLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`selectivity-${level.value}`}
                          checked={filters.selectivityLevel?.includes(level.value)}
                          onCheckedChange={() => toggleArrayFilter("selectivityLevel", level.value)}
                        />
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                          <Label htmlFor={`selectivity-${level.value}`} className="text-sm text-gray-700">
                            {level.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Filter (Camps only) */}
              {listingType === "camps" && filterOptions.tags && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Program Tags
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.tags.map((tag) => (
                      <div key={tag.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.value}
                          checked={filters.tags?.includes(tag.value)}
                          onCheckedChange={() => toggleArrayFilter("tags", tag.value)}
                        />
                        <Label htmlFor={tag.value} className="text-sm text-gray-700">
                          {tag.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {filters.tags && filters.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <button
                            onClick={() => removeArrayFilterItem("tags", tag)}
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

              {/* Cost Filter (Summer Camps) */}
              {listingType === "camps" && filterOptions.cost && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Cost Range
                  </Label>
                  <div className="space-y-2">
                    {filterOptions.cost.map((costOption) => (
                      <div key={costOption.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cost-${costOption.value}`}
                          checked={(filters.cost || []).includes(costOption.value)}
                          onCheckedChange={() => toggleArrayFilter("cost", costOption.value)}
                        />
                        <Label htmlFor={`cost-${costOption.value}`} className="text-sm text-gray-700">
                          {costOption.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {filters.cost && filters.cost.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.cost.map((cost) => (
                        <Badge key={cost} variant="secondary" className="text-xs">
                          {cost}
                          <button
                            type="button"
                            onClick={() => removeArrayFilterItem("cost", cost)}
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

              {/* Types Filter (Internships) */}
              {listingType === "internships" && filterOptions.types && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Categories
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.types.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={filters.types?.includes(type.value)}
                          onCheckedChange={() => toggleArrayFilter("types", type.value)}
                        />
                        <Label htmlFor={type.value} className="text-sm text-gray-700">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compensation Filter */}
              {filterOptions.compensation && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Compensation
                  </Label>
                  <div className="space-y-2">
                    {filterOptions.compensation.map((comp) => (
                      <div key={comp.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={comp.value}
                          checked={filters.compensation?.includes(comp.value)}
                          onCheckedChange={() => toggleArrayFilter("compensation", comp.value)}
                        />
                        <Label htmlFor={comp.value} className="text-sm text-gray-700">
                          {comp.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boolean Filters */}
              {filterOptions.scholarshipOptions && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Scholarship Available
                  </Label>
                  <RadioGroup
                    value={filters.hasScholarship?.toString() || "undefined"}
                    onValueChange={(value) => 
                      updateFilter("hasScholarship", value === "undefined" ? undefined : value === "true")
                    }
                  >
                    {filterOptions.scholarshipOptions.map((option) => (
                      <div key={option.label} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value?.toString() || "undefined"} 
                          id={`scholarship-${option.label}`} 
                        />
                        <Label htmlFor={`scholarship-${option.label}`} className="text-sm text-gray-700">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {filterOptions.remoteOptions && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Work Location
                  </Label>
                  <RadioGroup
                    value={filters.isRemote?.toString() || "undefined"}
                    onValueChange={(value) => 
                      updateFilter("isRemote", value === "undefined" ? undefined : value === "true")
                    }
                  >
                    {filterOptions.remoteOptions.map((option) => (
                      <div key={option.label} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value?.toString() || "undefined"} 
                          id={`remote-${option.label}`} 
                        />
                        <Label htmlFor={`remote-${option.label}`} className="text-sm text-gray-700">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {filterOptions.mentorshipOptions && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Mentorship
                  </Label>
                  <RadioGroup
                    value={filters.hasMentorship?.toString() || "undefined"}
                    onValueChange={(value) => 
                      updateFilter("hasMentorship", value === "undefined" ? undefined : value === "true")
                    }
                  >
                    {filterOptions.mentorshipOptions.map((option) => (
                      <div key={option.label} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value?.toString() || "undefined"} 
                          id={`mentorship-${option.label}`} 
                        />
                        <Label htmlFor={`mentorship-${option.label}`} className="text-sm text-gray-700">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {filterOptions.trainingOptions && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Training
                  </Label>
                  <RadioGroup
                    value={filters.hasTraining?.toString() || "undefined"}
                    onValueChange={(value) => 
                      updateFilter("hasTraining", value === "undefined" ? undefined : value === "true")
                    }
                  >
                    {filterOptions.trainingOptions.map((option) => (
                      <div key={option.label} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value?.toString() || "undefined"} 
                          id={`training-${option.label}`} 
                        />
                        <Label htmlFor={`training-${option.label}`} className="text-sm text-gray-700">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Clear Filters */}
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full text-primary-600 hover:text-primary-700"
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
