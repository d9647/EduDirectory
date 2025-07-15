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
import { CheckCircle, XCircle, AlertTriangle, Search, Eye, EyeOff } from "lucide-react";
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
        </Tabs>
      </div>
    </div>
  );
}
