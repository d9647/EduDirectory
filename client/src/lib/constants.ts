// Tutoring Categories and Subjects
export const TUTORING_CATEGORIES = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Social Science", label: "Social Science" },
  { value: "Computer Science & Coding", label: "Computer Science & Coding" },
  { value: "Science", label: "Science" },
  { value: "Humanities", label: "Humanities" },
  { value: "Standardized Tests", label: "Standardized Tests" },
  { value: "Other Languages", label: "Other Languages" },
  { value: "Music & Arts", label: "Music & Arts" },
  { value: "Counseling", label: "Counseling" },
  { value: "Life Skills & Vocational Training", label: "Life Skills & Vocational Training" },
  { value: "Team Sports", label: "Team Sports" },
  { value: "Individual Sports", label: "Individual Sports" },
  { value: "Water Sports", label: "Water Sports" },
  { value: "Racquet Sports", label: "Racquet Sports" },
  { value: "Combat Sports", label: "Combat Sports" },
  { value: "Adventure & Outdoor", label: "Adventure & Outdoor" },
  { value: "Fitness & Conditioning", label: "Fitness & Conditioning" },
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
  { value: "SAT Prep", label: "SAT Prep", category: "Standardized Tests" },
  { value: "ACT Prep", label: "ACT Prep", category: "Standardized Tests" },
  { value: "GRE Prep", label: "GRE Prep", category: "Standardized Tests" },
  { value: "GMAT Prep", label: "GMAT Prep", category: "Standardized Tests" },
  { value: "LSAT Prep", label: "LSAT Prep", category: "Standardized Tests" },
  { value: "MCAT Prep", label: "MCAT Prep", category: "Standardized Tests" },
  { value: "ISEE Prep", label: "ISEE Prep", category: "Standardized Tests" },
  { value: "SSAT Prep", label: "SSAT Prep", category: "Standardized Tests" },
  { value: "PSAT Prep", label: "PSAT Prep", category: "Standardized Tests" },
  { value: "NMSQT Prep", label: "NMSQT Prep", category: "Standardized Tests" },
  { value: "AP Prep", label: "AP Prep", category: "Standardized Tests" },
  { value: "IB Prep", label: "IB Prep", category: "Standardized Tests" },
  
  // Languages
  { value: "Chinese", label: "Chinese", category: "Other Languages" },
  { value: "Japanese", label: "Japanese", category: "Other Languages" },
  { value: "Korean", label: "Korean", category: "Other Languages" },
  { value: "Spanish", label: "Spanish", category: "Other Languages" },
  { value: "French", label: "French", category: "Other Languages" },
  { value: "American Sign Language", label: "American Sign Language", category: "Other Languages" },
  { value: "German", label: "German", category: "Other Languages" },
  { value: "Latin", label: "Latin", category: "Other Languages" },
  { value: "Greek", label: "Greek", category: "Other Languages" },
  
  // Music & Arts
  { value: "Piano", label: "Piano", category: "Music & Arts" },
  { value: "Strings", label: "Strings", category: "Music & Arts" },
  { value: "Brass", label: "Brass", category: "Music & Arts" },
  { value: "Percussion", label: "Percussion", category: "Music & Arts" },
  { value: "Woodwinds", label: "Woodwinds", category: "Music & Arts" },

  // Instrument‑specific & vocal
  { value: "Guitar", label: "Guitar", category: "Music & Arts" },
  { value: "Ukulele", label: "Ukulele", category: "Music & Arts" },
  { value: "Harp", label: "Harp", category: "Music & Arts" },
  { value: "Voice & Vocal Training", label: "Voice & Vocal Training", category: "Music & Arts" },

  // Music creation & ensembles
  { value: "Music Theory", label: "Music Theory", category: "Music & Arts" },
  { value: "Composition & Songwriting", label: "Composition & Songwriting", category: "Music & Arts" },
  { value: "Digital Music Production", label: "Digital Music Production", category: "Music & Arts" },
  { value: "Recording & Audio Engineering", label: "Recording & Audio Engineering", category: "Music & Arts" },
  { value: "Choir & Ensemble", label: "Choir & Ensemble", category: "Music & Arts" },
  { value: "Band & Orchestra", label: "Band & Orchestra", category: "Music & Arts" },

  // Performing arts
  { value: "Acting & Drama", label: "Acting & Drama", category: "Music & Arts" },
  { value: "Musical Theatre", label: "Musical Theatre", category: "Music & Arts" },
  { value: "Dance (Ballet, Jazz, Hip‑Hop)", label: "Dance (Ballet, Jazz, Hip‑Hop)", category: "Music & Arts" },

  // Visual & digital arts
  { value: "Painting", label: "Painting", category: "Music & Arts" },
  { value: "Drawing", label: "Drawing", category: "Music & Arts" },
  { value: "Sculpture", label: "Sculpture", category: "Music & Arts" },
  { value: "Photography", label: "Photography", category: "Music & Arts" },
  { value: "Film & Video Production", label: "Film & Video Production", category: "Music & Arts" },
  { value: "Graphic Design", label: "Graphic Design", category: "Music & Arts" },
  { value: "Digital Illustration", label: "Digital Illustration", category: "Music & Arts" },
  { value: "Animation & 3D Modeling", label: "Animation & 3D Modeling", category: "Music & Arts" },

  // Crafts & specialty arts
  { value: "Ceramics & Pottery", label: "Ceramics & Pottery", category: "Music & Arts" },
  { value: "Printmaking", label: "Printmaking", category: "Music & Arts" },
  { value: "Textile & Fiber Arts", label: "Textile & Fiber Arts", category: "Music & Arts" },
  { value: "Calligraphy", label: "Calligraphy", category: "Music & Arts" },
  { value: "Art History & Appreciation", label: "Art History & Appreciation", category: "Music & Arts" },
  
  // Counseling
  { value: "Academic Counseling", label: "Academic Counseling", category: "Counseling" },
  { value: "College Counseling", label: "College Counseling", category: "Counseling" },
  { value: "College Essay Help", label: "College Essay Help", category: "Counseling" },
  { value: "Mental Health Counseling", label: "Mental Health Counseling", category: "Counseling" },
  { value: "Career Counseling", label: "Career Counseling", category: "Counseling" },
  { value: "Family Counseling", label: "Family Counseling", category: "Counseling" },

  // Life Skills & Vocational Training
  { value: "Driving Lessons", label: "Driving Lessons", category: "Life Skills & Vocational Training" },
  { value: "Culinary Skills", label: "Culinary Skills", category: "Life Skills & Vocational Training" },
  { value: "Sewing & Tailoring", label: "Sewing & Tailoring", category: "Life Skills & Vocational Training" },
  { value: "Home Maintenance", label: "Home Maintenance", category: "Life Skills & Vocational Training" },
  { value: "Financial Literacy", label: "Financial Literacy", category: "Life Skills & Vocational Training" },
  { value: "Personal Safety & First Aid", label: "Personal Safety & First Aid", category: "Life Skills & Vocational Training" },
  { value: "Gardening & Sustainability", label: "Gardening & Sustainability", category: "Life Skills & Vocational Training" },
  { value: "Fashion & Beauty", label: "Fashion & Beauty", category: "Life Skills & Vocational Training" },

  // Team Sports
  { value: "Basketball", label: "Basketball", category: "Team Sports" },
  { value: "Soccer", label: "Soccer", category: "Team Sports" },
  { value: "Baseball", label: "Baseball", category: "Team Sports" },
  { value: "Volleyball", label: "Volleyball", category: "Team Sports" },
  { value: "Football", label: "Football", category: "Team Sports" },
  { value: "Hockey", label: "Hockey", category: "Team Sports" },

  // Individual Sports
  { value: "Track & Field", label: "Track & Field", category: "Individual Sports" },
  { value: "Gymnastics", label: "Gymnastics", category: "Individual Sports" },
  { value: "Golf", label: "Golf", category: "Individual Sports" },
  { value: "Bowling", label: "Bowling", category: "Individual Sports" },

  // Water Sports
  { value: "Swimming", label: "Swimming", category: "Water Sports" },
  { value: "Surfing", label: "Surfing", category: "Water Sports" },
  { value: "Rowing", label: "Rowing", category: "Water Sports" },
  { value: "Sailing", label: "Sailing", category: "Water Sports" },

  // Racquet Sports
  { value: "Tennis", label: "Tennis", category: "Racquet Sports" },
  { value: "Badminton", label: "Badminton", category: "Racquet Sports" },
  { value: "Table Tennis", label: "Table Tennis", category: "Racquet Sports" },
  { value: "Squash", label: "Squash", category: "Racquet Sports" },

  // Combat Sports
  { value: "Karate", label: "Karate", category: "Combat Sports" },
  { value: "Judo", label: "Judo", category: "Combat Sports" },
  { value: "Taekwondo", label: "Taekwondo", category: "Combat Sports" },
  { value: "Boxing", label: "Boxing", category: "Combat Sports" },
  { value: "Wrestling", label: "Wrestling", category: "Combat Sports" },

  // Adventure & Outdoor
  { value: "Rock Climbing", label: "Rock Climbing", category: "Adventure & Outdoor" },
  { value: "Hiking", label: "Hiking", category: "Adventure & Outdoor" },
  { value: "Mountain Biking", label: "Mountain Biking", category: "Adventure & Outdoor" },
  { value: "Camping Skills", label: "Camping Skills", category: "Adventure & Outdoor" },

  // Fitness & Conditioning
  { value: "Yoga", label: "Yoga", category: "Fitness & Conditioning" },
  { value: "Pilates", label: "Pilates", category: "Fitness & Conditioning" },
  { value: "Weight Training", label: "Weight Training", category: "Fitness & Conditioning" },
  { value: "Aerobics", label: "Aerobics", category: "Fitness & Conditioning" },

];

