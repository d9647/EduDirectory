import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MessageSquare, Users, Heart, Shield, Star, CheckCircle } from "lucide-react";
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
            It Takes a Village — Welcome to Ours
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Education Yellow Pages began with a simple idea: every parent has a story, every tutor has a talent, 
            and every student deserves the chance to discover both. We're the online village green where those 
            stories and talents meet—no gates, no fees, just a shared commitment to lift every learner a little higher.
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
                  Browse camps, classes, tutors, and community programs—all recommended by real families 
                  and educators who've tried them first‑hand.
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
                  Post a resource that helped your child thrive, leave a review, or answer a fellow parent's 
                  question. Every contribution becomes another lantern along a young scholar's path.
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
                  Reach out to providers directly, and get your questions answered-send a quick inquiry to any listing and receive reply straight to your inbox.
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
              <CardTitle className="text-xl">For Parents & Students</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Find opportunities that match your schedule, budget, and passions.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Read honest feedback from neighbors, not sponsored ads.</span>
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
                  <span>List your service for free and reach motivated families.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Highlight scholarships, early‑bird discounts, or volunteer openings.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Grow your impact with transparent reviews and real‑time listing analytics that show how many families you’re reaching.</span>
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
              We keep the lights on through responsible sponsorships—never pay‑to‑play listings. 
              Your trust is our currency, so listings stay merit‑based, reviews stay transparent, 
              and data stays private.
            </p>
          </CardContent>
        </Card>

        {/* Join Us Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Join Us</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to discover your next learning adventure or share a resource that changed your child's life? 
            Click "Get Started" to create a free account, and help turn our shared village knowledge into 
            brighter futures for every learner.
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