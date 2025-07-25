import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, MapPin, Star, Calendar, BookOpen } from "lucide-react";
import Footer from "@/components/layout/footer";
import { useState } from "react";

// FeatureShowcase carousel for previewing 5 pages/features
const previewImages = [
  { src: "/preview1.png", alt: "Tutoring Providers", caption: "" },
  { src: "/preview2.png", alt: "Planning Guides", caption: "" },
];

function FeatureShowcase() {
  const [index, setIndex] = useState(0);
  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      <div className="relative w-64 h-40 xs:w-80 xs:h-56 sm:w-96 sm:h-64 md:w-[28rem] md:h-80 lg:w-[32rem] lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300">
        <img
          src={previewImages[index].src}
          alt={previewImages[index].alt}
          className="object-contain w-full h-full rounded"
        />
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1"
          onClick={() => setIndex((index - 1 + previewImages.length) % previewImages.length)}
          aria-label="Previous"
        >&#8592;</button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1"
          onClick={() => setIndex((index + 1) % previewImages.length)}
          aria-label="Next"
        >&#8594;</button>
      </div>
      <div className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 text-center max-w-lg">{previewImages[index].caption}</div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex-shrink-0">
              <img src="/logo_header.png" alt="Education Yellow Pages" className="h-12 cursor-pointer" />
            </div>
            <Button onClick={() => window.location.href = "/api/login"} size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-6 sm:mt-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900">
                  <span className="block xl:inline">Your complete</span>{' '}
                  <span className="block text-primary xl:inline">educational journey</span>
                </h1>
                <p className="mt-3 text-sm xs:text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
                  Discover opportunities, connect with your community, and plan your path to success. 
                  From tutoring and events to career guidance - everything you need in one place.
                </p>
                <div className="mt-5 sm:mt-8 flex flex-col xs:flex-row gap-3 xs:gap-3 sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      onClick={() => window.location.href = "/api/login"}
                      size="lg"
                      className="w-full flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-medium bg-primary hover:bg-primary/90"
                    >
                      Get Started
                    </Button>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => window.location.href = "/learn-more"}
                      className="w-full flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-medium"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-40 xs:h-48 sm:h-56 md:h-72 lg:h-96 w-full bg-gradient-to-br from-primary/20 to-primary/40 lg:w-full lg:h-full flex items-center justify-center">
            <FeatureShowcase />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center lg:text-center">
            <h2 className="text-sm sm:text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-xl xs:text-2xl sm:text-3xl lg:text-4xl leading-tight font-extrabold tracking-tight text-gray-900">
              Your all-in-one educational resource hub
            </p>
            <p className="mt-4 max-w-2xl text-base xs:text-lg sm:text-xl text-gray-500 mx-auto">
              From finding tutors to planning your high school journey, discover community events, and career opportunities - all in one platform.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3 sm:gap-8 lg:gap-10">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Tutoring & Learning</CardTitle>
                  <CardDescription>
                    Find qualified tutors and educational service providers across all subjects and grade levels.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <CardTitle>Camps & Programs</CardTitle>
                  <CardDescription>
                    Discover summer camps, after-school programs, and enrichment opportunities in STEM, arts, and leadership.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary" />
                  <CardTitle>Internships & Jobs</CardTitle>
                  <CardDescription>
                    Explore internships and career opportunities to gain real-world experience and build your future.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="h-8 w-8 text-primary" />
                  <CardTitle>Community Events</CardTitle>
                  <CardDescription>
                    Stay connected with local educational events, workshops, competitions, and networking opportunities.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle>Planning Guides</CardTitle>
                  <CardDescription>
                    Navigate your high school journey with comprehensive planning resources and milestone guidance.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Star className="h-8 w-8 text-primary" />
                  <CardTitle>Reviews & Ratings</CardTitle>
                  <CardDescription>
                    Make informed decisions with community reviews, ratings, and recommendations from other students.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to begin your journey?</span>
            <span className="block">Join thousands of students succeeding together.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Create your account and unlock access to opportunities, events, guidance, and your local educational community.
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            size="lg"
            variant="secondary"
            className="mt-8 w-full max-w-md mx-auto bg-white text-primary hover:bg-gray-100"
          >
            Sign Up Now
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