// Summer Camp Categories
export const CAMP_CATEGORIES = [
  { value: "STEM", label: "STEM" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Medicine & Health Science", label: "Medicine & Health Science" },
  { value: "Leadership", label: "Leadership" },
  { value: "Engineering", label: "Engineering" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Law & Government", label: "Law & Government" },
  { value: "Humanities & Social Sciences", label: "Humanities & Social Sciences" },
  { value: "Language & Cultural Immersion", label: "Language & Cultural Immersion" },
  { value: "Pre-Professional", label: "Pre-Professional" },
  { value: "College Prep & Test Prep", label: "College Prep & Test Prep" },
  { value: "Entrepreneurship & Business", label: "Entrepreneurship & Business" },
  { value: "Visual Arts", label: "Visual Arts" },
  { value: "Performing Arts", label: "Performing Arts" },
  { value: "Music", label: "Music" },
  { value: "Sports & Athletics", label: "Sports & Athletics" },
  { value: "Outdoor & Adventure", label: "Outdoor & Adventure" },
  { value: "Environmental & Sustainability", label: "Environmental & Sustainability" },
  { value: "Wellness & Personal Development", label: "Wellness & Personal Development" },
  { value: "Community Service", label: "Community Service" },
  { value: "Special Needs & Inclusive", label: "Special Needs & Inclusive" },
  { value: "Faith-Based", label: "Faith-Based" },
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

// Summer Camp Cost Options
export const CAMP_COST_OPTIONS = [
  { value: "FREE", label: "FREE" },
  { value: "< $1000", label: "< $1000" },
  { value: "$1000 - $3000", label: "$1000 - $3000" },
  { value: "$3000 - $5000", label: "$3000 - $5000" },
  { value: "$5000 - $6500", label: "$5000 - $6500" },
  { value: "$6500 - $8000", label: "$6500 - $8000" },
  { value: "> $8000", label: "> $8000" },
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

// Event Age Range Options
export const AGE_RANGE_OPTIONS = [
  { value: "6-10", label: "6-10" },
  { value: "11-13", label: "11-13" },
  { value: "14-18", label: "14-18" },
  { value: "18+", label: "18+" },
  { value: "All ages", label: "All ages" },
];

// Event Category Options
export const EVENT_CATEGORIES = [
  { value: "Academic", label: "Academic" },
  { value: "STEM", label: "STEM" },
  { value: "Arts & Culture", label: "Arts & Culture" },
  { value: "Sports & Recreation", label: "Sports & Recreation" },
  { value: "Community Service", label: "Community Service" },
  { value: "Leadership", label: "Leadership" },
  { value: "College & Career", label: "College & Career" },
  { value: "Social & Networking", label: "Social & Networking" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Technology", label: "Technology" },
];

// Event Target Audience Options
export const TARGET_AUDIENCE_OPTIONS = [
  { value: "Middle School", label: "Middle School" },
  { value: "High School", label: "High School" },
  { value: "College Students", label: "College Students" },
  { value: "Young Adults", label: "Young Adults" },
  { value: "All Students", label: "All Students" },
];

// Service Categories
export const SERVICE_CATEGORIES = [
  { value: "One-time Sitter", label: "One-time Sitter" },
  { value: "Nanny & Au Pair", label: "Nanny & Au Pair" },
  { value: "After-School Care", label: "After-School Care" },
  { value: "Transportation", label: "Transportation" },
  { value: "Special Needs Care", label: "Special Needs Care" },
  { value: "Family Support", label: "Family Support" },
  { value: "Home Support", label: "Home Support" },
];

// Service Tags
export const SERVICE_TAGS = [
  { value: "Babysitter", label: "Babysitter" },
  { value: "Nanny", label: "Nanny" },
  { value: "Infant (0-1)", label: "Infant (0-1)" },
  { value: "Toddler (1-3)", label: "Toddler (1-3)" },
  { value: "Preschool", label: "Preschool" },
  { value: "Elementary", label: "Elementary" },
  { value: "Teen", label: "Teen" },
  { value: "Petsitter - Dog", label: "Petsitter - Dog" },
  { value: "Petsitter - Cat", label: "Petsitter - Cat" },
  { value: "CPR certified", label: "CPR certified" },
  { value: "Multilingual", label: "Multilingual" },
];

// Service Business Types
export const SERVICE_BUSINESS_TYPES = [
  { value: "", label: "All Providers" },
  { value: "individual", label: "Individual / Private" },
  { value: "company", label: "Company / Agency" },
];
