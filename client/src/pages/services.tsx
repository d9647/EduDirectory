import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FilterSidebar from "@/components/layout/filter-sidebar";
import ListingTable from "@/components/listings/listing-table";
import { SERVICE_CATEGORIES, SERVICE_TAGS, SERVICE_BUSINESS_TYPES } from "@/lib/constants";

export default function Services() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    tags: [] as string[],
    type: "",
    city: "",
    state: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 5,
    offset: 0,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/services", filters],
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

      const response = await fetch(`/api/services?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      return response.json();
    },
  });

  const filterOptions = {
    categories: SERVICE_CATEGORIES,
    tags: SERVICE_TAGS,
    types: SERVICE_BUSINESS_TYPES,
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
            listingType="services"
          />

          <ListingTable
            data={data}
            isLoading={isLoading}
            error={error}
            listingType="services"
            title="Services"
            columns={[
              { key: "name", label: "Provider Name", sortable: true },
              { key: "rating", label: "Rating", sortable: true },
              { key: "thumbsUpCount", label: "👍", sortable: true },
              { key: "viewCount", label: "Views", sortable: true },
              { key: "categories", label: "Categories", sortable: false },
              { key: "tags", label: "Tags", sortable: false },
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
