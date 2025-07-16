import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingTable from "@/components/listings/listing-table";
import { CAMP_CATEGORIES, CAMP_TAGS, CAMP_COST_OPTIONS, SELECTIVITY_LEVELS } from "@/lib/constants";

export default function SummerCamps() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    tags: [] as string[],
    selectivityLevel: [] as number[],
    cost: [] as string[],
    city: "",
    state: "",
    hasScholarship: undefined as boolean | undefined,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 10,
    offset: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/summer-camps", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.append(key, value.join(","));
            }
          } else {
            params.append(key, String(value));
          }
        }
      });
      
      const response = await fetch(`/api/summer-camps?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch summer camps");
      }
      return response.json();
    },
  });

  const filterOptions = {
    categories: CAMP_CATEGORIES,
    tags: CAMP_TAGS,
    selectivityLevels: SELECTIVITY_LEVELS,
    cost: CAMP_COST_OPTIONS,
    scholarshipOptions: [
      { value: undefined, label: "All" },
      { value: true, label: "Scholarship Available" },
      { value: false, label: "No Scholarship" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            listingType="camps"
          />
          
          <ListingTable
            data={data}
            isLoading={isLoading}
            error={error}
            listingType="camps"
            title="Summer Camps"
            columns={[
              { key: "name", label: "Camp Name", sortable: true },
              { key: "selectivityLevel", label: "Selectivity", sortable: true },
              { key: "costRange", label: "Cost Range", sortable: true },
              { key: "rating", label: "Rating", sortable: true },
              { key: "thumbsUpCount", label: "👍", sortable: true },
              { key: "categories", label: "Categories", sortable: false },
              { key: "tags", label: "Tags", sortable: false },
              { key: "location", label: "Location", sortable: true },
              { key: "applicationOpen", label: "Application Open", sortable: true },
              { key: "applicationDeadline", label: "Application Deadline", sortable: true },
              { key: "minimumAge", label: "Min Age", sortable: true },
              { key: "actions", label: "Actions", sortable: false },
            ]}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>
    </div>
  );
}
