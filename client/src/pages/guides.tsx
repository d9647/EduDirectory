import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Calendar, Target, BookOpen } from "lucide-react";
import Header from "@/components/layout/header";

interface TimelineItem {
  id: string;
  title: string;
  period: string;
  description?: string; // New field for a wordy paragraph
  goals: string[];
  milestones: string[];
  resources: string[];
}

const timelineData: TimelineItem[] = [
  {
    id: "9th",
    title: "9th Grade",
    period: "Freshman Year",
    description: "As a first-year, you have one job when it comes to the college process: don't think about it! Instead, get to know your high school and let yourself fall in love with the place you will call \"home\" for the next four years. Your first year is about exploring your horizons and creating a solid foundation to build the story of your life. Join a club or two, play a sport, participate in a theatre production—not because doing so will someday look \"good\" on a college resume—but because the more you engage with your school community, the more fulfilling your high school experience will be. So spend this year getting acclimated, strengthening your study skills, making friends, and trying new things. Rest assured, through exploring and embracing what Miramonte has to offer, you have already begun your college journey.",
    goals: [
      "Establish strong study habits and time management skills",
      "Explore extracurricular activities and find your passions",
      "Build relationships with teachers and counselors",
      "Maintain a strong GPA (aim for 3.5 or higher)"
    ],
    milestones: [
      "Complete freshman orientation program",
      "Join at least 2 clubs or activities",
      "Meet with school counselor to discuss 4-year plan",
      "Earn credits toward graduation requirements"
    ],
    resources: [
      "School counseling department",
      "Study skills workshops",
      "Academic tutoring services",
      "Club and activity fairs"
    ]
  },
  {
    id: "summer-9",
    title: "Summer",
    period: "First Summer",
    description: "",
    goals: [
      "Continue learning through summer programs or courses",
      "Explore career interests through volunteering",
      "Develop leadership skills",
      "Prepare for sophomore year challenges"
    ],
    milestones: [
      "Complete summer reading assignments",
      "Participate in community service (20+ hours)",
      "Attend summer camps or academic programs",
      "Begin exploring potential career paths"
    ],
    resources: [
      "Local community centers",
      "Summer academic programs",
      "Volunteer organizations",
      "Career exploration websites"
    ]
  },
  {
    id: "10th",
    title: "10th Grade",
    period: "Sophomore Year",
    description: "",
    goals: [
      "Take challenging courses including honors classes",
      "Deepen involvement in extracurricular activities",
      "Begin standardized test preparation",
      "Explore potential college majors and careers"
    ],
    milestones: [
      "Take PSAT/NMSQT for practice",
      "Complete driver's education if applicable",
      "Take on leadership roles in activities",
      "Begin college research and campus visits"
    ],
    resources: [
      "PSAT prep materials",
      "College search websites",
      "Career assessment tools",
      "Academic advisors"
    ]
  },
  {
    id: "summer-10",
    title: "Summer",
    period: "Second Summer",
    description: "",
    goals: [
      "Gain work experience through jobs or internships",
      "Continue community service and leadership development",
      "Prepare for junior year academic rigor",
      "Explore colleges through visits and research"
    ],
    milestones: [
      "Complete 40+ hours of community service",
      "Participate in pre-college programs",
      "Visit 3-5 college campuses",
      "Begin building college application resume"
    ],
    resources: [
      "Local job opportunities",
      "College summer programs",
      "Community service organizations",
      "College guidebooks and websites"
    ]
  },
  {
    id: "11th",
    title: "11th Grade",
    period: "Junior Year",
    description: "",
    goals: [
      "Take most challenging course load including AP classes",
      "Prepare for and take SAT/ACT tests",
      "Build strong relationships with teachers for recommendations",
      "Narrow down college choices and visit top options"
    ],
    milestones: [
      "Take SAT/ACT tests (multiple times if needed)",
      "Take AP exams in relevant subjects",
      "Begin college application essays",
      "Meet with college admissions representatives"
    ],
    resources: [
      "SAT/ACT prep courses",
      "College counseling services",
      "AP study materials",
      "College fairs and information sessions"
    ]
  },
  {
    id: "summer-11",
    title: "Summer",
    period: "Third Summer",
    description: "",
    goals: [
      "Focus on college applications and essays",
      "Gain meaningful work or internship experience",
      "Retake standardized tests if needed",
      "Visit final college choices"
    ],
    milestones: [
      "Complete college application essays",
      "Finalize college list (reach, match, safety)",
      "Request letters of recommendation",
      "Apply for scholarships"
    ],
    resources: [
      "College application platforms",
      "Essay writing workshops",
      "Scholarship search engines",
      "Financial aid counselors"
    ]
  },
  {
    id: "12th",
    title: "12th Grade",
    period: "Senior Year",
    description: "",
    goals: [
      "Submit college applications and financial aid forms",
      "Maintain strong academic performance",
      "Make final college decision",
      "Prepare for transition to college life"
    ],
    milestones: [
      "Submit all college applications by deadlines",
      "Complete FAFSA and CSS Profile",
      "Receive admission decisions",
      "Choose final college and submit deposit"
    ],
    resources: [
      "College application deadlines calendar",
      "Financial aid offices",
      "Senior year counseling services",
      "College transition workshops"
    ]
  },
  {
    id: "summer-12",
    title: "Summer",
    period: "Final Summer",
    description: "",
    goals: [
      "Prepare for college transition",
      "Complete college orientation requirements",
      "Earn money for college expenses",
      "Enjoy final summer before college"
    ],
    milestones: [
      "Complete college orientation program",
      "Register for freshman year classes",
      "Arrange housing and meal plans",
      "Prepare for college move-in"
    ],
    resources: [
      "College orientation materials",
      "Freshman year planning guides",
      "College preparation checklists",
      "Family financial planning resources"
    ]
  }
];

