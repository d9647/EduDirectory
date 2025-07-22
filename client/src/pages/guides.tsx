import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Calendar, Target, BookOpen, Send } from "lucide-react";
import Header from "@/components/layout/header";

interface TimelineItem {
  id: string;
  title: string;
  period: string;
  description?: string; // New field for a wordy paragraph
  goals: string[];
  milestones: string[];
  resources: string[];
  extraNotes?: { subheader: string; bullets: (string | JSX.Element)[] }[];
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
        subheader: "All Year Long",
        bullets: [
          "Explore extracurricular activities. Find clubs and activities that excite you and that align with your values.",
          "Develop your time management and study skills.",
          "Plan a summer experience that helps you expand your world.",
          "Athletes: Familiarize yourself with the NCAA and NAIA requirements.",
          "Start an activities resume and keep track of all extracurricular activities (hrs/week/month), employment, awards, and volunteer work. You will need an activities resume for many colleges",
          <>Explore <a href="https://www.collegeboard.org/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">College Board</a> or <a href="https://nces.ed.gov/collegenavigator/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">College Navigator</a> or any other platforms: Begin searching colleges, look at academic profiles needed for schools you are interested in</>
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
        subheader: "All Year Long",
        bullets: [
          "Continue existing extracurricular activities or get involved in new ones. Find a few activities to focus on and deepen your involvement. Possibly take on a leadership role",
          "Stay focused on your academics. Sophomore year is important to college admissions officers and sets the tone for junior year",
          "Consider taking the PSAT (preliminary SAT) in October",
          "Continue to familiarize yourself with resources available in the school counseling department",
          "Meet with your counselor to discuss course selection for junior year. Consider challenging yourself to take high-level coursework in subjects you excel in",
          "Visit a college or two locally or when you are on vacation. Plan to take an official college tour if you are traveling during spring break or over summer vacation",
          "In the spring, take a full-length practice ACT and SAT to get a feel for which test format you prefer",
          "Consider taking a community college course in a subject of interest not available to you at Miramonte during the summer. The registration process begins in March",
          "Continue pursuing your interests over the summer. Take on a job, volunteer work, internship, or self-directed project",
          "Athletes: If you think you may play Division I or II sports in college, register for the NCAA Clearinghouse, the NAIA Eligibility Center, and familiarize yourself with the academic requirements",
          <>Explore <a href="https://www.collegeboard.org/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">College Board</a> or any other platforms: Begin searching colleges, look at academic profiles needed for schools you are interested in</>
        ]
      },
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
        subheader: "All Year Long",
        bullets: [
          "Register for the SAT/ACT if you haven't already.",
          "Attend the fall college fair at your school.",
          "Focus on your academics. Junior year grades are often the last ones colleges see",
          "Plan to take an official campus tour of colleges you are interested in or attend virtual tours and information sessions. When possible, visit campuses when college students are on campus to get a true feeling for campus life. Spring Break is a good time to plan college tours",
          "Continue to participate in activities outside of class; it is not too late to get involved",
          "Deepen your involvement, take on leadership roles",
          "Update your activities resume with activities you participated in over the summer"
        ]
      },
      {
        subheader: "Fall",
        bullets: [
          "Ask teachers for letters of recommendation before summer.",
          "Start drafting your college application essays.",
          "Revisit your four-year plan course plan and make adjustments where you feel they are needed",
          "Demonstrate interest in colleges by signing up to attend college fair with the admission representative’s presentation (limit 2). Many colleges visit  your high school each year",
          "Take the PSAT in October to be considered for National Merit Scholarship",
          "Attend a local College Fair",
          "Sign up for AP tests and take them in May",
          "Determine your standardized testing plan. Consider taking the SAT/ACT in winter or spring: sign up on the appropriate testing platform. Establish your test prep schedule",
          "Stay on track with your ACT/SAT testing timeline and study schedule. Test prep resources are available on the website and in the school counseling department. Take multiple full-length practice exams in advance of exams",
          "Build a list of preliminary schools you are interested in; add schools of interest, you can condense the list next year",
          <>Take an assessment at <a href="https://www.mymajors.com/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">MyMajors</a></>,
          "Athletes: Double-check that your classes meet NCAA Clearinghouse requirements. Complete online recruitment forms for each college you're considering. Make your sports resume and recruitment videos. Correspond with coaches periodically to show interest",
          "Fine and Performing Arts Students: Sign up for Performing and Visual Arts College Fairs. Work on portfolio or audition materials throughout junior year"
        ]
      },
      {
        subheader: "Winter/Spring",
        bullets: [
          "Continue to draft your college application essays.",
          "Revisit your four-year plan course plan and make adjustments where you feel they are needed",
          "Take the SAT/ACT. Test prep resources are available in the C&CC and on the MHS Website",
          "Spend time search engines researching potential colleges and their admission requirements",
          "Continue to add schools to \"Considering\" in your college list",
          "Visit and tour college campuses during breaks or take an online virtual tour",
          "Start to research college scholarships",
          "Request letters of recommendation from two academic teachers after Spring Break",
          "Investigate and secure summer experiences. See <a href='https://www.miramonte.org/page/view/1000000000000000000000000000000000000000' target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>MHS website</a> for a full list of ideas",
          "Athletes: Send your sports resume and video to college coaches and fill out athletic recruitment surveys on the college websites",
          "Fine and Performing Arts Students: Explore how the audition and portfolio process for college admissions. Continue to build your portfolio and audition videos"
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
    ],
    extraNotes: [
      {
        subheader: "All Summer",
        bullets: [
          "Participate in summer experiences: research, internships, college coursework, work, travel, volunteer work",
          "Finalize your college list. Make sure it reflects a balance of admissions possibilities (Likely, Target, Reach)",
          "Research the type of applications required for each school on your list. Understand the requirements and deadlines",
          "Enter dates and deadlines into a college application spreadsheet to organize your information (see <a href='https://www.miramonte.org/page/view/1000000000000000000000000000000000000000' target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>Senior Resources page</a>)",
          "Create a scholarship spreadsheet",
          "Fill out your Counselor Brag sheet",
          "Continue to draft your Common App Personal Statement you began in your junior English class. or Personal Insight Questions (UC) and create summer drafts",
          "Open a Common App account and complete the main sections of the Common App tab",
          "Brainstorm your UC personal insight questions, if applying"
        ]
      }
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
        subheader: "All Year Long",
        bullets: [
          "Keep up your grades. Acceptances are conditional, and colleges expect the GPA you applied with to stay roughly the same",
          "Continue to participate in extracurricular activities outside of class",
          "Check your application portals and email regularly",
          "Send colleges any additional information they request promptly",
          "Keep track of your admissions results or other post-secondary plans"
        ]
      },
      {
        subheader: "August/September/October",
        bullets: [
          "Finalize college list, requirements, and deadlines for each college you are applying to",
          "Decide if you are applying ED, EA, or RD for each college",
          "Work on your applications",
          "Keep a log of the different websites, username/password data for each college application portal",
          "Turn in your Brag sheet to your counselor. Due September 1st",
          "Check your high school transcripts and make sure they are accurate",
          "Take the ACT/SAT one more time, if needed",
          "Update your activities resume. Add activities you participated in over the summer. Use this information to fill out the activities section of your various applications (see <a href='https://www.miramonte.org/page/view/1000000000000000000000000000000000000000' target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>Senior Resources page</a>)",
          "Update the MaiaLearning \"Considering\" list and move colleges over to the \"Applying\" section",
          "Request/Confirm teacher recommendations verbally and send formal requests through Maia Learning",
          "Order official transcripts from your high school",
          "Send official transcripts from any other schools you have taken coursework to colleges that require official transcripts at the time of application",
          "Send ACT/SAT scores through the College Board (SAT) or ACT official sites to colleges you are applying to, if applicable",
          "Register for AP test if taking AP classes"
        ]
      },
      {
        subheader: "October/November",
        bullets: [
          "Take the ACT/SAT for the final time",
          "Finish your college essay(s) and personal statements",
          "Complete and send out all EA and ED applications by late October (Typically Nov. 1 deadline)",
          "Review and submit financial aid information. FAFSA opens on October 1st. Apply by your school deadlines and/or FAFSA deadline. ???MHS automatically uploads Cal Grant eligibility for you",
          "Fill out the CSS Profile if needed for your colleges",
          "Submit CSU and UC applications by the November 30th deadline (good idea to send by Thanksgiving)"
        ]
      },
      {
        subheader: "December",
        bullets: [
          "Regular Decision (RD) deadlines are typically around January 1. Complete and send out all RD applications no later than mid-December",
          "If you applied to a college EA or ED, you should receive admissions decisions around mid-December",
          "If accepted ED, pull all other submitted applications",
          "Thank all of your letter of recommender writers"
        ]
      },
      {
        subheader: "January/March",
        bullets: [
          "If deferred, send a letter of continued interest to the admissions representative. Reaffirm your interest in the school and offer them any updates to your application (awards, achievements)",
          "Start to receive RD admissions decisions. CSUs and UCs typically announce decisions in mid-March"
        ]
      },
      {
        subheader: "March/April",
        bullets: [
          "Colleges have until April 1st to release decisions",
          "Evaluate financial aid packages and scholarship offerings",
          "Track your notes with application decisions received",
          "Plan visits to accepted colleges if needed to make your final decision. Attend admitted student day if offered admission to learn more about a college before enrolling",
          "Accept admission to your college of choice by May 1st or earlier. May 1st is National Deposit Day. Once you accept an admission offer, you should let other colleges know that you do not plan to attend",
          "Enroll and submit a deposit by May 1"
        ]
      },
      {
        subheader: "May",
        bullets: [
          "If you have been waitlisted, make sure to let the school know you are still interested by writing a Letter of Continued Interest (see <a href='https://www.miramonte.org/page/view/1000000000000000000000000000000000000000' target='_blank' rel='noopener noreferrer' className='text-blue-700 underline'>Senior Resources page</a>)",
          "Complete the your high school's Graduation Survey if any",
          "Complete the final transcript Google form sent by the Registrar if any",
          "Sign up for campus housing if you plan to live on campus and send a deposit, if required"
        ]
      },
      {
        subheader: "After Graduation",
        bullets: [
          "Sign up for College Orientation Sessions",
          "Check your portal for any additional information needed by your college of choice",
          "Send your AP Scores to the college you are attending",
          "If waitlisted, continue to check your email for notifications"
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

  // Move quickLinks above state usage to avoid initialization error
  const quickLinks = [
    {
      subheader: "List Building",
      links: [
        { label: "Corsava", url: "https://www.corsava.com/", description: "A free tool to help you sort and list your preferences in a way that will help you figure out what you want from your college experience." },
        { label: "CollegeXpress", url: "https://www.collegexpress.com/", description: "Students can search from an amazing set of lists according to their interests. Students can type in anything from “Schools for the Free Spirit” to “Great Private Colleges for the B Student” and get a list of results compiled by experts." },
        { label: "Niche", url: "https://www.niche.com/colleges/search/best-colleges/", description: "Rankings/Niche Grades are based on rigorous analysis of academic, admissions, financial, and student life data from the U.S. Department of Education along with millions of reviews from students and alumni." },
        { label: "BigFuture", url: "https://bigfuture.collegeboard.org/", description: "The College Board's free college planning tool, designed to support students in the planning process and discover best-fit colleges. Provides tools to discover interests and career options." },
        { label: "College Navigator", url: "https://nces.ed.gov/collegenavigator/", description: "Created by the US Department of Education and its National Center for Education Statistics." },
        { label: "Appily", url: "https://www.appily.com/", description: "Matches you with schools and provides net price and merit scholarship info." },
        { label: "Unigo", url: "https://www.unigo.com/", description: "Provides a student perspective. You can read students’ opinions on their schools. Read multiple reviews, in particular, the “What’s the stereotype of students at your school?” and “Is the stereotype true?” You’ll get a sense of the school vibe." },
        { label: "CollegeData", url: "https://www.collegedata.com/", description: "Data on test scores, acceptance rates, GPAs, and financial aid packages." }
      ]
    },
    {
      subheader: "Senior Resources",
      links: [
        { label: "College Essay Guy Application Hub", url: "https://www.collegeessayguy.com/application-hub", description: "Contains free guides to almost every part of the college application process." },
        { label: "Common App Essay Formatting and Style Guide", url: "https://www.collegeessayguy.com/blog/common-app-essay-formatting", description: "This guide is dedicated to helping take some of the guesswork out of punctuation, style, grammar, and even the Common App essay formatting. Also shares some common college essay grammar mistakes students make and how to fix them." },
        { label: "UC Guide to Presenting Yourself on the UC Application", url: "https://admission.universityofcalifornia.edu/how-to-apply/presenting-yourself.html", description: "Official UC guide for presenting yourself on the UC application." },
        { label: "AXS Companion to Common App", url: "https://www.commonapp.org/ready", description: "A free, open online platform to provide access and clarity for students as they apply to college using the Common App. The AXS Companion is used side-by-side with Common App and includes video modules that can be viewed sequentially or just as needed." }
      ]
    },
    {
      subheader: "Virtual Tours",
      links: [
        { label: "YouVisit", url: "https://www.youvisit.com/collegesearch/", description: "You can search by college name or by fun rankings such as best campus food or coolest dorms. The videos are a nice complement to the tours found on college admissions websites." },
        { label: "CampusReel", url: "https://www.campusreel.org/", description: "For virtual campus tours. Not only shows what a campus looks like but really lets you get a sense of what the college campus feels like." },
        { label: "College Tours", url: "https://www.collegetours.com/", description: "Offers videos and campus maps as well as general information about the colleges. It also provides videos by category of interest." }
      ]
    },
    {
      subheader: "Alternative Institutions for Coursework",
      links: [
        { label: "UC Scout", url: "https://www.ucscout.org/", description: "Online approved UC A-G high school courses." },
        { label: "BYU Online", url: "https://is.byu.edu/catalog/HS", description: "Online approved UC A-G high school courses." },
        { label: "Apex Learning", url: "https://www.apexlearning.com/", description: "Online for original credit or f credit recovery towards grade-level advancement and high school graduation." },
        { label: "National University Virtual High School", url: "https://www.nuvhs.org/", description: "Online AP, UC (A-G), or elective courses to achieve academic goals." },
        { label: "Language Bird", url: "https://www.languagebird.com/", description: "Online language courses for high school credit." },
        { label: "Laurel Springs Online School", url: "https://laurelsprings.com/", description: "Online UC (A-G) approved courses." },
        { label: "Tilden Prep", url: "https://tildenprep.com/", description: "A unique, WASC-accredited, college preparatory school. Teaches UC-approved courses one-to-one and in small groups." }
      ]
    },
    {
      subheader: "College Majors",
      links: [
        { label: "BigFuture Major & Career Search", url: "https://bigfuture.collegeboard.org/majors-careers", description: "College Board’s major and career search engine." },
        { label: "College Majors 101", url: "https://www.collegemajors101.com/", description: "Exploration tool to gather more in-depth information about college major selection and find the major that fits you." },
        { label: "My Majors", url: "https://www.mymajors.com/", description: "Diagnostic tool to explore options when deciding on a college major." },
        { label: "ThoughtCo. Major Quiz", url: "https://www.thoughtco.com/college-major-quiz-4076781", description: "Assessment to help you determine which major is right for you." },
        { label: "UC Majors", url: "https://admission.universityofcalifornia.edu/counselors/files/uc-majors-list.pdf", description: "List of UC campuses and the majors they offer." },
        { label: "CSU Majors", url: "https://www2.calstate.edu/attend/degree-programs/Pages/bachelors-degree-programs.aspx", description: "List of CSU campuses and the majors they offer." },
        { label: "Northeastern University Career Center", url: "https://careers.northeastern.edu/", description: "Northeastern University Career Center." },
        { label: "Berkeley (What can I do with this Major)", url: "https://career.berkeley.edu/Info/Majors", description: "Explore career options by major at UC Berkeley." },
        { label: "University of Michigan", url: "https://careercenter.umich.edu/article/what-can-i-do-major", description: "Career options by major at University of Michigan." },
        { label: "Penn State University", url: "https://studentaffairs.psu.edu/career/majors", description: "Career options by major at Penn State." }
      ]
    },
    {
      subheader: "Career Resources",
      links: [
        { label: "Jobs For Teens", url: "https://www.jobsforteenshq.com/", description: "Website dedicated to helping teens find jobs. Offers education regarding potential jobs, resume writing tips, volunteer opportunities, and more." },
        { label: "O* NET Resource Center", url: "https://www.onetcenter.org/", description: "Occupational information network. Primary sources of occupational information. The database is skill-based and contains information about worker attributes, job characteristics, and career exploration tools that relate the results of assessments to career and labor market information in the database." },
        { label: "Big Future/RoadTrip Nation", url: "https://roadtripnation.com/", description: "College Board’s site for helping students determine career interests. Links to RoadTrip Nation. Roadtrip Nation helps career-seekers connect to real-world professionals and discover pathways aligned with their interests." },
        { label: "YouScience", url: "https://www.youscience.com/", description: "Fee-based sight to discover your aptitude, true strengths, and how to select the right pathway and career for you." },
        { label: "16 Personalities", url: "https://www.16personalities.com/", description: "A free personality test that helps students learn how their personality type influences many areas of their life, including major and career choices." },
        { label: "My Next Move", url: "https://www.mynextmove.org/", description: "Interest profiler to help determine what your interests are and how they relate to the world of work." },
        { label: "Career One Stop", url: "https://www.careeronestop.org/", description: "Sponsored by the U.S. Department of Labor. Source for career exploration, training, and jobs." },
        { label: "CA Career Zone", url: "https://www.cacareerzone.org/", description: "The California CareerZone helps students, educators, job seekers, and others access up-to-date career information." }
      ]
    },
    {
      subheader: "Financial Aid",
      links: [
        { label: "Paying for College in Four Steps", url: "https://www.collegeessayguy.com/blog/paying-for-college", description: "A blog post from College Essay Guy." },
        { label: "FAFSA", url: "https://studentaid.gov/", description: "Application for Federal Financial Aid" },
        { label: "CSS Profile", url: "https://cssprofile.collegeboard.org/", description: "Online application that collects information used by nearly 400 colleges and scholarship programs to award non-federal aid for private and some public colleges. See a list of schools that use the CSS Profile here" },
        { label: "California Student Aid Commission", url: "https://www.csac.ca.gov/", description: "Provides state financial aid for those who meet certain income, assets, and other financial aid standards to attend college" },
        { label: "FinAid.org", url: "https://finaid.org/", description: "Information on financial aid for college and tips on how to help ease the burden of college expenses" },
        { label: "the balance", url: "https://www.thebalancemoney.com/paying-for-college-4074016", description: "Informative website on how to calculate college costs, save with a 529 plan, apply for and secure financial aid and get scholarships and other sources of funding for education" },
        { label: "BigFuture", url: "https://bigfuture.collegeboard.org/pay-for-college", description: "BigFuture is the College Board's free college planning tool, designed to support students in the entire college planning process, including paying for college. Offers tools and information to help navigate the financial aid landscape" },
        { label: "Net Price Calculator Center", url: "https://collegecost.ed.gov/net-price", description: "Department of Education tool to search for any school’s net price calculator" },
        { label: "Big Future EFC Calculator", url: "https://bigfuture.collegeboard.org/pay-for-college/paying-your-share/expected-family-contribution-calculator", description: "College Board tool to estimate how much a student’s family will be expected to contribute financially towards college costs for one year" },
        { label: "Mapping Your Future: Student Loan Debt Calculator", url: "https://www.mappingyourfuture.org/paying/debtwizard/", description: "Student Loan Debt calculator which helps estimate student loan payments under a standard repayment plan (equal payments)" },
        { label: "Fastweb", url: "https://www.fastweb.com/", description: "Site that matches the information entered into your profile to scholarship, college, job, and internship opportunities. Students can use the information that Fastweb provides to apply for scholarships, discover prospective colleges, explore internship possibilities, or learn about part-time jobs" },
        { label: "JLV College Counseling", url: "https://jlvcollegecounseling.com/scholarships/", description: "List of national scholarships sorted by category" },
        { label: "Going Merry", url: "https://www.goingmerry.com/", description: "Site for personalized matching and thousands of scholarships" },
        { label: "College GreenLight", url: "https://www.collegegreenlight.com/", description: "Scholarship site to connect first-generation and underrepresented students to colleges, generous scholarships, and counselors" }
      ]
    },
    {
      subheader: "Templates",
      links: [
        { label: "Resume Templates", url: "https://www.acalanes.k12.ca.us/Page/3806", description: "Sample resume templates for students." },
        { label: "Teacher Brag Sheet", url: "https://www.acalanes.k12.ca.us/Page/3806", description: "Template for teacher recommendations." }
      ]
    }
  ];
  // State for expanding/collapsing quick links sections
  const [activeQuickLinkSection, setActiveQuickLinkSection] = useState<string | null>(null);
  const [quickLinksPage, setQuickLinksPage] = useState(0);
  const categoriesPerPage = 4;
  const totalPages = Math.ceil(quickLinks.length / categoriesPerPage);
  const pagedQuickLinks = quickLinks.slice(
    quickLinksPage * categoriesPerPage,
    (quickLinksPage + 1) * categoriesPerPage
  );

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
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <Card key={item.id} className="shadow-lg border-0">
                      <CardHeader className="bg-blue-50">
                        <CardTitle className="text-xl sm:text-2xl text-blue-900 flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {item.title} - {item.period}
                        </CardTitle>
                        <CardDescription className="text-blue-700 mt-6">
                          Key focus areas and achievements for this period
                        </CardDescription>
                        {item.description && (
                          <div
                            className="mt-4 text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
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
                      {item.extraNotes && item.extraNotes.length > 0 && (
                        <CardFooter className="bg-blue-50 flex flex-col items-start px-6 py-8">
                          <CardDescription className="text-blue-700 mb-4">
                            Key focus areas on different timelines
                          </CardDescription>
                          <div className="mt-4 text-sm text-gray-700 leading-relaxed w-full">
                            {item.extraNotes.map((note, idx) => (
                              <div key={idx} className="mb-4">
                                <div className="font-bold mb-2">{note.subheader}</div>
                                <ul className="space-y-2">
                                  {note.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <ChevronRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      {typeof bullet === 'string' ? (
                                        <span>{bullet}</span>
                                      ) : (
                                        <span className="inline">{bullet}</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                  {/* Right Panel: Quick Resources */}
                  <div className="w-full lg:w-80">
                    <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                      <h3 className="text-blue-800 font-semibold mb-3 text-sm">Quick Resources</h3>
                      {activeQuickLinkSection === null ? (
                        pagedQuickLinks.map(section => (
                          <div key={section.subheader} className="mb-4">
                            <div
                              className="font-semibold text-blue-700 text-xs mb-2 cursor-pointer"
                              onClick={() => section.links.length > 5 ? setActiveQuickLinkSection(section.subheader) : undefined}
                            >
                              {section.subheader}
                              {section.links.length > 5 && (
                                <span className="ml-2 text-xs text-blue-500 underline cursor-pointer">View More</span>
                              )}
                            </div>
                            <ul className="space-y-2">
                              {(section.links.length > 5 ? section.links.slice(0, 5) : section.links).map(link => (
                                <li key={link.label}>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 text-blue-700 hover:underline text-sm"
                                  >
                                    <Send className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span className="flex flex-wrap items-center gap-1 text-xs text-gray-700 font-normal leading-tight">
                                      <span className="underline">{link.label}</span>
                                      {link.description && (
                                        <span>- {link.description}</span>
                                      )}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <div>
                          <button
                            className="mb-2 text-xs text-blue-700 underline"
                            onClick={() => setActiveQuickLinkSection(null)}
                          >
                            ← Back to Quick Links
                          </button>
                          {quickLinks.filter(s => s.subheader === activeQuickLinkSection).map(section => (
                            <div key={section.subheader}>
                              <div className="font-semibold text-blue-700 text-xs mb-2">{section.subheader}</div>
                              <ul className="space-y-2">
                                {section.links.map(link => (
                                  <li key={link.label}>
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-2 text-blue-700 hover:underline text-sm"
                                    >
                                      <Send className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span className="flex flex-wrap items-center gap-1 text-xs text-gray-700 font-normal leading-tight">
                                        <span className="underline">{link.label}</span>
                                        {link.description && (
                                          <span>- {link.description}</span>
                                        )}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Pagination controls for right panel */}
                    {activeQuickLinkSection === null && totalPages > 1 && (
                      <div className="flex justify-between items-center mt-2">
                        <button
                          disabled={quickLinksPage === 0}
                          onClick={() => setQuickLinksPage(quickLinksPage - 1)}
                          className="text-xs text-blue-700 underline disabled:text-gray-400"
                        >
                          Previous
                        </button>
                        <span className="text-xs text-gray-500">
                          Page {quickLinksPage + 1} of {totalPages}
                        </span>
                        <button
                          disabled={quickLinksPage === totalPages - 1}
                          onClick={() => setQuickLinksPage(quickLinksPage + 1)}
                          className="text-xs text-blue-700 underline disabled:text-gray-400"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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