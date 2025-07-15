// Tutoring Categories and Subjects
export const TUTORING_CATEGORIES = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Social Science", label: "Social Science" },
  { value: "Computer Science & Coding", label: "Computer Science & Coding" },
  { value: "Science", label: "Science" },
  { value: "Humanities", label: "Humanities" },
  { value: "Standardized Tests", label: "Standardized Tests" },
  { value: "Languages", label: "Languages" },
  { value: "Music & Arts", label: "Music & Arts" },
  { value: "Counseling", label: "Counseling" },
];

export const TUTORING_SUBJECTS = [
  // Mathematics
  { value: "Algebra", label: "Algebra", category: "Mathematics" },
  { value: "Calculus", label: "Calculus", category: "Mathematics" },
  { value: "Geometry", label: "Geometry", category: "Mathematics" },
  { value: "Statistics", label: "Statistics", category: "Mathematics" },
  { value: "Multivariate Calculus", label: "Multivariate Calculus", category: "Mathematics" },
  { value: "Linear Algebra", label: "Linear Algebra", category: "Mathematics" },
  { value: "Competition Math", label: "Competition Math", category: "Mathematics" },
  
  // English
  { value: "Reading", label: "Reading", category: "English" },
  { value: "Writing", label: "Writing", category: "English" },
  { value: "Grammar", label: "Grammar", category: "English" },
  { value: "Literature", label: "Literature", category: "English" },
  
  // Social Science
  { value: "History", label: "History", category: "Social Science" },
  { value: "Economics", label: "Economics", category: "Social Science" },
  { value: "Psychology", label: "Psychology", category: "Social Science" },
  { value: "Sociology", label: "Sociology", category: "Social Science" },
  
  // Computer Science & Coding
  { value: "Java", label: "Java", category: "Computer Science & Coding" },
  { value: "C++", label: "C++", category: "Computer Science & Coding" },
  { value: "Competitive Coding", label: "Competitive Coding", category: "Computer Science & Coding" },
  { value: "Python", label: "Python", category: "Computer Science & Coding" },
  { value: "Scratch", label: "Scratch", category: "Computer Science & Coding" },
  
  // Science
  { value: "Physics", label: "Physics", category: "Science" },
  { value: "Biology", label: "Biology", category: "Science" },
  { value: "Chemistry", label: "Chemistry", category: "Science" },
  
  // Humanities
  { value: "Drama", label: "Drama", category: "Humanities" },
  { value: "Philosophy", label: "Philosophy", category: "Humanities" },
  { value: "Ethics", label: "Ethics", category: "Humanities" },
  { value: "Religious Studies", label: "Religious Studies", category: "Humanities" },
  
  // Standardized Tests
  { value: "SAT", label: "SAT", category: "Standardized Tests" },
  { value: "ACT", label: "ACT", category: "Standardized Tests" },
  { value: "GRE", label: "GRE", category: "Standardized Tests" },
  { value: "GMAT", label: "GMAT", category: "Standardized Tests" },
  { value: "LSAT", label: "LSAT", category: "Standardized Tests" },
  { value: "MCAT", label: "MCAT", category: "Standardized Tests" },
  
  // Languages
  { value: "Chinese", label: "Chinese", category: "Languages" },
  { value: "Japanese", label: "Japanese", category: "Languages" },
  { value: "Korean", label: "Korean", category: "Languages" },
  { value: "Spanish", label: "Spanish", category: "Languages" },
  { value: "French", label: "French", category: "Languages" },
  { value: "American Sign Language", label: "American Sign Language", category: "Languages" },
  { value: "German", label: "German", category: "Languages" },
  { value: "Latin", label: "Latin", category: "Languages" },
  { value: "Greek", label: "Greek", category: "Languages" },
  
  // Music & Arts
  { value: "Piano", label: "Piano", category: "Music & Arts" },
  { value: "Strings", label: "Strings", category: "Music & Arts" },
  { value: "Brass", label: "Brass", category: "Music & Arts" },
  { value: "Percussion", label: "Percussion", category: "Music & Arts" },
  { value: "Woodwinds", label: "Woodwinds", category: "Music & Arts" },
  { value: "Painting", label: "Painting", category: "Music & Arts" },
  { value: "Drawing", label: "Drawing", category: "Music & Arts" },
  { value: "Sculpture", label: "Sculpture", category: "Music & Arts" },
  
  // Counseling
  { value: "Academic Counseling", label: "Academic Counseling", category: "Counseling" },
  { value: "College Counseling", label: "College Counseling", category: "Counseling" },
  { value: "Mental Health Counseling", label: "Mental Health Counseling", category: "Counseling" },
  { value: "Career Counseling", label: "Career Counseling", category: "Counseling" },
  { value: "Family Counseling", label: "Family Counseling", category: "Counseling" },
];

