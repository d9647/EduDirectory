import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingTable from "@/components/listings/listing-table";
import { JOB_CATEGORIES, JOB_COMPENSATION_TYPES } from "@/lib/constants";

export default function Jobs() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    compensation: [] as string[],
    city: "",
    state: "",
    isRemote: undefined as boolean | undefined,
    minimumAge: undefined as number | undefined,
    hasTraining: undefined as boolean | undefined,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 10,
    offset: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/jobs", filters],
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

      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    },
  });

  const filterOptions = {
    categories: JOB_CATEGORIES,
    compensation: JOB_COMPENSATION_TYPES,
    remoteOptions: [
      { value: undefined, label: "All" },
      { value: true, label: "Remote" },
      { value: false, label: "In-Person" },
    ],
    trainingOptions: [
      { value: undefined, label: "All" },
      { value: true, label: "Training Provided" },
      { value: false, label: "No Training" },
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
            listingType="jobs"
          />

          <ListingTable
            data={data}
            isLoading={isLoading}
            error={error}
            listingType="jobs"
            title="Job Opportunities"
            columns={[
              { key: "companyName", label: "Company", sortable: true },
              { key: "title", label: "Title", sortable: true },
              { key: "rating", label: "Rating", sortable: true },
              { key: "thumbsUpCount", label: "👍", sortable: true },
              { key: "compensation", label: "Compensation", sortable: false },
              { key: "categories", label: "Categories", sortable: false },
              { key: "jobType", label: "Job Type", sortable: false },
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