export default function Guides() {
  const [activeTimeline, setActiveTimeline] = useState<string | null>(null);

  const toggleTimeline = (id: string) => {
    setActiveTimeline(activeTimeline === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            4-Year High School Planning Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Navigate your high school journey with this comprehensive timeline. 
            Click on any milestone to explore specific goals, achievements, and resources.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="mb-12">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 hidden sm:block"></div>
            
            {/* Timeline Items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-4 relative">
              {timelineData.map((item, index) => (
                <div key={item.id} className="flex flex-col items-center">
                  <Button
                    variant={activeTimeline === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTimeline(item.id)}
                    className={`
                      relative z-10 h-12 w-full sm:w-20 lg:w-24 xl:w-28 text-xs sm:text-sm font-medium px-2
                      whitespace-nowrap overflow-hidden text-ellipsis
                      ${activeTimeline === item.id 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400"
                      }
                    `}
                  >
                    <span className="truncate">{item.title}</span>
                  </Button>
                  <span className="mt-2 text-xs text-gray-500 text-center">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Timeline Content */}
        {activeTimeline && (
          <div className="mb-8">
            {timelineData
              .filter(item => item.id === activeTimeline)
              .map(item => (
                <Card key={item.id} className="shadow-lg border-0">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-xl sm:text-2xl text-blue-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {item.title} - {item.period}
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      Key focus areas and achievements for this period
                    </CardDescription>
                    {item.description && (
                      <div className="mt-4 text-base text-gray-700 leading-relaxed">
                        {item.description}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Goals */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-600" />
                          Goals
                        </h3>
                        <ul className="space-y-2">
                          {item.goals.map((goal, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Milestones
                        </h3>
                        <ul className="space-y-2">
                          {item.milestones.map((milestone, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          Resources
                        </h3>
                        <ul className="space-y-2">
                          {item.resources.map((resource, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Welcome Message */}
        {!activeTimeline && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Welcome to Your High School Planning Journey
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  This guide will help you navigate each year of high school with clear goals, 
                  milestones, and resources. Click on any year or summer period above to get started 
                  and see detailed information for that time period.
                </p>
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => toggleTimeline("9th")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start with 9th Grade
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}