import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingTable from "@/components/listings/listing-table";
import { TUTORING_CATEGORIES, TUTORING_SUBJECTS } from "@/lib/constants";

export default function TutoringProviders() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    subjects: [] as string[],
    type: "",
    city: "",
    state: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 10,
    offset: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/tutoring-providers", filters],
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
      
      const response = await fetch(`/api/tutoring-providers?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tutoring providers");
      }
      return response.json();
    },
  });

  const filterOptions = {
    categories: TUTORING_CATEGORIES,
    subjects: TUTORING_SUBJECTS,
    types: [
      { value: "", label: "All Types" },
      { value: "private_tutor", label: "Private Tutors" },
      { value: "business", label: "Business/Agencies" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            listingType="tutoring"
          />
          
          <ListingTable
            data={data}
            isLoading={isLoading}
            error={error}
            listingType="tutoring"
            title="Tutoring Providers"
            columns={[
              { key: "name", label: "Provider Name", sortable: true },
              { key: "rating", label: "Rating", sortable: true },
              { key: "thumbsUpCount", label: "👍", sortable: true },
              { key: "categories", label: "Categories", sortable: false },
              { key: "subjects", label: "Subjects", sortable: false },
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
