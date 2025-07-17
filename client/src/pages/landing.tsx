import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, MapPin, Star } from "lucide-react";
import Footer from "@/components/layout/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-bold bg-yellow-400 text-black px-3 py-1 rounded cursor-pointer">Education Yellow Pages</h1>
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
                  <span className="block xl:inline">Find the best</span>{' '}
                  <span className="block text-primary xl:inline">educational services</span>
                </h1>
                <p className="mt-3 text-sm xs:text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
                  Discover tutoring providers, summer camps, internships, and job opportunities. 
                  Connect with the educational community and advance your learning journey.
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
            <GraduationCap size={80} className="xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-primary opacity-60" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center lg:text-center">
            <h2 className="text-sm sm:text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-xl xs:text-2xl sm:text-3xl lg:text-4xl leading-tight font-extrabold tracking-tight text-gray-900">
              Everything you need to find educational services
            </p>
            <p className="mt-4 max-w-2xl text-base xs:text-lg sm:text-xl text-gray-500 mx-auto">
              Our comprehensive platform connects students, parents, and educators with the best educational opportunities.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-4 sm:gap-8 lg:gap-10">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Tutoring Services</CardTitle>
                  <CardDescription>
                    Find qualified tutors and educational service providers across all subjects and grade levels.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <CardTitle>Summer Camps</CardTitle>
                  <CardDescription>
                    Discover enriching summer camp opportunities in STEM, arts, leadership, and more.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary" />
                  <CardTitle>Internships</CardTitle>
                  <CardDescription>
                    Explore internship opportunities to gain real-world experience in various fields.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Star className="h-8 w-8 text-primary" />
                  <CardTitle>Job Opportunities</CardTitle>
                  <CardDescription>
                    Find part-time jobs and career opportunities perfect for students and young professionals.
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
            <span className="block">Ready to get started?</span>
            <span className="block">Join our educational community today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Create your account and start discovering amazing educational opportunities.
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
