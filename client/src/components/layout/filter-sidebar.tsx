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
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset to first page when filters change
    }));
  };

  const toggleArrayFilter = (key: string, value: string | number) => {
    setFilters(prev => {
      const currentArray = (prev as any)[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: any) => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [key]: newArray,
        offset: 0,
      };
    });
  };

  const removeArrayFilterItem = (key: string, value: string | number) => {
    setFilters(prev => {
      const currentArray = (prev as any)[key] || [];
      const newArray = currentArray.filter((item: any) => item !== value);
      return {
        ...prev,
        [key]: newArray,
        offset: 0,
      };
    });
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

  // Create a FilterContent component for reuse
  const FilterContent = () => (
    <ScrollArea className="h-full max-h-[calc(100vh-8rem)]">
      <div className="space-y-4 p-1">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search listings and tags..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
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
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
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
    </ScrollArea>
  );

  return (
    <aside className="w-80 flex-shrink-0">
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
        <CardContent className="pt-0">
          <FilterContent />
        </CardContent>
      </Card>
    </aside>
  );
}
