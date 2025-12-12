import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageSquare, Users, Heart, Shield, Star, CheckCircle, Calendar, BookOpen, MapPin, GraduationCap } from "lucide-react";
import SimpleHeader from "@/components/layout/simple-header";
import Footer from "@/components/layout/footer";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            It Takes a Village to Raise a Child
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We've built more than a directory—we've created a community where parents help parents. From finding trusted babysitters 
            and caregivers to discovering tutors, camps, and enrichment programs for every age. Share what works for your family, 
            discover resources others love, and raise your kids together with your village.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Find babysitters, nannies, tutors, camps, and enrichment programs—all recommended and reviewed by 
                  real parents in your community who've used them with their own kids.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Know a great babysitter or tutor? Share them with other parents. Leave reviews, post events, 
                  and help build a trusted network of resources for families like yours.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Reach out to caregivers and providers directly. Send inquiries, ask questions, and get 
                  responses straight to your inbox.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Resources for Every Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Caregivers & Babysitters</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find trusted babysitters, nannies, and caregivers recommended by parents in your community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Tutoring & Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with qualified tutors for all ages and subjects, from toddler enrichment to high school prep.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Camps & Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover summer camps, after-school programs, and enrichment activities for kids of all ages.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Teen Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Help your teens find internships and job opportunities to build skills and experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Family Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover local family-friendly events, workshops, and activities happening in your community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Parent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Make informed decisions with honest reviews and recommendations from other parents.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* For Parents & Students / For Providers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-xl">For Parents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Find caregivers, tutors, and programs that fit your family's needs and budget.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Read honest feedback from other parents in your community.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Save promising listings to your personal bookmarks so you can revisit and compare them whenever you’re ready.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-xl">For Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>List your service for free and connect with local families.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Build trust through parent reviews and recommendations.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Grow your reach within your local parent community.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Our Promise Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Our Promise</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              This is a community built on trust. Listings are based on parent recommendations, 
              reviews are honest and transparent, and your family's privacy is always protected.
            </p>
          </CardContent>
        </Card>

        {/* Join Us Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Join Our Village</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to find trusted resources or share what's worked for your family? 
            Create a free account and become part of a community of parents helping each other 
            raise amazing kids.
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}