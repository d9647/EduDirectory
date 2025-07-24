import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessSubmissionForm from "@/components/forms/business-submission-form";
import { EventSubmissionForm } from "@/components/forms/event-submission-form";

export default function BusinessSubmission() {
  const [activeTab, setActiveTab] = useState("tutoring");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Service</h1>
          <p className="text-gray-600">
            Submit your listing for review. Once approved, it will be visible to our community.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Listing Type</CardTitle>
            <CardDescription>
              Select the type of service you want to list on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex flex-wrap w-full h-auto p-1 gap-1 sm:grid sm:grid-cols-5 sm:h-10">
                <TabsTrigger value="tutoring" className="flex-1 min-w-[120px] sm:min-w-0">Tutoring Service</TabsTrigger>
                <TabsTrigger value="camp" className="flex-1 min-w-[120px] sm:min-w-0">Summer Camp</TabsTrigger>
                <TabsTrigger value="internship" className="flex-1 min-w-[120px] sm:min-w-0">Internship</TabsTrigger>
                <TabsTrigger value="job" className="flex-1 min-w-[120px] sm:min-w-0">Job Opportunity</TabsTrigger>
                <TabsTrigger value="event" className="flex-1 min-w-[120px] sm:min-w-0">Event</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tutoring" className="mt-6">
                <BusinessSubmissionForm type="tutoring" />
              </TabsContent>
              
              <TabsContent value="camp" className="mt-6">
                <BusinessSubmissionForm type="camp" />
              </TabsContent>
              
              <TabsContent value="internship" className="mt-6">
                <BusinessSubmissionForm type="internship" />
              </TabsContent>
              
              <TabsContent value="job" className="mt-6">
                <BusinessSubmissionForm type="job" />
              </TabsContent>
              
              <TabsContent value="event" className="mt-6">
                <EventSubmissionForm onSuccess={() => {
                  // Show success message and optionally redirect
                }} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
