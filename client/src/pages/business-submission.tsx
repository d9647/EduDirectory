import { useState } from "react";
import Header from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            List Your Service
          </h1>
          <p className="text-gray-600">
            Submit your listing for review. Once approved, it will be visible to
            our community.
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-6 h-10">
                <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="camp">Camps</TabsTrigger>
                <TabsTrigger value="internship">Internship</TabsTrigger>
                <TabsTrigger value="job">Jobs</TabsTrigger>
                <TabsTrigger value="event">Event</TabsTrigger>
              </TabsList>

              <TabsContent value="tutoring" className="mt-6">
                <BusinessSubmissionForm type="tutoring" />
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <BusinessSubmissionForm type="services" />
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
                <EventSubmissionForm
                  onSuccess={() => {
                    // Show success message and optionally redirect
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
