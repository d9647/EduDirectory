import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingTable from "@/components/listings/listing-table";
import { INTERNSHIP_TYPES, COMPENSATION_TYPES, SELECTIVITY_LEVELS } from "@/lib/constants";

export default function Internships() {
  const [filters, setFilters] = useState({
    search: "",
    types: [] as string[],
    selectivityLevel: [] as number[],
    compensation: [] as string[],
    city: "",
    state: "",
    isRemote: undefined as boolean | undefined,
    hasMentorship: undefined as boolean | undefined,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 10,
    offset: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/internships", filters],
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

      const response = await fetch(`/api/internships?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch internships");
      }
      return response.json();
    },
  });

  const filterOptions = {
    types: INTERNSHIP_TYPES,
    selectivityLevels: SELECTIVITY_LEVELS,
    compensation: COMPENSATION_TYPES,
    remoteOptions: [
      { value: undefined, label: "All" },
      { value: true, label: "Remote" },
      { value: false, label: "In-Person" },
    ],
    mentorshipOptions: [
      { value: undefined, label: "All" },
      { value: true, label: "Mentorship Available" },
      { value: false, label: "No Mentorship" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            listingType="internships"
          />

          <ListingTable
            data={data}
            isLoading={isLoading}
            error={error}
            listingType="internships"
            title="Internships"
            columns={[
              { key: "companyName", label: "Company", sortable: true },
              { key: "title", label: "Title", sortable: true },
              { key: "rating", label: "Rating", sortable: true },
              { key: "thumbsUpCount", label: "👍", sortable: true },
              { key: "compensation", label: "Compensation", sortable: false },
              { key: "types", label: "Categories", sortable: false },
              { key: "selectivityLevel", label: "Selectivity", sortable: false },
              { key: "duration", label: "Duration", sortable: false },
              { key: "location", label: "Location", sortable: true },
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
