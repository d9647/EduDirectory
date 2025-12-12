// Extended types for the application
export interface FilterState {
  search: string;
  categories?: string[];
  subjects?: string[];
  types?: string[];
  type?: string;
  city: string;
  state: string;
  tags?: string[];
  selectivityLevel?: number[];
  cost?: string[];
  hasScholarship?: boolean;
  isRemote?: boolean;
  hasMentorship?: boolean;
  minimumAge?: number;
  hasTraining?: boolean;
  compensation?: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  limit: number;
  offset: number;
}

export interface FilterOptions {
  categories?: { value: string; label: string }[];
  subjects?: { value: string; label: string; category?: string }[];
  types?: { value: string; label: string }[];
  tags?: { value: string; label: string }[];
  selectivityLevels?: { value: number; label: string; color?: string; description?: string }[];
  cost?: { value: string; label: string }[];
  scholarshipOptions?: { value: boolean | undefined; label: string }[];
  remoteOptions?: { value: boolean | undefined; label: string }[];
  mentorshipOptions?: { value: boolean | undefined; label: string }[];
  trainingOptions?: { value: boolean | undefined; label: string }[];
  compensation?: { value: string; label: string }[];
}

export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

export interface ListingData {
  providers?: any[];
  camps?: any[];
  internships?: any[];
  jobs?: any[];
  services?: any[];
  total: number;
}

export interface ReviewData {
  id: number;
  userId: string;
  title: string;
  rating: number;
  content?: string;
  createdAt: string;
  updatedAt: string;
  reviewerFirstName?: string;
  reviewerLastName?: string;
  reviewerEmail?: string;
  reviewerProfileImageUrl?: string;
}

export interface UserInteractions {
  hasThumbedUp: boolean;
  isBookmarked: boolean;
  thumbsUpCount: number;
}
