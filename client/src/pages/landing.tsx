import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, MapPin, Star, Calendar, Heart } from "lucide-react";
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
          <div className="flex flex-col lg:flex-row">
            {/* Left: Hero Text */}
            <div className="w-full lg:w-1/2 z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-6 sm:mt-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900">
                    <span className="block xl:inline">Raising kids</span>{' '}
                    <span className="block text-primary xl:inline">together</span>
                  </h1>
                  <p className="mt-3 text-sm xs:text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
                    Connect with trusted babysitters, caregivers, tutors, and enrichment programs. 
                    From infants to high schoolers - find the resources your family needs, shared by parents like you.
                  </p>
                  <div className="mt-5 sm:mt-8 flex flex-col xs:flex-row gap-3 xs:gap-3 sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Button 
                        onClick={() => window.location.href = "/tutoring-providers"}
                        size="lg"
                        className="w-full flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-medium bg-primary hover:bg-primary/90"
                      >
                        Start Browsing
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
            {/* Right: Carousel */}
            <div className="w-full lg:w-1/2 flex items-center justify-end pr-4 bg-gradient-to-br from-primary/20 to-primary/40">
              <FeatureShowcase />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center lg:text-center">
            <h2 className="text-sm sm:text-base text-primary font-semibold tracking-wide uppercase">What We Offer</h2>
            <p className="mt-2 text-xl xs:text-2xl sm:text-3xl lg:text-4xl leading-tight font-extrabold tracking-tight text-gray-900">
              Everything parents need in one place
            </p>
            <p className="mt-4 max-w-2xl text-base xs:text-lg sm:text-xl text-gray-500 mx-auto">
              Find trusted caregivers, discover learning programs, connect with other families, and access resources for every stage of your child's journey.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3 sm:gap-8 lg:gap-10">
              <Card>
                <CardHeader>
                  <Heart className="h-8 w-8 text-primary" />
                  <CardTitle>Service Providers</CardTitle>
                  <CardDescription>
                    Find trusted babysitters, nannies, caregivers, and other service providers in your area.
                  </CardDescription>
                </CardHeader>
              </Card>

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
                    Help your teens explore internships and career opportunities to gain real-world experience.
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
                  <Star className="h-8 w-8 text-primary" />
                  <CardTitle>Reviews & Ratings</CardTitle>
                  <CardDescription>
                    Make informed decisions with community reviews, ratings, and recommendations from other parents.
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
            <span className="block">Join our parent community</span>
            <span className="block">Share and discover trusted resources.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Create your free account and connect with local families, caregivers, tutors, and enrichment programs.
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
