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
  extraNotes?: { subheader: string; bullets: string[] }[];
}

const timelineData: TimelineItem[] = [
  {
    id: "9th",
    title: "9th Grade",
    period: "Freshman Year",
    description: "As a first-year, you have one job when it comes to the college process: don't think about it! Instead, get to know your high school and let yourself fall in love with the place you will call \"home\" for the next four years. <br><br>Your first year is about exploring your horizons and creating a solid foundation to build the story of your life. Join a club or two, play a sport, participate in a theatre production—not because doing so will someday look \"good\" on a college resume—but because the more you engage with your school community, the more fulfilling your high school experience will be. So spend this year getting acclimated, strengthening your study skills, making friends, and trying new things. Rest assured, through exploring and embracing what your high school has to offer, you have already begun your college journey.<br><br>",
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
    ],
    extraNotes: [
      {
        subheader: "September",
        bullets: [
          "Attend orientation and get to know your campus.",
          "Introduce yourself to your teachers and counselors."
        ]
      },
      {
        subheader: "October/November",
        bullets: [
          "Join at least one club or extracurricular activity.",
          "Start a study group for your classes."
        ]
      }
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
    ],
    extraNotes: [
      {
        subheader: "All Summer",
        bullets: [
          "Try a new hobby or skill—summer is a great time to explore!",
          "Keep a journal of your summer experiences to reflect on your growth."
        ]
      }
    ]
  },
  {
    id: "10th",
    title: "10th Grade",
    period: "Sophomore Year",
    description: "From a college perspective, sophomore year is about expanding your understanding of what makes you \"you,\" and then starting to take steps to put that understanding into action. <br><br>How do you do this? Ask yourself: what gets you excited, makes you happy, intrigues you? Once you have uncovered the answers, start to notice the \"threads\" that weave throughout your life. These \"threads\" represent your authentic values, skills, and interests. <br><br>Be mindful and take the initiative to align your values, skills, and interests with the classes you take, clubs you join, and how you spend your time outside of your high school. Then, deepen your involvement where you can. Pay particular attention to the subjects that inspire you and embrace opportunities to learn more (one of these subjects may someday become your college major). <br><br>",
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
    ],
    extraNotes: [
      {
        subheader: "Fall Semester",
        bullets: [
          "Meet with your counselor to review your 4-year plan.",
          "Consider taking on a leadership role in a club or activity."
        ]
      },
      {
        subheader: "Spring Semester",
        bullets: [
          "Register for challenging courses for next year.",
          "Start thinking about summer enrichment opportunities."
        ]
      }
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
    description: "Your junior year marks a transition and becomes about preparation for your post-secondary journey. While you are still actively building your story through your academics, extracurriculars, work, and family responsibilities, this year, you are also taking what you know about yourself to uncover your best \"fit.\"<br><br>Throughout your junior year, continually ask yourself where you can take the initiative to make a greater impact in your life. Is that in your courses, relationships with your teachers, leadership roles, community involvement, studying for standardized testing, summer experience? Repeatedly reassess your answers, and take concrete steps to deepen your engagement wherever you can. Plus, how you choose to spend your time will likely become the topic of your college essays. Alongside increased initiative and impact, junior year is also about engaging with your values, skills, and interests to find the right college for you. <br><br>While you have been preparing for two and a half years by immersing yourself in your school community and getting to know yourself, the official college process kicks off in January. Speak to your counselor to educate yourself on the logistics of the application process. Start to follow the application timeline, attend college fairs, visit schools when possible. Become empowered and take the information you learn to determine your best path. Finally, if you are considering a college, use what you know about yourself and what you are looking for in your college experience to build a list of schools you will apply to in your senior year. In short, do the groundwork now to set yourself up for success in the fall.<br><br>",
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
    ],
    extraNotes: [
      {
        subheader: "August/September",
        bullets: [
          "Register for the SAT/ACT if you haven't already.",
          "Attend the fall college fair at your school."
        ]
      },
      {
        subheader: "Spring",
        bullets: [
          "Ask teachers for letters of recommendation before summer.",
          "Start drafting your college application essays."
        ]
      }
    ]
  },
  {
    id: "summer-11",
    title: "Summer",
    period: "Third Summer",
    description: "",
    goals: [
      "Participate in summer experiences: research, internships, college coursework, work, travel, volunteer work",
      "Finalize your college list. Make sure it reflects a balance of admissions possibilities (Likely, Target, Reach)",
      "Research the type of applications required for each school on your list. Understand the requirements and deadlines",
      "Enter dates and deadlines into a college application spreadsheet to organize your information (see Senior Resources page)",
      "Create a scholarship spreadsheet",
      "Note down your Counselor Brag sheet (on google sheet or any platform, such as MaiaLearning",
      "Continue to draft your Common App Personal Statement you began in your junior English class. or Personal Insight Questions (UC) and create summer drafts",
      "Open a Common App account and complete the main sections of the Common App tab",
      "Brainstorm your UC personal insight questions, if applying",
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
    description: "It is time to finally share your story with the colleges you are applying to. Over the last three years, you have carefully honed your values, skills, and interests. You have dug deep in your academics, extracurriculars, leadership, and employment. Your college applications are an opportunity to pull it all together and showcase who you are, what matters to you, and why it matters. <br><br> Senior year is about being organized, following timelines, and honoring deadlines. This is true regardless of the path you follow. While most of you will attend college, there are many post-secondary opportunities. Speak to your school or private counselor, they are to guide and support you as you make the transition. Remember, your next steps are just the beginning. Where you land does not define who you are; what you do once you land there does.<br><br>",
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
    ],
    extraNotes: [
      {
        subheader: "December",
        bullets: [
          "Regular Decision (RD) deadlines are typically around January 1. Complete and send out all RD applications no later than mid-December",
          "If you applied to a college EA or ED, you should receive admissions decisions around mid-December"
        ]
      },
      {
        subheader: "January/March",
        bullets: [
          "If deferred, send a letter of continued interest to the admissions representative. Reaffirm your interest in the school and offer them any updates to your application (awards, achievements)",
          "Start to receive RD admissions decisions. CSUs and UCs typically announce decisions in mid-March"
        ]
      }
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
                    {item.description && (
                      <div
                        className="mt-4 text-sm text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    <CardDescription className="text-blue-700 mt-6">
                      Key focus areas and achievements for this period
                    </CardDescription>
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

                      {/* Extra Notes Section */}
                      {item.extraNotes && item.extraNotes.length > 0 && (
                        <div className="mt-8 text-sm text-gray-700 leading-relaxed">
                          {item.extraNotes.map((note, idx) => (
                            <div key={idx} className="mb-4">
                              <div className="font-bold mb-2">{note.subheader}</div>
                              <ul className="list-disc list-inside space-y-1">
                                {note.bullets.map((bullet, i) => (
                                  <li key={i}>{bullet}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
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