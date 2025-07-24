import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  date,
  time,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  location: varchar("location"),
  phone: varchar("phone"),
  schoolName: varchar("school_name"),
  grade: varchar("grade"),
  address: varchar("address"),
  role: varchar("role", { length: 20 }).default("user").notNull(), // "admin" or "user"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tutoring Providers / Business Services
export const tutoringProviders = pgTable("tutoring_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "private_tutor" or "business"
  description: text("description"),
  website: varchar("website"),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  zipcode: varchar("zipcode"),
  categories: text("categories").array(), // Mathematics, English, etc.
  subjects: text("subjects").array(), // Algebra, SAT Prep, etc.
  deliveryMode: text("delivery_mode").array(), // In-person, Remote, Hybrid (multiple selection)
  photoUrl: varchar("photo_url"),
  viewCount: integer("view_count").default(0),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Summer Camps
export const summerCamps = pgTable("summer_camps", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location"),
  address: varchar("address", { length: 255 }),
  city: varchar("city"),
  state: varchar("state"),
  zipcode: varchar("zipcode"),
  categories: text("categories").array(), // STEM, Leadership, etc.
  tags: text("tags").array(), // Women Only, Boys Only, etc.
  selectivityLevel: integer("selectivity_level"), // 1-4 (Open Enrollment to Very Competitive)
  dates: text("dates"), // Text field for multiple sessions
  length: varchar("length", { length: 100 }),
  costRange: varchar("cost_range", { length: 50 }), // Cost range dropdown values
  applicationOpen: date("application_open"),
  applicationDeadline: date("application_deadline"),
  applicationAvailable: boolean("application_available").default(true),
  minimumAge: integer("minimum_age"),
  hasScholarship: boolean("has_scholarship").default(false),
  eligibility: text("eligibility"),
  description: text("description"),
  deliveryMode: text("delivery_mode").array(), // In-person, Remote, Hybrid (multiple selection)
  website: varchar("website"),
  photoUrl: varchar("photo_url"),
  viewCount: integer("view_count").default(0),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Internships
export const internships = pgTable("internships", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location"),
  address: varchar("address", { length: 255 }),
  city: varchar("city"),
  state: varchar("state"),
  zipcode: varchar("zipcode"),
  isRemote: boolean("is_remote").default(false),
  types: text("types").array(), // Academic, STEM, Healthcare, etc.
  selectivityLevel: integer("selectivity_level"), // 1-4 (Open Enrollment to Very Competitive)
  compensation: varchar("compensation"), // Paid, Unpaid, Stipend, Academic Credit
  description: text("description"),
  duration: text("duration").array(), // Summer, Academic Year, Semester, Part-time, Full-time
  internshipDates: text("internship_dates"), // Specific dates field from form
  length: varchar("length", { length: 100 }), // Length field from form (e.g., "10 weeks", "3 months")
  deliveryMode: text("delivery_mode").array(), // In-person, Remote, Hybrid (multiple selection)
  minimumAge: integer("minimum_age"),
  applicationOpen: date("application_open"),
  applicationDeadline: date("application_deadline"),
  prerequisites: text("prerequisites"),
  tuition: varchar("tuition"),
  eligibility: text("eligibility"),
  website: varchar("website"),
  hasMentorship: boolean("has_mentorship").default(false),
  viewCount: integer("view_count").default(0),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  photoUrl: varchar("photo_url")
});

// Jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  location: varchar("location"),
  address: varchar("address", { length: 255 }),
  city: varchar("city"),
  state: varchar("state"),
  zipcode: varchar("zipcode"),
  isRemote: boolean("is_remote").default(false),
  categories: text("categories").array(), // Retail & Customer Service, etc.
  compensation: varchar("compensation"), // Hourly Wage, Stipend, etc.
  compensationRange: varchar("compensation_range"),
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  salaryType: varchar("salary_type"), // hourly, monthly, yearly
  jobType: text("job_type").array(), // Full-time, Part-time, Temporary (multiple selection)
  description: text("description"),
  workSchedule: text("work_schedule"),
  schedule: text("schedule").array(), // Night shift, Day shift, Monday to Friday, Weekends
  minimumAge: integer("minimum_age"),
  openingDate: date("opening_date"),
  closingDate: date("closing_date"),
  isOngoing: boolean("is_ongoing").default(false),
  applicationDeadline: date("application_deadline"),
  eligibility: text("eligibility"),
  website: varchar("website"),
  hasTraining: boolean("has_training").default(false),
  hasAdvancement: boolean("has_advancement").default(false),
  requiresTransportation: boolean("requires_transportation").default(false),
  requiresResume: boolean("requires_resume").default(false),
  viewCount: integer("view_count").default(0),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  photoUrl: varchar("photo_url")
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  listingType: varchar("listing_type").notNull(), // "tutoring", "camp", "internship", "job"
  listingId: integer("listing_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  rating: integer("rating").notNull(), // 1-5
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Thumbs Up
export const thumbsUp = pgTable("thumbs_up", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  listingType: varchar("listing_type").notNull(),
  listingId: integer("listing_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookmarks
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  listingType: varchar("listing_type").notNull(),
  listingId: integer("listing_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  reportType: varchar("report_type").notNull(), // "listing" or "review"
  itemType: varchar("item_type").notNull(), // "tutoring", "camp", etc.
  itemId: integer("item_id").notNull(),
  reason: text("reason"),
  description: text("description"),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// View Tracking - to prevent rapid view count increments from same user
export const viewTracking = pgTable("view_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  listingType: varchar("listing_type").notNull(), // "tutoring", "camp", "internship", "job", "event"
  listingId: integer("listing_id").notNull(),
  lastViewedAt: timestamp("last_viewed_at").defaultNow(),
}, (table) => [
  uniqueIndex("unique_view_tracking_user_listing").on(table.userId, table.listingType, table.listingId),
]);

// Community Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  organizer: varchar("organizer", { length: 255 }).notNull(),
  organizerEmail: varchar("organizer_email"),
  organizerPhone: varchar("organizer_phone"),
  eventDate: date("event_date").notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),
  venue: varchar("venue", { length: 255 }),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  zipcode: varchar("zipcode"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }), // For map integration
  longitude: decimal("longitude", { precision: 11, scale: 8 }), // For map integration
  categories: text("categories").array(), // Academic, Sports, Arts, Community Service, etc.
  targetAudience: text("target_audience").array(), // High School, College, Young Adults
  ageRange: varchar("age_range"), // "14-18", "18-25", "All ages"
  cost: varchar("cost"), // "Free", "$10", "$25-50"
  registrationRequired: boolean("registration_required").default(false),
  registrationLink: varchar("registration_link"),
  photoUrl: varchar("photo_url"), // Event poster/flyer image
  contactInfo: text("contact_info"),
  specialInstructions: text("special_instructions"),
  viewCount: integer("view_count").default(0),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});




// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  thumbsUp: many(thumbsUp),
  bookmarks: many(bookmarks),
  reports: many(reports),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const thumbsUpRelations = relations(thumbsUp, ({ one }) => ({
  user: one(users, {
    fields: [thumbsUp.userId],
    references: [users.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertTutoringProviderSchema = createInsertSchema(tutoringProviders).omit({
  id: true,
  isApproved: true,
  submittedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSummerCampSchema = createInsertSchema(summerCamps).omit({
  id: true,
  isApproved: true,
  submittedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInternshipSchema = createInsertSchema(internships).omit({
  id: true,
  isApproved: true,
  submittedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  isApproved: true,
  submittedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  isApproved: true,
  submittedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  eventDate: z.string(), // HTML date input sends strings
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  isResolved: true,
  createdAt: true,
});



export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateUserProfileSchema = createInsertSchema(users).omit({
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type TutoringProvider = typeof tutoringProviders.$inferSelect;
export type SummerCamp = typeof summerCamps.$inferSelect;
export type Internship = typeof internships.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type ThumbsUp = typeof thumbsUp.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Report = typeof reports.$inferSelect;


export type InsertTutoringProvider = z.infer<typeof insertTutoringProviderSchema>;
export type InsertSummerCamp = z.infer<typeof insertSummerCampSchema>;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;