// Summer Camp Categories
export const CAMP_CATEGORIES = [
  { value: "STEM", label: "STEM" },
  { value: "Leadership", label: "Leadership" },
  { value: "Arts & Performance", label: "Arts & Performance" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Language & Cultural Immersion", label: "Language & Cultural Immersion" },
  { value: "Pre-Professional", label: "Pre-Professional" },
  { value: "Outdoor & Adventure", label: "Outdoor & Adventure" },
  { value: "Wellness & Personal Development", label: "Wellness & Personal Development" },
];

// Summer Camp Tags
export const CAMP_TAGS = [
  { value: "Women Only", label: "Women Only" },
  { value: "Boys Only", label: "Boys Only" },
  { value: "Underrepresented Groups", label: "Underrepresented Groups" },
  { value: "Residential / Overnight", label: "Residential / Overnight" },
  { value: "Day Camp", label: "Day Camp" },
  { value: "Virtual / Online", label: "Virtual / Online" },
  { value: "Selective Admission", label: "Selective Admission" },
  { value: "Scholarship Available", label: "Scholarship Available" },
  { value: "University-Hosted", label: "University-Hosted" },
  { value: "Industry-Hosted", label: "Industry-Hosted" },
];

// Summer Camp Selectivity Levels
export const SELECTIVITY_LEVELS = [
  { value: 1, label: "Open Enrollment", color: "bg-green-500", description: "Anyone can enroll" },
  { value: 2, label: "Application-Based", color: "bg-yellow-500", description: "Simple application required" },
  { value: 3, label: "Competitive", color: "bg-orange-500", description: "Competitive selection process" },
  { value: 4, label: "Very Competitive", color: "bg-red-500", description: "Highly selective admission" },
];

// Internship Types
export const INTERNSHIP_TYPES = [
  { value: "Academic", label: "Academic" },
  { value: "STEM", label: "STEM" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Business & Marketing", label: "Business & Marketing" },
  { value: "Research", label: "Research" },
  { value: "Nonprofit & Social Impact", label: "Nonprofit & Social Impact" },
  { value: "Government", label: "Government" },
  { value: "Arts & Media", label: "Arts & Media" },
  { value: "Law & Policy", label: "Law & Policy" },
];

// Compensation Types
export const COMPENSATION_TYPES = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "Stipend", label: "Stipend" },
  { value: "Academic Credit", label: "Academic Credit" },
];

// Internship Duration Options
export const INTERNSHIP_DURATION_OPTIONS = [
  { value: "Summer", label: "Summer" },
  { value: "Academic Year", label: "Academic Year" },
  { value: "Semester", label: "Semester" },
  { value: "Part-time", label: "Part-time" },
  { value: "Full-time", label: "Full-time" },
];

// Delivery Mode Options
export const DELIVERY_MODE_OPTIONS = [
  { value: "In-person", label: "In-person" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
];

// Job Categories
export const JOB_CATEGORIES = [
  { value: "Retail & Customer Service", label: "Retail & Customer Service" },
  { value: "Food & Hospitality", label: "Food & Hospitality" },
  { value: "Office / Administrative Support", label: "Office / Administrative Support" },
  { value: "Education & Tutoring", label: "Education & Tutoring" },
  { value: "Tech & IT Support", label: "Tech & IT Support" },
  { value: "STEM-related Jobs", label: "STEM-related Jobs" },
  { value: "Childcare / Camp Jobs", label: "Childcare / Camp Jobs" },
  { value: "Healthcare Assistant Roles", label: "Healthcare Assistant Roles" },
  { value: "Creative & Design", label: "Creative & Design" },
  { value: "Freelance / Gig Work", label: "Freelance / Gig Work" },
  { value: "Government / Civic Jobs", label: "Government / Civic Jobs" },
  { value: "Nonprofit & Community Service", label: "Nonprofit & Community Service" },
];

// Job Compensation Types
export const JOB_COMPENSATION_TYPES = [
  { value: "Hourly Wage", label: "Hourly Wage" },
  { value: "Stipend", label: "Stipend" },
  { value: "Commission-based", label: "Commission-based" },
  { value: "Volunteer / Unpaid", label: "Volunteer / Unpaid" },
];

// Job Type Options
export const JOB_TYPE_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Temporary", label: "Temporary" },
];

// Salary Type Options
export const SALARY_TYPE_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// Schedule Options
export const SCHEDULE_OPTIONS = [
  { value: "Night shift", label: "Night shift" },
  { value: "Day shift", label: "Day shift" },
  { value: "Monday to Friday", label: "Monday to Friday" },
  { value: "Weekends", label: "Weekends" },
];

// US States
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];
