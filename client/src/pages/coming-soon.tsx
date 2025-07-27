import Header from "@/components/layout/header";
import { Link } from "wouter";
import { ArrowLeft, Clock, BookOpen, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're working on exciting new features to enhance your educational journey. 
            Stay tuned for updates!
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Enhanced Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Comprehensive educational resources and step-by-step planning guides for your academic success
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Community Features</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Connect with peers, share experiences, and build meaningful relationships in your educational community
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Personalized Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get tailored recommendations and insights based on your interests and academic goals
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            In the meantime, explore our existing features to discover tutoring providers, 
            summer camps, internships, and job opportunities.
          </p>
          <div className="space-x-4">
            <Link href="/tutoring-providers">
              <Button variant="outline">Find Tutors</Button>
            </Link>
            <Link href="/summer-camps">
              <Button variant="outline">Browse Camps</Button>
            </Link>
            <Link href="/internships">
              <Button variant="outline">View Internships</Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline">Explore Jobs</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline">Discover Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}