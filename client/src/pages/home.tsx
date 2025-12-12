import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, MapPin, Users, Calendar, Heart } from "lucide-react";
import { Link } from "wouter";
import { getDisplayName } from "@shared/utils";

export default function Home() {
  const { user } = useAuth() as { user: User | undefined };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {getDisplayName(user)}!
          </h1>
          <p className="text-gray-600">
            Find trusted caregivers, tutors, and resources for your family - shared by parents like you.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/services">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Service Providers</CardTitle>
                <CardDescription>
                  Find babysitters, nannies, and other trusted service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Browse Services</Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/tutoring-providers">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Tutoring Providers</CardTitle>
                <CardDescription>
                  Find qualified tutors and educational service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Browse Tutors</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/summer-camps">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Summer Camps</CardTitle>
                <CardDescription>
                  Discover enriching summer camp opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Camps</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/internships">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Briefcase className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Internships</CardTitle>
                <CardDescription>
                  Explore internship opportunities for experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Find Internships</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/jobs">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Job Opportunities</CardTitle>
                <CardDescription>
                  Find part-time jobs and career opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Browse Jobs</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/events">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Community Events</CardTitle>
                <CardDescription>
                  Discover local educational events and workshops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Events</Button>
              </CardContent>
            </Card>
          </Link>


        </div>

        {/* Business Submission CTA */}
        <div className="bg-primary rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Know a great resource?</h2>
              <p className="text-primary-100">
                Share your trusted babysitters, tutors, camps, or other services to help other parents.
              </p>
            </div>
            <Link href="/submit-listing">
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                List Your Service
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
