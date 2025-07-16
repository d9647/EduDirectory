import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, AlertTriangle, Search, Eye, EyeOff, Upload } from "lucide-react";
import AdminEditModal from "@/components/admin/admin-edit-modal";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingApprovals, isLoading } = useQuery({
    queryKey: ["/api/admin/pending-approvals"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/admin/reports"],
  });

  const { data: liveListings } = useQuery({
    queryKey: ["/api/admin/live-listings"],
    enabled: false, // Don't load automatically
  });

  // Search states
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

  // Debounced search
  const debounceSearch = (type: string, query: string) => {
    setSearchQueries(prev => ({ ...prev, [type]: query }));
    setTimeout(() => searchListings(type, query), 300);
  };

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

  const approveMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      await apiRequest("POST", `/api/admin/approve/${type}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-approvals"] });
      toast({
        title: "Success",
        description: "Listing approved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve listing",
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
  const handleImport = async (type: string) => {
    const file = selectedFiles[type as keyof typeof selectedFiles];
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setImportLoading(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch(`/api/admin/import/${type}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Import Completed",
          description: result.message,
        });
        
        // Clear selected file
        setSelectedFiles(prev => ({ ...prev, [type]: null }));
        
        // Reset file input
        const fileInput = document.getElementById(`${type}-file`) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh pending approvals
        queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-approvals"] });
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setImportLoading(prev => ({ ...prev, [type]: false }));
    }
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage pending approvals and review reports from the community.
          </p>
        </div>

        <Tabs defaultValue="approvals" className="w-full">
          <TabsList>
            <TabsTrigger value="approvals">
              Pending Approvals
              {pendingApprovals && (
                <Badge variant="secondary" className="ml-2">
                  {(pendingApprovals.tutoringProviders?.length || 0) +
                   (pendingApprovals.summerCamps?.length || 0) +
                   (pendingApprovals.internships?.length || 0) +
                   (pendingApprovals.jobs?.length || 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reports">
              Reports
              {reports && (
                <Badge variant="secondary" className="ml-2">
                  {reports.filter((r: any) => !r.isResolved).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="edit-listings">
              Edit Live Listings
            </TabsTrigger>
            <TabsTrigger value="import">
              Import Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="mt-6">
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
                    <div className="space-y-4">
                      {pendingApprovals.tutoringProviders.map((provider: any) => (
                        <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{provider.name}</h3>
                            <p className="text-sm text-gray-600">{provider.type} • {provider.city}, {provider.state}</p>
                            <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <AdminEditModal type="tutoring-provider" listing={provider} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "tutoring-provider", id: provider.id })}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
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
                    <div className="space-y-4">
                      {pendingApprovals.summerCamps.map((camp: any) => (
                        <div key={camp.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{camp.name}</h3>
                            <p className="text-sm text-gray-600">{camp.city}, {camp.state}</p>
                            <p className="text-sm text-gray-500 mt-1">{camp.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <AdminEditModal type="summer-camp" listing={camp} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "summer-camp", id: camp.id })}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
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
                    <div className="space-y-4">
                      {pendingApprovals.internships.map((internship: any) => (
                        <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{internship.title}</h3>
                            <p className="text-sm text-gray-600">{internship.companyName} • {internship.city}, {internship.state}</p>
                            <p className="text-sm text-gray-500 mt-1">{internship.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <AdminEditModal type="internship" listing={internship} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "internship", id: internship.id })}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
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
                    <div className="space-y-4">
                      {pendingApprovals.jobs.map((job: any) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.companyName} • {job.city}, {job.state}</p>
                            <p className="text-sm text-gray-500 mt-1">{job.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <AdminEditModal type="job" listing={job} />
                            <Button
                              onClick={() => approveMutation.mutate({ type: "job", id: job.id })}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
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
                      <input
                        id="tutoring-providers-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setSelectedFiles(prev => ({ 
                          ...prev, 
                          'tutoring-providers': e.target.files?.[0] || null 
                        }))}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <Button
                      onClick={() => handleImport('tutoring-providers')}
                      disabled={!selectedFiles['tutoring-providers'] || importLoading['tutoring-providers']}
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
                      <input
                        id="summer-camps-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setSelectedFiles(prev => ({ 
                          ...prev, 
                          'summer-camps': e.target.files?.[0] || null 
                        }))}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <Button
                      onClick={() => handleImport('summer-camps')}
                      disabled={!selectedFiles['summer-camps'] || importLoading['summer-camps']}
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
                      <input
                        id="internships-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setSelectedFiles(prev => ({ 
                          ...prev, 
                          'internships': e.target.files?.[0] || null 
                        }))}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <Button
                      onClick={() => handleImport('internships')}
                      disabled={!selectedFiles['internships'] || importLoading['internships']}
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
                      <input
                        id="jobs-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setSelectedFiles(prev => ({ 
                          ...prev, 
                          'jobs': e.target.files?.[0] || null 
                        }))}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <Button
                      onClick={() => handleImport('jobs')}
                      disabled={!selectedFiles['jobs'] || importLoading['jobs']}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {importLoading['jobs'] ? 'Importing...' : 'Import Job Opportunities'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
