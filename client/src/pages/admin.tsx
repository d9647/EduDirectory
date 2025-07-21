import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  Search,
  Edit,
  Eye,
  EyeOff,
  ThumbsUp,
  Flag,
  User,
  Shield,
  AlertTriangle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  School,
} from "lucide-react";
import AdminEditModal from "@/components/admin/admin-edit-modal";
import SimpleHeader from "@/components/layout/simple-header";
import Footer from "@/components/layout/footer";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportData {
  tutoringProviders: any[];
  summerCamps: any[];
  internships: any[];
  jobs: any[];
}

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need admin privileges to access this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const { data: pendingApprovals, isLoading, refetch: refetchPendingApprovals } = useQuery({
    queryKey: ["/api/admin/pending-approvals"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: reports, refetch: refetchReports } = useQuery({
    queryKey: ["/api/admin/reports"],
    refetchOnMount: true,
  });

  const { data: liveListings } = useQuery({
    queryKey: ["/api/admin/live-listings"],
    enabled: false, // Don't load automatically
  });

  // Search states - moved before queries
  const [searchQueries, setSearchQueries] = useState({
    'tutoring-providers': '',
    'summer-camps': '',
    'internships': '',
    'jobs': ''
  });

  // Search results
  const [searchResults, setSearchResults] = useState({
    'tutoring-providers': [],
    'summer-camps': [],
    'internships': [],
    'jobs': []
  });

  // User management pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [debouncedUserSearch, setDebouncedUserSearch] = useState('');

  // User management queries with pagination and search
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users", currentPage, usersPerPage, debouncedUserSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        ...(debouncedUserSearch && { search: debouncedUserSearch })
      });
      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
    refetchOnMount: true,
  });

  // Loading states
  const [searchLoading, setSearchLoading] = useState({
    'tutoring-providers': false,
    'summer-camps': false,
    'internships': false,
    'jobs': false
  });

  // Import states
  const [importLoading, setImportLoading] = useState({
    'tutoring-providers': false,
    'summer-camps': false,
    'internships': false,
    'jobs': false
  });

  const [selectedFiles, setSelectedFiles] = useState({
    'tutoring-providers': null as File | null,
    'summer-camps': null as File | null,
    'internships': null as File | null,
    'jobs': null as File | null
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportData>({
    tutoringProviders: [],
    summerCamps: [],
    internships: [],
    jobs: [],
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importType, setImportType] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
    details?: any[];
  } | null>(null);

  // Search function
  const searchListings = async (type: string, query: string) => {
    if (!query.trim()) {
      setSearchResults(prev => ({ ...prev, [type]: [] }));
      return;
    }

    setSearchLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      const response = await fetch(`/api/admin/search-listings/${type}?query=${encodeURIComponent(query)}`);
      const results = await response.json();
      setSearchResults(prev => ({ ...prev, [type]: results }));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(prev => ({ ...prev, [type]: [] }));
    } finally {
      setSearchLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Debounced search for listings
  const debounceSearch = (type: string, query: string) => {
    setSearchQueries(prev => ({ ...prev, [type]: query }));
    setTimeout(() => searchListings(type, query), 300);
  };

  // Debounced search for users
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserSearch(userSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedUserSearch]);

  // Deactivation mutations
  const deactivateMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      await apiRequest("POST", `/api/admin/deactivate/${type}/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Listing deactivated successfully",
      });
      // Refresh current searches
      Object.entries(searchQueries).forEach(([type, query]) => {
        if (query) searchListings(type, query);
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to deactivate listing",
        variant: "destructive",
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      await apiRequest("POST", `/api/admin/activate/${type}/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Listing activated successfully",
      });
      // Refresh current searches
      Object.entries(searchQueries).forEach(([type, query]) => {
        if (query) searchListings(type, query);
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to activate listing",
        variant: "destructive",
      });
    },
  });

  // User role update mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "user" }) => {
      await apiRequest("PUT", `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      const response = await fetch(`/api/admin/approve/${type}/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to approve listing");
      }
      return response.json();
    },
    onSuccess: () => {
      refetchPendingApprovals();
      toast({
        title: "Success",
        description: "Listing approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve listing",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      const response = await fetch(`/api/admin/delete/${type}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }
      return response.json();
    },
    onSuccess: () => {
      refetchPendingApprovals();
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    },
  });

  const resolveReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      await apiRequest("POST", `/api/admin/reports/${reportId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      toast({
        title: "Success",
        description: "Report resolved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to resolve report",
        variant: "destructive",
      });
    },
  });

  // Import function
  const handleImport = async () => {
    // Validate importType exists and is valid
    if (!importType) {
      setImportStatus({
        success: false,
        message: "Please select an import type"
      });
      return;
    }

    // Validate importData exists for the selected type
    const dataForType = importData[importType as keyof ImportData];
    if (!dataForType || !Array.isArray(dataForType) || dataForType.length === 0) {
      setImportStatus({
        success: false,
        message: "Please select a file and ensure it contains data"
      });
      return;
    }

    // Validate selectedFile exists
    if (!selectedFile) {
      setImportStatus({
        success: false,
        message: "Please select a file to import"
      });
      return;
    }

    // Convert camelCase to kebab-case for API endpoint
    const endpointType = importType.replace(/([A-Z])/g, '-$1').toLowerCase();

    setIsImporting(true);
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      const response = await fetch(`/api/admin/import/${endpointType}`, {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        setImportStatus({
          success: result.errors.length === 0,
          message: result.message || `Successfully imported ${dataForType.length} ${importType}`,
          details: result.errors.length > 0 ? result.errors : undefined
        });
        setImportData(prev => ({
          ...prev,
          [importType]: []
        }));
        setPreviewData([]);
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Import failed");
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: error.message || "Import failed. Please check your data format."
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = (type: string) => {
    const link = document.createElement("a");
    link.href = `/csv-templates/${type}-template.csv`;
    link.download = `${type}-template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (file: File, type: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      console.log("Raw CSV content:", text); // Debug: Show raw CSV content
      const lines = text.split("\n").filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        console.error("CSV must have at least a header row and one data row");
        return;
      }

      const headers = parseCSVRow(lines[0]);
      const data = lines.slice(1).map(line => {
        const values = parseCSVRow(line);
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        return row;
      });
      
      console.log(`Frontend parsed ${data.length} rows from CSV`); // Debug log
      console.log("First few rows:", data.slice(0, 3)); // Debug log
      
      setPreviewData(data.slice(0, 5)); // Show first 5 rows
      setImportData(prev => ({
        ...prev,
        [type]: data
      }));
    };
    reader.readAsText(file);
  };

  // Helper function to parse CSV row with proper quote handling
  const parseCSVRow = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage pending approvals and review reports from the community.
          </p>
        </div>

        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1 text-xs sm:text-sm">
            <TabsTrigger value="approvals" className="px-2 sm:px-3">
              <span className="hidden sm:inline">Pending </span>Approvals
              {pendingApprovals && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {(pendingApprovals.tutoringProviders?.length || 0) +
                   (pendingApprovals.summerCamps?.length || 0) +
                   (pendingApprovals.internships?.length || 0) +
                   (pendingApprovals.jobs?.length || 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reports" className="px-2 sm:px-3">
              Reports
              {reports && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {reports.filter((r: any) => !r.isResolved).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="edit-listings" className="px-2 sm:px-3">
              <span className="hidden sm:inline">Edit </span>Listings
            </TabsTrigger>
            <TabsTrigger value="import" className="px-2 sm:px-3">
              Import
            </TabsTrigger>
            <TabsTrigger value="users" className="px-2 sm:px-3">
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Pending Approvals</h2>
                <p className="text-xs sm:text-sm text-gray-600">Review and approve new business submissions</p>
              </div>
              <Button
                onClick={() => refetchPendingApprovals()}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="space-y-6">
              {/* Tutoring Providers */}
              {pendingApprovals?.tutoringProviders?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tutoring Providers</CardTitle>
                    <CardDescription>
                      {pendingApprovals.tutoringProviders.length} pending approval(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {pendingApprovals.tutoringProviders.map((provider: any) => (
                        <div key={provider.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">{provider.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{provider.type} • {provider.city}, {provider.state}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{provider.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                            <AdminEditModal type="tutoring-provider" listing={provider} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "tutoring-provider", id: provider.id })}
                              disabled={approveMutation.isPending}
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => deleteMutation.mutate({ type: "tutoring-provider", id: provider.id })}
                              disabled={deleteMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Summer Camps */}
              {pendingApprovals?.summerCamps?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Summer Camps</CardTitle>
                    <CardDescription>
                      {pendingApprovals.summerCamps.length} pending approval(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {pendingApprovals.summerCamps.map((camp: any) => (
                        <div key={camp.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">{camp.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{camp.city}, {camp.state}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{camp.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <AdminEditModal type="summer-camp" listing={camp} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "summer-camp", id: camp.id })}
                              disabled={approveMutation.isPending}
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => deleteMutation.mutate({ type: "summer-camp", id: camp.id })}
                              disabled={deleteMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Internships */}
              {pendingApprovals?.internships?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Internships</CardTitle>
                    <CardDescription>
                      {pendingApprovals.internships.length} pending approval(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {pendingApprovals.internships.map((internship: any) => (
                        <div key={internship.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">{internship.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{internship.companyName} • {internship.city}, {internship.state}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{internship.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <AdminEditModal type="internship" listing={internship} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "internship", id: internship.id })}
                              disabled={approveMutation.isPending}
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => deleteMutation.mutate({ type: "internship", id: internship.id })}
                              disabled={deleteMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Jobs */}
              {pendingApprovals?.jobs?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Job Opportunities</CardTitle>
                    <CardDescription>
                      {pendingApprovals.jobs.length} pending approval(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {pendingApprovals.jobs.map((job: any) => (
                        <div key={job.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">{job.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{job.companyName} • {job.city}, {job.state}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{job.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <AdminEditModal type="job" listing={job} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "job", id: job.id })}
                              disabled={approveMutation.isPending}
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => deleteMutation.mutate({ type: "job", id: job.id })}
                              disabled={deleteMutation.isPending}
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!pendingApprovals || (
                (pendingApprovals.tutoringProviders?.length || 0) +
                (pendingApprovals.summerCamps?.length || 0) +
                (pendingApprovals.internships?.length || 0) +
                (pendingApprovals.jobs?.length || 0)
              ) === 0) && (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending approvals at this time.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="edit-listings" className="mt-6">
            <div className="space-y-6">
              {/* Search-based Live Tutoring Providers */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Tutoring Providers</CardTitle>
                  <CardDescription>
                    Search for approved tutoring providers to edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tutoring providers by name, description, or location..."
                        value={searchQueries['tutoring-providers']}
                        onChange={(e) => debounceSearch('tutoring-providers', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchLoading['tutoring-providers'] && (
                      <div className="text-center py-4">Searching...</div>
                    )}
                    {searchResults['tutoring-providers'].length > 0 && (
                      <div className="space-y-2">
                        {searchResults['tutoring-providers'].map((provider: any) => (
                          <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{provider.name}</h3>
                                {!provider.isActive && (
                                  <Badge variant="secondary">Deactivated</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{provider.type} • {provider.city}, {provider.state}</p>
                              <p className="text-sm text-gray-500 mt-1">{provider.description?.substring(0, 100)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <AdminEditModal type="tutoring-provider" listing={provider} />
                              {provider.isActive ? (
                                <Button
                                  onClick={() => deactivateMutation.mutate({ type: "tutoring-provider", id: provider.id })}
                                  disabled={deactivateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => activateMutation.mutate({ type: "tutoring-provider", id: provider.id })}
                                  disabled={activateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteMutation.mutate({ type: "tutoring-provider", id: provider.id })}
                                disabled={deleteMutation.isPending}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Search-based Live Summer Camps */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Summer Camps</CardTitle>
                  <CardDescription>
                    Search for approved summer camps to edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search summer camps by name, description, or location..."
                        value={searchQueries['summer-camps']}
                        onChange={(e) => debounceSearch('summer-camps', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchLoading['summer-camps'] && (
                      <div className="text-center py-4">Searching...</div>
                    )}
                    {searchResults['summer-camps'].length > 0 && (
                      <div className="space-y-2">
                        {searchResults['summer-camps'].map((camp: any) => (
                          <div key={camp.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{camp.name}</h3>
                                {!camp.isActive && (
                                  <Badge variant="secondary">Deactivated</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{camp.city}, {camp.state}</p>
                              <p className="text-sm text-gray-500 mt-1">{camp.description?.substring(0, 100)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <AdminEditModal type="summer-camp" listing={camp} />
                              {camp.isActive ? (
                                <Button
                                  onClick={() => deactivateMutation.mutate({ type: "summer-camp", id: camp.id })}
                                  disabled={deactivateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => activateMutation.mutate({ type: "summer-camp", id: camp.id })}
                                  disabled={activateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteMutation.mutate({ type: "summer-camp", id: camp.id })}
                                disabled={deleteMutation.isPending}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Search-based Live Internships */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Internships</CardTitle>
                  <CardDescription>
                    Search for approved internships to edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search internships by title, company, or location..."
                        value={searchQueries['internships']}
                        onChange={(e) => debounceSearch('internships', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchLoading['internships'] && (
                      <div className="text-center py-4">Searching...</div>
                    )}
                    {searchResults['internships'].length > 0 && (
                      <div className="space-y-2">
                        {searchResults['internships'].map((internship: any) => (
                          <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{internship.title}</h3>
                                {!internship.isActive && (
                                  <Badge variant="secondary">Deactivated</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{internship.companyName} • {internship.city}, {internship.state}</p>
                              <p className="text-sm text-gray-500 mt-1">{internship.description?.substring(0, 100)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <AdminEditModal type="internship" listing={internship} />
                              {internship.isActive ? (
                                <Button
                                  onClick={() => deactivateMutation.mutate({ type: "internship", id: internship.id })}
                                  disabled={deactivateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => activateMutation.mutate({ type: "internship", id: internship.id })}
                                  disabled={activateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteMutation.mutate({ type: "internship", id: internship.id })}
                                disabled={deleteMutation.isPending}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Search-based Live Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Job Opportunities</CardTitle>
                  <CardDescription>
                    Search for approved job opportunities to edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search jobs by title, company, or location..."
                        value={searchQueries['jobs']}
                        onChange={(e) => debounceSearch('jobs', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {searchLoading['jobs'] && (
                      <div className="text-center py-4">Searching...</div>
                    )}
                    {searchResults['jobs'].length > 0 && (
                      <div className="space-y-2">
                        {searchResults['jobs'].map((job: any) => (
                          <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{job.title}</h3>
                                {!job.isActive && (
                                  <Badge variant="secondary">Deactivated</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{job.companyName} • {job.city}, {job.state}</p>
                              <p className="text-sm text-gray-500 mt-1">{job.description?.substring(0, 100)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <AdminEditModal type="job" listing={job} />
                              {job.isActive ? (
                                <Button
                                  onClick={() => deactivateMutation.mutate({ type: "job", id: job.id })}
                                  disabled={deactivateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => activateMutation.mutate({ type: "job", id: job.id })}
                                  disabled={activateMutation.isPending}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteMutation.mutate({ type: "job", id: job.id })}
                                disabled={deleteMutation.isPending}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Reports</CardTitle>
                <CardDescription>
                  Review and resolve reports submitted by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report: any) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <h3 className="font-medium">{report.reason}</h3>
                            {report.isResolved && (
                              <Badge variant="secondary">Resolved</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {report.reportType}: {report.itemType} #{report.itemId}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                        </div>
                        {!report.isResolved && (
                          <Button
                            onClick={() => resolveReportMutation.mutate(report.id)}
                            disabled={resolveReportMutation.isPending}
                            variant="outline"
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reports</h3>
                    <p className="text-gray-600">No reports have been submitted yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Bulk Data Import</h2>
                <p className="text-gray-600 mb-4">
                  Import data from CSV files. Make sure your CSV files follow the correct format.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => window.open('/api/template', '_blank')}
                    variant="outline"
                  >
                    Download CSV Template
                  </Button>
                  <Button
                    onClick={() => window.open('/api/import-guide', '_blank')}
                    variant="outline"
                  >
                    View Import Guide
                  </Button>
                </div>
              </div>

              {/* Tutoring Providers Import */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Tutoring Providers</CardTitle>
                  <CardDescription>
                    Upload a CSV file containing tutoring provider data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tutoring-providers-file">CSV File</Label>
                      <Input
                        id="tutoring-providers-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setImportType("tutoringProviders");
                            parseCSV(file, "tutoringProviders");
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleImport}
                      disabled={!selectedFile || importLoading['tutoring-providers']}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importLoading['tutoring-providers'] ? 'Importing...' : 'Import Tutoring Providers'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summer Camps Import */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Summer Camps</CardTitle>
                  <CardDescription>
                    Upload a CSV file containing summer camp data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="summer-camps-file">CSV File</Label>
                      <Input
                        id="summer-camps-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setImportType("summerCamps");
                            parseCSV(file, "summerCamps");
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleImport}
                      disabled={!selectedFile || importLoading['summer-camps']}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importLoading['summer-camps'] ? 'Importing...' : 'Import Summer Camps'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Internships Import */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Internships</CardTitle>
                  <CardDescription>
                    Upload a CSV file containing internship data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="internships-file">CSV File</Label>
                      <Input
                        id="internships-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setImportType("internships");
                            parseCSV(file, "internships");
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleImport}
                      disabled={!selectedFile || importLoading['internships']}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importLoading['internships'] ? 'Importing...' : 'Import Internships'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Jobs Import */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Job Opportunities</CardTitle>
                  <CardDescription>
                    Upload a CSV file containing job opportunity data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="jobs-file">CSV File</Label>
                      <Input
                        id="jobs-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setImportType("jobs");
                            parseCSV(file, "jobs");
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleImport}
                      disabled={!selectedFile || importLoading['jobs']}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importLoading['jobs'] ? 'Importing...' : 'Import Job Opportunities'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* CSV Import Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Preview</CardTitle>
                  <CardDescription>
                    Preview the data you are about to import.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>Preview (First 5 rows)</Label>
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 text-sm">
                      <table className="w-full">
                        <thead>
                          <tr>
                            {Object.keys(previewData[0] || {}).map(key => (
                              <th key={key} className="text-left p-1">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value: any, i) => (
                                <td key={i} className="p-1 text-xs">{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Import Status */}
              {importStatus && (
                <Alert className={importStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {importStatus.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                                      <AlertDescription className={importStatus.success ? "text-green-800" : "text-red-800"}>
                      {importStatus.message}
                      {importStatus.details && importStatus.details.length > 0 && (
                        <>
                          <br />
                          <strong>Errors:</strong>
                          <ul className="mt-2 list-disc list-inside">
                            {importStatus.details.map((error: string, index: number) => (
                              <li key={index} className="text-sm">{error}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search users by name, email, location, or school..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {usersData?.total ? `${usersData.total} users` : ''}
                    </div>
                  </div>
                  {usersLoading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : usersData?.users && usersData.users.length > 0 ? (
                    <div className="space-y-2">
                      {usersData.users.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.profileImageUrl} alt={user.firstName || user.email} />
                              <AvatarFallback>
                                {user.firstName && user.lastName 
                                  ? `${user.firstName[0]}${user.lastName[0]}`
                                  : user.firstName 
                                    ? user.firstName[0]
                                    : user.email[0].toUpperCase()
                                }
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  {user.firstName || user.lastName 
                                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                    : user.email
                                  }
                                </h3>
                                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                  {user.role}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              {user.location && (
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {user.location}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={user.profileImageUrl} alt={user.firstName || user.email} />
                                      <AvatarFallback className="text-lg">
                                        {user.firstName && user.lastName 
                                          ? `${user.firstName[0]}${user.lastName[0]}`
                                          : user.firstName 
                                            ? user.firstName[0]
                                            : user.email[0].toUpperCase()
                                        }
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h2 className="text-xl font-semibold">
                                        {user.firstName || user.lastName 
                                          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                          : user.email
                                        }
                                      </h2>
                                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                        {user.role}
                                      </Badge>
                                    </div>
                                  </DialogTitle>
                                  <DialogDescription>
                                    User profile and account information
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                  <div className="space-y-4">
                                    <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Contact Information</h3>
                                    
                                    <div className="flex items-center gap-3">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                      </div>
                                    </div>
                                    
                                    {user.phone && (
                                      <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium">Phone</p>
                                          <p className="text-sm text-gray-600">{user.phone}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {user.location && (
                                      <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium">Location</p>
                                          <p className="text-sm text-gray-600">{user.location}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {user.address && (
                                      <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium">Address</p>
                                          <p className="text-sm text-gray-600">{user.address}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Education Information</h3>
                                    
                                    {user.schoolName && (
                                      <div className="flex items-center gap-3">
                                        <School className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium">School</p>
                                          <p className="text-sm text-gray-600">{user.schoolName}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {user.grade && (
                                      <div className="flex items-center gap-3">
                                        <GraduationCap className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium">Grade</p>
                                          <p className="text-sm text-gray-600">{user.grade}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <div>
                                        <p className="text-sm font-medium">Member Since</p>
                                        <p className="text-sm text-gray-600">
                                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <div>
                                        <p className="text-sm font-medium">User ID</p>
                                        <p className="text-sm text-gray-600 font-mono">{user.id}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {user.role === "admin" ? (
                              <Button
                                onClick={() => updateRoleMutation.mutate({ userId: user.id, role: "user" })}
                                disabled={updateRoleMutation.isPending}
                                variant="outline"
                                size="sm"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Remove Admin
                              </Button>
                            ) : (
                              <Button
                                onClick={() => updateRoleMutation.mutate({ userId: user.id, role: "admin" })}
                                disabled={updateRoleMutation.isPending}
                                variant="outline"
                                size="sm"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Make Admin
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {userSearchQuery ? 'No users found matching your search' : 'No users found'}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {usersData && usersData.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing {usersData.users.length} of {usersData.total} users
                        (Page {usersData.currentPage} of {usersData.totalPages})
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                        >
                          First
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600 px-3">
                          Page {currentPage} of {usersData.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === usersData.totalPages}
                        >
                          Next
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(usersData.totalPages)}
                          disabled={currentPage === usersData.totalPages}
                        >
                          Last
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
