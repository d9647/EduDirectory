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
  applicationDueDate: date("application_due_date"),
  applicationDeadline: date("application_deadline"),
  applicationAvailable: boolean("application_available").default(true),
  minimumAge: integer("minimum_age"),
  hasScholarship: boolean("has_scholarship").default(false),
  eligibility: text("eligibility"),
  description: text("description"),
  deliveryMode: text("delivery_mode").array(), // In-person, Remote, Hybrid (multiple selection)
  website: varchar("website"),
  photoUrl: varchar("photo_url"),
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
  applicationLink: varchar("application_link"),
  hasTraining: boolean("has_training").default(false),
  hasAdvancement: boolean("has_advancement").default(false),
  requiresTransportation: boolean("requires_transportation").default(false),
  requiresResume: boolean("requires_resume").default(false),
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

// Forum Posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: varchar("category", { length: 100 }), // General, Questions, Resources, etc.
  isSticky: boolean("is_sticky").default(false),
  isLocked: boolean("is_locked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum Replies
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
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

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  isSticky: true,
  isLocked: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
export type Review = typeof reviews.$inferSelect;
export type ThumbsUp = typeof thumbsUp.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;
export type ForumReply = typeof forumReplies.$inferSelect;

export type InsertTutoringProvider = z.infer<typeof insertTutoringProviderSchema>;
export type InsertSummerCamp = z.infer<typeof insertSummerCampSchema>;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
