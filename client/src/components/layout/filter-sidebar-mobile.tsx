import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { US_STATES } from "@/lib/constants";
import type { FilterState, FilterOptions } from "@/lib/types";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

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

  // Simplified filter content for mobile
  const MobileFilterContent = () => (
    <div className="space-y-4">
      {/* Quick Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="search"
            placeholder="Search listings..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City
          </Label>
          <Input
            id="city"
            placeholder="City"
            value={filters.city}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium">
            State
          </Label>
          <Select value={filters.state || "all"} onValueChange={(value) => updateFilter("state", value === "all" ? "" : value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="State" />
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
        </div>
      </div>

      {/* Business Type (Tutoring only) */}
      {listingType === "tutoring" && filterOptions.types && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Type</Label>
          <Select value={filters.type || "all"} onValueChange={(value) => updateFilter("type", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filterOptions.types.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="w-full text-sm"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All ({getActiveFiltersCount()})
        </Button>
      )}
    </div>
  );

  // Desktop filter content with all filters
  const DesktopFilterContent = () => (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-6 pr-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Search listings..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
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
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
            />
          </div>
        </div>

        {/* Business Type (Tutoring only) */}
        {listingType === "tutoring" && filterOptions.types && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Business Type</Label>
            <RadioGroup
              value={filters.type || "all"}
              onValueChange={(value) => updateFilter("type", value === "all" ? "" : value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-types" />
                <Label htmlFor="all-types" className="text-sm">
                  All Types
                </Label>
              </div>
              {filterOptions.types.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Categories */}
        {filterOptions.categories && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filterOptions.categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.value}
                    checked={filters.categories?.includes(category.value)}
                    onCheckedChange={() => toggleArrayFilter("categories", category.value)}
                  />
                  <Label htmlFor={category.value} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All ({getActiveFiltersCount()})
          </Button>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center gap-3">
          {/* Mobile Quick Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Quick search..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          {/* Mobile Filter Drawer */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex-shrink-0 h-10 px-3">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left">Search & Filter</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <MobileFilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <Card className="sticky top-24">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Search & Filter
              </CardTitle>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <DesktopFilterContent />
          </CardContent>
        </Card>
      </aside>
    </>
  );
}