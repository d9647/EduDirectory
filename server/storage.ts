import {
  users,
  tutoringProviders,
  summerCamps,
  internships,
  jobs,
  services,
  events,
  reviews,
  thumbsUp,
  bookmarks,
  reports,
  viewTracking,
  type User,
  type UpsertUser,
  type TutoringProvider,
  type InsertTutoringProvider,
  type SummerCamp,
  type InsertSummerCamp,
  type Internship,
  type InsertInternship,
  type Job,
  type InsertJob,
  type Service,
  type InsertService,
  type Event,
  type InsertEvent,
  type Review,
  type InsertReview,
  type ThumbsUp,
  type Bookmark,
  type Report,
  type InsertReport,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, sql, count, desc, asc, ilike } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profileData: Partial<User>): Promise<User>;

  // User role management
  updateUserRole(id: string, role: "admin" | "user"): Promise<User>;
  getUserRole(id: string): Promise<string | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersWithPagination(page: number, limit: number, search?: string): Promise<{ users: User[]; total: number; totalPages: number; currentPage: number }>;
  
  // User contribution tracking
  getUserContributionStats(userId: string): Promise<{ listingsCount: number; reviewsCount: number }>;

  // Tutoring Providers
  getTutoringProviders(filters?: {
    search?: string;
    categories?: string[];
    subjects?: string[];
    type?: string;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ providers: TutoringProvider[]; total: number }>;
  getTutoringProvider(id: number): Promise<TutoringProvider | undefined>;
  createTutoringProvider(provider: InsertTutoringProvider): Promise<TutoringProvider>;
  updateTutoringProvider(id: number, provider: Partial<InsertTutoringProvider>): Promise<TutoringProvider>;
  approveTutoringProvider(id: number): Promise<void>;
  deleteTutoringProvider(id: number): Promise<void>;

  // Summer Camps
  getSummerCamps(filters?: {
    search?: string;
    categories?: string[];
    tags?: string[];
    selectivityLevel?: number[];
    cost?: string[];
    city?: string;
    state?: string;
    hasScholarship?: boolean;
    applicationAvailable?: boolean;
    minimumAge?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ camps: SummerCamp[]; total: number }>;
  getSummerCamp(id: number): Promise<SummerCamp | undefined>;
  createSummerCamp(camp: InsertSummerCamp): Promise<SummerCamp>;
  updateSummerCamp(id: number, camp: Partial<InsertSummerCamp>): Promise<SummerCamp>;
  approveSummerCamp(id: number): Promise<void>;
  deleteSummerCamp(id: number): Promise<void>;

  // Internships
  getInternships(filters?: {
    search?: string;
    types?: string[];
    compensation?: string[];
    city?: string;
    state?: string;
    isRemote?: boolean;
    hasMentorship?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ internships: Internship[]; total: number }>;
  getInternship(id: number): Promise<Internship | undefined>;
  createInternship(internship: InsertInternship): Promise<Internship>;
  updateInternship(id: number, internship: Partial<InsertInternship>): Promise<Internship>;
  approveInternship(id: number): Promise<void>;
  deleteInternship(id: number): Promise<void>;

  // Jobs
  getJobs(filters?: {
    search?: string;
    categories?: string[];
    compensation?: string[];
    city?: string;
    state?: string;
    isRemote?: boolean;
    minimumAge?: number;
    hasTraining?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ jobs: Job[]; total: number }>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  approveJob(id: number): Promise<void>;
  deleteJob(id: number): Promise<void>;

  // Services
  getServices(filters?: {
    search?: string;
    categories?: string[];
    tags?: string[];
    type?: string;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ services: Service[]; total: number }>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  approveService(id: number): Promise<void>;
  deleteService(id: number): Promise<void>;

  // Events
  getEvents(filters?: {
    search?: string;
    categories?: string[];
    targetAudience?: string[];
    eventDate?: string;
    dateRange?: { start: string; end: string };
    city?: string;
    state?: string;
    zipcode?: string;
    distance?: number; // miles from zipcode
    cost?: string[];
    registrationRequired?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ events: Event[]; total: number }>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  approveEvent(id: number): Promise<void>;
  deleteEvent(id: number): Promise<void>;

  // Reviews
  getReviews(listingType: string, listingId: number): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: number, userId: string): Promise<void>;

  // Thumbs Up
  toggleThumbsUp(userId: string, listingType: string, listingId: number): Promise<boolean>;
  getThumbsUpCount(listingType: string, listingId: number): Promise<number>;
  hasUserThumbedUp(userId: string, listingType: string, listingId: number): Promise<boolean>;

  // Bookmarks
  toggleBookmark(userId: string, listingType: string, listingId: number): Promise<boolean>;
  getUserBookmarks(userId: string, options?: { limit?: number; offset?: number }): Promise<{ bookmarks: any[]; total: number }>;
  hasUserBookmarked(userId: string, listingType: string, listingId: number): Promise<boolean>;

  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReports(): Promise<Report[]>;
  resolveReport(id: number): Promise<void>;

  // View Tracking
  trackView(tableName: string, listingId: number, userId: string | null, clientIp: string): Promise<{ wasTracked: boolean }>;

  // Admin
  getPendingApprovals(): Promise<{
    tutoringProviders: TutoringProvider[];
    summerCamps: SummerCamp[];
    internships: Internship[];
    jobs: Job[];
    services: Service[];
    events: Event[];
  }>;
  getLiveListings(): Promise<{
    tutoringProviders: TutoringProvider[];
    summerCamps: SummerCamp[];
    internships: Internship[];
    jobs: Job[];
    services: Service[];
    events: Event[];
  }>;
  searchListings(type: string, query: string): Promise<any[]>;
  deactivateListing(type: string, id: number): Promise<void>;
  activateListing(type: string, id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        role: userData.role || "user", // Default to "user" role
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          location: userData.location,
          phone: userData.phone,
          // Don't update role on existing users to prevent overriding admin status
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User role management methods
  async updateUserRole(id: string, role: "admin" | "user"): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  async getUserRole(id: string): Promise<string | undefined> {
    const user = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user[0]?.role;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));

    return allUsers;
  }

  async getUsersWithPagination(page: number, limit: number, search?: string): Promise<{ users: User[]; total: number; totalPages: number; currentPage: number }> {
    const offset = (page - 1) * limit;
    
    // Build base query with search conditions
    let query = db.select().from(users);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(users);
    
    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      const searchCondition = or(
        ilike(users.email, searchTerm),
        ilike(users.firstName, searchTerm),
        ilike(users.lastName, searchTerm),
        ilike(users.location, searchTerm),
        ilike(users.schoolName, searchTerm)
      );
      
      query = query.where(searchCondition);
      countQuery = countQuery.where(searchCondition);
    }
    
    // Execute queries
    const [userResults, countResults] = await Promise.all([
      query
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      countQuery
    ]);
    
    const total = countResults[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);
    
    return {
      users: userResults,
      total,
      totalPages,
      currentPage: page
    };
  }

  async updateUserProfile(id: string, profileData: Partial<User>): Promise<User> {
    const allowedFields = [
      'firstName', 'lastName', 'nickname', 'phone', 'location', 
      'schoolName', 'grade', 'address', 'profileImageUrl'
    ];

    // Filter out non-allowed fields and undefined values
    const updateData = Object.keys(profileData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        if (profileData[key] !== undefined) {
          obj[key] = profileData[key];
        }
        return obj;
      }, {} as any);

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // If nickname was updated, cascade the change to all reviews and listings
    if (profileData.nickname !== undefined) {
      await this.updateUserNicknameInReviewsAndListings(id, updatedUser.nickname, updatedUser.firstName, updatedUser.lastName);
    }

    return updatedUser;
  }

  // Helper method to update nickname in all user's reviews and listings
  private async updateUserNicknameInReviewsAndListings(userId: string, nickname: string | null, firstName: string | null, lastName: string | null): Promise<void> {
    try {
      // Update reviews - Note: reviews don't store denormalized user data, they join with users table
      // So nickname updates will automatically reflect in reviews through the JOIN in getReviews()
      
      // Update tutoring providers
      await db.execute(sql`
        UPDATE tutoring_providers 
        SET contributor_nickname = ${nickname},
            contributor_first_name = ${firstName},
            contributor_last_name = ${lastName}
        WHERE user_id = ${userId}
      `);

      // Update summer camps
      await db.execute(sql`
        UPDATE summer_camps 
        SET contributor_nickname = ${nickname},
            contributor_first_name = ${firstName},
            contributor_last_name = ${lastName}
        WHERE user_id = ${userId}
      `);

      // Update internships
      await db.execute(sql`
        UPDATE internships 
        SET contributor_nickname = ${nickname},
            contributor_first_name = ${firstName},
            contributor_last_name = ${lastName}
        WHERE user_id = ${userId}
      `);

      // Update jobs
      await db.execute(sql`
        UPDATE jobs 
        SET contributor_nickname = ${nickname},
            contributor_first_name = ${firstName},
            contributor_last_name = ${lastName}
        WHERE user_id = ${userId}
      `);

      console.log(`Successfully updated nickname for user ${userId} across all listings`);
    } catch (error) {
      console.error("Error updating nickname in reviews and listings:", error);
      throw error;
    }
  }

  // User contribution tracking
  async getUserContributionStats(userId: string): Promise<{ listingsCount: number; reviewsCount: number }> {
    // Count reviews by user
    const reviewsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.userId, userId));

    // Count listings by user across all listing types
    const tutoringCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(tutoringProviders)
      .where(eq(tutoringProviders.userId, userId));

    const campsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(summerCamps)
      .where(eq(summerCamps.userId, userId));

    const internshipsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(internships)
      .where(eq(internships.userId, userId));

    const jobsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(eq(jobs.userId, userId));

    const listingsCount = parseInt(String(tutoringCount[0]?.count || 0)) + 
                         parseInt(String(campsCount[0]?.count || 0)) + 
                         parseInt(String(internshipsCount[0]?.count || 0)) + 
                         parseInt(String(jobsCount[0]?.count || 0));

    const reviewsCount = parseInt(String(reviewsResult[0]?.count || 0));

    return {
      listingsCount,
      reviewsCount
    };
  }

  // Tutoring Providers
  async getTutoringProviders(filters: {
    search?: string;
    categories?: string[];
    subjects?: string[];
    type?: string;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  } = {}): Promise<{ providers: TutoringProvider[]; total: number }> {
    // Build filters
    const conditions = [eq(tutoringProviders.isApproved, true), eq(tutoringProviders.isActive, true)];

    if (filters.search) {
      conditions.push(
        sql`(${tutoringProviders.name} ILIKE ${`%${filters.search}%`} OR ${tutoringProviders.description} ILIKE ${`%${filters.search}%`})`
      );
    }

    if (filters.categories?.length) {
      conditions.push(sql`${tutoringProviders.categories} && ARRAY[${sql.join(filters.categories.map(cat => sql`${cat}`), sql`, `)}]::text[]`);
    }

    if (filters.subjects?.length) {
      for (const subj of filters.subjects) {
        conditions.push(sql`EXISTS (
          SELECT 1 FROM unnest(${tutoringProviders.subjects}) AS s
          WHERE LOWER(s) LIKE '%' || LOWER(${subj}) || '%'
        )`);
      }
    }

    if (filters.type) {
      conditions.push(eq(tutoringProviders.type, filters.type));
    }

    if (filters.city) {
      conditions.push(ilike(tutoringProviders.city, `%${filters.city}%`));
    }

    if (filters.state) {
      conditions.push(eq(tutoringProviders.state, filters.state));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Build sorting
    let orderBy = desc(tutoringProviders.createdAt);
    if (filters.sortBy) {
      const order = filters.sortOrder === "desc" ? desc : asc;
      switch (filters.sortBy) {
        case "name":
          orderBy = order(tutoringProviders.name);
          break;
        case "createdAt":
          orderBy = order(tutoringProviders.createdAt);
          break;
        case "thumbsUp":
          orderBy = order(sql`(
            SELECT COUNT(*)
            FROM ${thumbsUp}
            WHERE ${thumbsUp.listingType} = 'tutoring'
              AND ${thumbsUp.listingId} = ${tutoringProviders.id}
          )`);
          break;
        case "rating":
          orderBy = order(sql`(
            SELECT AVG(rating)
            FROM ${reviews}
            WHERE ${reviews.listingType} = 'tutoring'
              AND ${reviews.listingId} = ${tutoringProviders.id}
          )`);
          break;
        case "viewCount":
          orderBy = order(tutoringProviders.viewCount);
          break;
        default:
          orderBy = desc(tutoringProviders.createdAt);
      }
    }

    // Execute main query with thumbs up count
    const mainQuery = db.select({
      id: tutoringProviders.id,
      name: tutoringProviders.name,
      type: tutoringProviders.type,
      description: tutoringProviders.description,
      website: tutoringProviders.website,
      phone: tutoringProviders.phone,
      email: tutoringProviders.email,
      address: tutoringProviders.address,
      city: tutoringProviders.city,
      state: tutoringProviders.state,
      zipcode: tutoringProviders.zipcode,
      categories: tutoringProviders.categories,
      subjects: tutoringProviders.subjects,
      deliveryMode: tutoringProviders.deliveryMode,
      photoUrl: tutoringProviders.photoUrl,
      // Contributor information
      userId: tutoringProviders.userId,
      contributorNickname: tutoringProviders.contributorNickname,
      contributorFirstName: tutoringProviders.contributorFirstName,
      contributorLastName: tutoringProviders.contributorLastName,
      isApproved: tutoringProviders.isApproved,
      submittedAt: tutoringProviders.submittedAt,
      approvedAt: tutoringProviders.approvedAt,
      createdAt: tutoringProviders.createdAt,
      updatedAt: tutoringProviders.updatedAt,
      viewCount: tutoringProviders.viewCount,
      thumbsUpCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'tutoring' AND listing_id = tutoring_providers.id), 0) AS INTEGER)`,
      averageRating: sql<number>`CAST(COALESCE((SELECT AVG(rating::NUMERIC) FROM reviews WHERE listing_type = 'tutoring' AND listing_id = tutoring_providers.id), 0) AS NUMERIC(3,1))`,
      reviewCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM reviews WHERE listing_type = 'tutoring' AND listing_id = tutoring_providers.id), 0) AS INTEGER)`
    }).from(tutoringProviders);
    const providersQuery = whereClause 
      ? mainQuery.where(whereClause)
      : mainQuery;

    const providers = await providersQuery
      .orderBy(orderBy)
      .limit(filters.limit || 5)
      .offset(filters.offset || 0);

    // Execute count query
    const countQuery = db.select({ count: count() }).from(tutoringProviders);
    const totalQuery = whereClause 
      ? countQuery.where(whereClause)
      : countQuery;

    const totalResult = await totalQuery;

    return {
      providers,
      total: totalResult[0]?.count || 0
    };
  }

  async getTutoringProvider(id: number): Promise<TutoringProvider | undefined> {
    const [provider] = await db.select().from(tutoringProviders).where(eq(tutoringProviders.id, id));
    return provider;
  }

  async createTutoringProvider(provider: InsertTutoringProvider): Promise<TutoringProvider> {
    const [newProvider] = await db.insert(tutoringProviders).values(provider).returning();
    return newProvider;
  }

  async updateTutoringProvider(id: number, provider: Partial<InsertTutoringProvider>): Promise<TutoringProvider> {
    const [updatedProvider] = await db
      .update(tutoringProviders)
      .set(provider)
      .where(eq(tutoringProviders.id, id))
      .returning();
    return updatedProvider;
  }

  async approveTutoringProvider(id: number): Promise<void> {
    await db
      .update(tutoringProviders)
      .set({ isApproved: true, approvedAt: new Date() })
      .where(eq(tutoringProviders.id, id));
  }

  async deleteTutoringProvider(id: number): Promise<void> {
    await db
      .delete(tutoringProviders)
      .where(eq(tutoringProviders.id, id));
  }

  // Summer Camps
  async getSummerCamps(filters: {
    search?: string;
    categories?: string[];
    tags?: string[];
    selectivityLevel?: number[];
    cost?: string[];
    city?: string;
    state?: string;
    hasScholarship?: boolean;
    applicationAvailable?: boolean;
    minimumAge?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  } = {}): Promise<{ camps: SummerCamp[]; total: number }> {
    // Build filters
    const conditions = [eq(summerCamps.isApproved, true), eq(summerCamps.isActive, true)];

    if (filters.search) {
      conditions.push(
        sql`(${summerCamps.name} ILIKE ${`%${filters.search}%`} OR ${summerCamps.description} ILIKE ${`%${filters.search}%`})`
      );
    }

    if (filters.categories?.length) {
      conditions.push(sql`${summerCamps.categories} && ARRAY[${sql.join(filters.categories.map(cat => sql`${cat}`), sql`, `)}]::text[]`);
    }

    if (filters.tags?.length) {
      conditions.push(sql`${summerCamps.tags} && ARRAY[${sql.join(filters.tags.map(tag => sql`${tag}`), sql`, `)}]::text[]`);
    }

    if (filters.selectivityLevel?.length) {
      conditions.push(sql`${summerCamps.selectivityLevel} = ANY(ARRAY[${sql.join(filters.selectivityLevel.map(level => sql`${level}`), sql`, `)}]::integer[])`);
    }

    if (filters.cost?.length) {
      // Handle "Not specified" filter separately
      const hasNotSpecified = filters.cost.includes("Not specified");
      const otherCosts = filters.cost.filter(cost => cost !== "Not specified");

      if (hasNotSpecified && otherCosts.length > 0) {
        // Both "Not specified" and other cost ranges selected
        conditions.push(sql`(${summerCamps.costRange} IS NULL OR ${summerCamps.costRange} = '' OR ${summerCamps.costRange} = ANY(ARRAY[${sql.join(otherCosts.map(cost => sql`${cost}`), sql`, `)}]::text[]))`);
      } else if (hasNotSpecified) {
        // Only "Not specified" selected
        conditions.push(sql`(${summerCamps.costRange} IS NULL OR ${summerCamps.costRange} = '')`);
      } else if (otherCosts.length > 0) {
        // Only other cost ranges selected
        conditions.push(sql`${summerCamps.costRange} = ANY(ARRAY[${sql.join(otherCosts.map(cost => sql`${cost}`), sql`, `)}]::text[])`);
      }
    }

    if (filters.city) {
      conditions.push(ilike(summerCamps.city, `%${filters.city}%`));
    }

    if (filters.state) {
      conditions.push(eq(summerCamps.state, filters.state));
    }

    if (filters.hasScholarship !== undefined) {
      conditions.push(eq(summerCamps.hasScholarship, filters.hasScholarship));
    }

    if (filters.applicationAvailable !== undefined) {
      conditions.push(eq(summerCamps.applicationAvailable, filters.applicationAvailable));
    }

    if (filters.minimumAge !== undefined) {
      conditions.push(sql`${summerCamps.minimumAge} <= ${filters.minimumAge}`);
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Build sorting
    let orderBy = desc(summerCamps.createdAt);
    if (filters.sortBy) {
      const order = filters.sortOrder === "desc" ? desc : asc;
      switch (filters.sortBy) {
        case "name":
          orderBy = order(summerCamps.name);
          break;
        case "createdAt":
          orderBy = order(summerCamps.createdAt);
          break;
        case "applicationDeadline":
          orderBy = order(summerCamps.applicationDeadline);
          break;
        case "applicationAvailable":
          orderBy = order(summerCamps.applicationAvailable);
          break;
        case "minimumAge":
          orderBy = order(summerCamps.minimumAge);
          break;
        case "thumbsUp":
          orderBy = order(sql`(
            SELECT COUNT(*)
            FROM ${thumbsUp}
            WHERE ${thumbsUp.listingType} = 'camp'
              AND ${thumbsUp.listingId} = ${summerCamps.id}
          )`);
          break;
        case "rating":
          orderBy = order(sql`(
            SELECT AVG(rating)
            FROM ${reviews}
            WHERE ${reviews.listingType} = 'camp'
              AND ${reviews.listingId} = ${summerCamps.id}
          )`);
          break;
        case "costRange":
          orderBy = order(summerCamps.costRange);
          break;
        case "viewCount":
          orderBy = order(summerCamps.viewCount);
          break;
        default:
          orderBy = desc(summerCamps.createdAt);
      }
    }

    // Execute main query with thumbs up count
    const mainQuery = db.select({
      id: summerCamps.id,
      name: summerCamps.name,
      location: summerCamps.location,
      address: summerCamps.address,
      city: summerCamps.city,
      state: summerCamps.state,
      zipcode: summerCamps.zipcode,
      categories: summerCamps.categories,
      tags: summerCamps.tags,
      selectivityLevel: summerCamps.selectivityLevel,
      dates: summerCamps.dates,
      length: summerCamps.length,
      costRange: summerCamps.costRange,
      applicationOpen: summerCamps.applicationOpen,
      applicationDeadline: summerCamps.applicationDeadline,
      applicationAvailable: summerCamps.applicationAvailable,
      minimumAge: summerCamps.minimumAge,
      hasScholarship: summerCamps.hasScholarship,
      eligibility: summerCamps.eligibility,
      description: summerCamps.description,
      deliveryMode: summerCamps.deliveryMode,
      website: summerCamps.website,
      photoUrl: summerCamps.photoUrl,
      // Contributor information
      userId: summerCamps.userId,
      contributorNickname: summerCamps.contributorNickname,
      contributorFirstName: summerCamps.contributorFirstName,
      contributorLastName: summerCamps.contributorLastName,
      isApproved: summerCamps.isApproved,
      submittedAt: summerCamps.submittedAt,
      approvedAt: summerCamps.approvedAt,
      createdAt: summerCamps.createdAt,
      updatedAt: summerCamps.updatedAt,
      viewCount: summerCamps.viewCount,
      thumbsUpCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'camp' AND listing_id = summer_camps.id), 0) AS INTEGER)`,
      averageRating: sql<number>`CAST(COALESCE((SELECT AVG(rating::NUMERIC) FROM reviews WHERE listing_type = 'camp' AND listing_id = summer_camps.id), 0) AS NUMERIC(3,1))`,
      reviewCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM reviews WHERE listing_type = 'camp' AND listing_id = summer_camps.id), 0) AS INTEGER)`
    }).from(summerCamps);
    const campsQuery = whereClause 
      ? mainQuery.where(whereClause)
      : mainQuery;

    const camps = await campsQuery
      .orderBy(orderBy)
      .limit(filters.limit || 5)
      .offset(filters.offset || 0);

    // Execute count query
    const countQuery = db.select({ count: count() }).from(summerCamps);
    const totalQuery = whereClause 
      ? countQuery.where(whereClause)
      : countQuery;

    const totalResult = await totalQuery;

    return {
      camps,
      total: totalResult[0]?.count || 0
    };
  }

  async getSummerCamp(id: number): Promise<SummerCamp | undefined> {
    const [camp] = await db.select().from(summerCamps).where(eq(summerCamps.id, id));
    return camp;
  }

  async createSummerCamp(camp: InsertSummerCamp): Promise<SummerCamp> {
    const [newCamp] = await db.insert(summerCamps).values(camp).returning();
    return newCamp;
  }

  async updateSummerCamp(id: number, camp: Partial<InsertSummerCamp>): Promise<SummerCamp> {
    const [updatedCamp] = await db
      .update(summerCamps)
      .set(camp)
      .where(eq(summerCamps.id, id))
      .returning();
    return updatedCamp;
  }

  async approveSummerCamp(id: number): Promise<void> {
    await db
      .update(summerCamps)
      .set({ isApproved: true, approvedAt: new Date() })
      .where(eq(summerCamps.id, id));
  }

  async deleteSummerCamp(id: number): Promise<void> {
    await db
      .delete(summerCamps)
      .where(eq(summerCamps.id, id));
  }

  // Internships
  async getInternships(filters: {
    search?: string;
    types?: string[];
    selectivityLevel?: number[];
    compensation?: string[];
    city?: string;
    state?: string;
    isRemote?: boolean;
    hasMentorship?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  } = {}): Promise<{ internships: Internship[]; total: number }> {
    // Build filters
    const conditions = [eq(internships.isApproved, true), eq(internships.isActive, true)];

    if (filters.search) {
      conditions.push(
        sql`(${internships.title} ILIKE ${`%${filters.search}%`} OR ${internships.description} ILIKE ${`%${filters.search}%`} OR ${internships.companyName} ILIKE ${`%${filters.search}%`})`
      );
    }

    if (filters.types?.length) {
      conditions.push(sql`${internships.types} && ARRAY[${sql.join(filters.types.map(type => sql`${type}`), sql`, `)}]::text[]`);
    }

    if (filters.selectivityLevel?.length) {
      conditions.push(sql`${internships.selectivityLevel} = ANY(ARRAY[${sql.join(filters.selectivityLevel.map(level => sql`${level}`), sql`, `)}]::integer[])`);
    }

    if (filters.compensation?.length) {
      conditions.push(sql`${internships.compensation} = ANY(ARRAY[${sql.join(filters.compensation.map(comp => sql`${comp}`), sql`, `)}]::text[])`);
    }

    if (filters.city) {
      conditions.push(ilike(internships.city, `%${filters.city}%`));
    }

    if (filters.state) {
      conditions.push(eq(internships.state, filters.state));
    }

    if (filters.isRemote !== undefined) {
      conditions.push(eq(internships.isRemote, filters.isRemote));
    }

    if (filters.hasMentorship !== undefined) {
      conditions.push(eq(internships.hasMentorship, filters.hasMentorship));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Build sorting
    let orderBy = desc(internships.createdAt);
    if (filters.sortBy) {
      const order = filters.sortOrder === "desc" ? desc : asc;
      switch (filters.sortBy) {
        case "title":
          orderBy = order(internships.title);
          break;
        case "company":
          orderBy = order(internships.companyName);
          break;
        case "createdAt":
          orderBy = order(internships.createdAt);
          break;
        case "thumbsUp":
          orderBy = order(sql`(
            SELECT COUNT(*)
            FROM ${thumbsUp}
            WHERE ${thumbsUp.listingType} = 'internship'
              AND ${thumbsUp.listingId} = ${internships.id}
          )`);
          break;
        case "rating":
          orderBy = order(sql`(
            SELECT AVG(rating)
            FROM ${reviews}
            WHERE ${reviews.listingType} = 'internship'
              AND ${reviews.listingId} = ${internships.id}
          )`);
          break;
        case "viewCount":
          orderBy = order(internships.viewCount);
          break;
        default:
          orderBy = desc(internships.createdAt);
      }
    }

    // Execute main query with thumbs up count
    const mainQuery = db.select({
      id: internships.id,
      companyName: internships.companyName,
      title: internships.title,
      location: internships.location,
      address: internships.address,
      city: internships.city,
      state: internships.state,
      zipcode: internships.zipcode,
      isRemote: internships.isRemote,
      types: internships.types,
      selectivityLevel: internships.selectivityLevel,
      compensation: internships.compensation,
      description: internships.description,
      duration: internships.duration,
      internshipDates: internships.internshipDates,
      length: internships.length,
      deliveryMode: internships.deliveryMode,
      minimumAge: internships.minimumAge,
      applicationOpen: internships.applicationOpen,
      applicationDeadline: internships.applicationDeadline,
      prerequisites: internships.prerequisites,
      tuition: internships.tuition,
      eligibility: internships.eligibility,
      website: internships.website,
      photoUrl: internships.photoUrl,
      hasMentorship: internships.hasMentorship,
      // Contributor information
      userId: internships.userId,
      contributorNickname: internships.contributorNickname,
      contributorFirstName: internships.contributorFirstName,
      contributorLastName: internships.contributorLastName,
      isApproved: internships.isApproved,
      submittedAt: internships.submittedAt,
      approvedAt: internships.approvedAt,
      createdAt: internships.createdAt,
      updatedAt: internships.updatedAt,
      viewCount: internships.viewCount,
      thumbsUpCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'internship' AND listing_id = internships.id), 0) AS INTEGER)`,
      averageRating: sql<number>`CAST(COALESCE((SELECT AVG(rating::NUMERIC) FROM reviews WHERE listing_type = 'internship' AND listing_id = internships.id), 0) AS NUMERIC(3,1))`,
      reviewCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM reviews WHERE listing_type = 'internship' AND listing_id = internships.id), 0) AS INTEGER)`
    }).from(internships);
    const internshipsQuery = whereClause 
      ? mainQuery.where(whereClause)
      : mainQuery;

    const internshipList = await internshipsQuery
      .orderBy(orderBy)
      .limit(filters.limit || 5)
      .offset(filters.offset || 0);

    // Execute count query
    const countQuery = db.select({ count: count() }).from(internships);
    const totalQuery = whereClause 
      ? countQuery.where(whereClause)
      : countQuery;

    const totalResult = await totalQuery;

    return {
      internships: internshipList,
      total: totalResult[0]?.count || 0
    };
  }

  async getInternship(id: number): Promise<Internship | undefined> {
    const [internship] = await db.select().from(internships).where(eq(internships.id, id));
    return internship;
  }

  async createInternship(internship: InsertInternship): Promise<Internship> {
    const [newInternship] = await db.insert(internships).values(internship).returning();
    return newInternship;
  }

  async updateInternship(id: number, internship: Partial<InsertInternship>): Promise<Internship> {
    const [updatedInternship] = await db
      .update(internships)
      .set(internship)
      .where(eq(internships.id, id))
      .returning();
    return updatedInternship;
  }

  async approveInternship(id: number): Promise<void> {
    await db
      .update(internships)
      .set({ isApproved: true, approvedAt: new Date() })
      .where(eq(internships.id, id));
  }

  async deleteInternship(id: number): Promise<void> {
    await db
      .delete(internships)
      .where(eq(internships.id, id));
  }

  // Jobs
  async getJobs(filters: {
    search?: string;
    categories?: string[];
    compensation?: string[];
    city?: string;
    state?: string;
    isRemote?: boolean;
    minimumAge?: number;
    hasTraining?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  } = {}): Promise<{ jobs: Job[]; total: number }> {
    // Build filters
    const conditions = [eq(jobs.isApproved, true), eq(jobs.isActive, true)];

    if (filters.search) {
      conditions.push(
        sql`(${jobs.title} ILIKE ${`%${filters.search}%`} OR ${jobs.description} ILIKE ${`%${filters.search}%`} OR ${jobs.companyName} ILIKE ${`%${filters.search}%`})`
      );
    }

    if (filters.categories?.length) {
      conditions.push(sql`${jobs.categories} && ARRAY[${sql.join(filters.categories.map(cat => sql`${cat}`), sql`, `)}]::text[]`);
    }

    if (filters.compensation?.length) {
      conditions.push(sql`${jobs.compensation} = ANY(ARRAY[${sql.join(filters.compensation.map(comp => sql`${comp}`), sql`, `)}]::text[])`);
    }

    if (filters.city) {
      conditions.push(ilike(jobs.city, `%${filters.city}%`));
    }

    if (filters.state) {
      conditions.push(eq(jobs.state, filters.state));
    }

    if (filters.isRemote !== undefined) {
      conditions.push(eq(jobs.isRemote, filters.isRemote));
    }

    if (filters.minimumAge !== undefined) {
      conditions.push(sql`${jobs.minimumAge} <= ${filters.minimumAge}`);
    }

    if (filters.hasTraining !== undefined) {
      conditions.push(eq(jobs.hasTraining, filters.hasTraining));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Build sorting
    let orderBy = desc(jobs.createdAt);
    if (filters.sortBy) {
      const order = filters.sortOrder === "desc" ? desc : asc;
      switch (filters.sortBy) {
        case "title":
          orderBy = order(jobs.title);
          break;
        case "company":
          orderBy = order(jobs.companyName);
          break;
        case "createdAt":
          orderBy = order(jobs.createdAt);
          break;
        case "thumbsUp":
          orderBy = order(sql`(
            SELECT COUNT(*)
            FROM ${thumbsUp}
            WHERE ${thumbsUp.listingType} = 'job'
              AND ${thumbsUp.listingId} = ${jobs.id}
          )`);
          break;
        case "rating":
          orderBy = order(sql`(
            SELECT AVG(rating)
            FROM ${reviews}
            WHERE ${reviews.listingType} = 'job'
              AND ${reviews.listingId} = ${jobs.id}
          )`);
          break;
        case "viewCount":
          orderBy = order(jobs.viewCount);
          break;
        default:
          orderBy = desc(jobs.createdAt);
      }
    }

    // Execute main query with thumbs up count
    const mainQuery = db.select({
      id: jobs.id,
      companyName: jobs.companyName,
      title: jobs.title,
      location: jobs.location,
      address: jobs.address,
      city: jobs.city,
      state: jobs.state,
      zipcode: jobs.zipcode,
      isRemote: jobs.isRemote,
      categories: jobs.categories,
      compensation: jobs.compensation,
      compensationRange: jobs.compensationRange,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryType: jobs.salaryType,
      jobType: jobs.jobType,
      description: jobs.description,
      workSchedule: jobs.workSchedule,
      minimumAge: jobs.minimumAge,
      openingDate: jobs.openingDate,
      closingDate: jobs.closingDate,
      isOngoing: jobs.isOngoing,
      applicationDeadline: jobs.applicationDeadline,
      eligibility: jobs.eligibility,
      website: jobs.website,
      photoUrl: jobs.photoUrl,
      hasTraining: jobs.hasTraining,
      hasAdvancement: jobs.hasAdvancement,
      requiresTransportation: jobs.requiresTransportation,
      requiresResume: jobs.requiresResume,
      // Contributor information
      userId: jobs.userId,
      contributorNickname: jobs.contributorNickname,
      contributorFirstName: jobs.contributorFirstName,
      contributorLastName: jobs.contributorLastName,
      isApproved: jobs.isApproved,
      submittedAt: jobs.submittedAt,
      approvedAt: jobs.approvedAt,
      createdAt: jobs.createdAt,
      updatedAt: jobs.updatedAt,
      viewCount: jobs.viewCount,
      thumbsUpCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'job' AND listing_id = jobs.id), 0) AS INTEGER)`,
      averageRating: sql<number>`CAST(COALESCE((SELECT AVG(rating::NUMERIC) FROM reviews WHERE listing_type = 'job' AND listing_id = jobs.id), 0) AS NUMERIC(3,1))`,
      reviewCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM reviews WHERE listing_type = 'job' AND listing_id = jobs.id), 0) AS INTEGER)`
    }).from(jobs);
    const jobsQuery = whereClause 
      ? mainQuery.where(whereClause)
      : mainQuery;

    const jobsList = await jobsQuery
      .orderBy(orderBy)
      .limit(filters.limit || 5)
      .offset(filters.offset || 0);

    // Execute count query
    const countQuery = db.select({ count: count() }).from(jobs);
    const totalQuery = whereClause 
      ? countQuery.where(whereClause)
      : countQuery;

    const totalResult = await totalQuery;

    return {
      jobs: jobsList,
      total: totalResult[0]?.count || 0
    };
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set(job)
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async approveJob(id: number): Promise<void> {
    await db
      .update(jobs)
      .set({ isApproved: true, approvedAt: new Date() })
      .where(eq(jobs.id, id));
  }

  async deleteJob(id: number): Promise<void> {
    await db
      .delete(jobs)
      .where(eq(jobs.id, id));
  }

  // Services
  async getServices(filters: {
    search?: string;
    categories?: string[];
    tags?: string[];
    type?: string;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  } = {}): Promise<{ services: Service[]; total: number }> {
    const conditions = [];

    // Only show approved and active services
    conditions.push(eq(services.isApproved, true));
    conditions.push(eq(services.isActive, true));

    // Search filters
    if (filters.search) {
      conditions.push(
        or(
          ilike(services.name, `%${filters.search}%`),
          ilike(services.description, `%${filters.search}%`),
          ilike(services.city, `%${filters.search}%`)
        )
      );
    }

    // Category filters
    if (filters.categories && filters.categories.length > 0) {
      conditions.push(
        or(
          ...filters.categories.map((category) =>
            sql`${services.categories} && ARRAY[${category}]::text[]`
          )
        )
      );
    }

    // Tag filters
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(
        or(
          ...filters.tags.map((tag) =>
            sql`${services.tags} && ARRAY[${tag}]::text[]`
          )
        )
      );
    }

    // Type filter (individual/company)
    if (filters.type) {
      conditions.push(eq(services.type, filters.type));
    }

    // Location filters
    if (filters.city) {
      conditions.push(ilike(services.city, `%${filters.city}%`));
    }
    if (filters.state) {
      conditions.push(eq(services.state, filters.state));
    }

    // Build where clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Sorting
    let orderBy;
    const sortOrder = filters.sortOrder === "asc" ? asc : desc;
    switch (filters.sortBy) {
      case "name":
        orderBy = sortOrder(services.name);
        break;
      case "viewCount":
        orderBy = sortOrder(services.viewCount);
        break;
      case "thumbsUp":
        orderBy = sortOrder(sql`COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'service' AND listing_id = services.id), 0)`);
        break;
      case "rating":
        orderBy = sortOrder(sql`COALESCE((SELECT AVG(rating) FROM reviews WHERE listing_type = 'service' AND listing_id = services.id), 0)`);
        break;
      default:
        orderBy = desc(services.createdAt);
    }

    // Execute main query with computed fields
    const mainQuery = db.select({
      id: services.id,
      name: services.name,
      type: services.type,
      description: services.description,
      website: services.website,
      phone: services.phone,
      email: services.email,
      address: services.address,
      city: services.city,
      state: services.state,
      zipcode: services.zipcode,
      categories: services.categories,
      tags: services.tags,
      deliveryMode: services.deliveryMode,
      photoUrl: services.photoUrl,
      userId: services.userId,
      contributorNickname: services.contributorNickname,
      contributorFirstName: services.contributorFirstName,
      contributorLastName: services.contributorLastName,
      isApproved: services.isApproved,
      isActive: services.isActive,
      submittedAt: services.submittedAt,
      approvedAt: services.approvedAt,
      createdAt: services.createdAt,
      updatedAt: services.updatedAt,
      viewCount: services.viewCount,
      thumbsUpCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'service' AND listing_id = services.id), 0) AS INTEGER)`,
      averageRating: sql<number>`CAST(COALESCE((SELECT AVG(rating::NUMERIC) FROM reviews WHERE listing_type = 'service' AND listing_id = services.id), 0) AS NUMERIC(3,1))`,
      reviewCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM reviews WHERE listing_type = 'service' AND listing_id = services.id), 0) AS INTEGER)`
    }).from(services);

    const servicesQuery = whereClause 
      ? mainQuery.where(whereClause)
      : mainQuery;

    const servicesList = await servicesQuery
      .orderBy(orderBy)
      .limit(filters.limit || 5)
      .offset(filters.offset || 0);

    // Execute count query
    const countQuery = db.select({ count: count() }).from(services);
    const totalQuery = whereClause 
      ? countQuery.where(whereClause)
      : countQuery;

    const totalResult = await totalQuery;

    return {
      services: servicesList,
      total: totalResult[0]?.count || 0
    };
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async approveService(id: number): Promise<void> {
    await db
      .update(services)
      .set({ isApproved: true, approvedAt: new Date() })
      .where(eq(services.id, id));
  }

  async deleteService(id: number): Promise<void> {
    await db
      .delete(services)
      .where(eq(services.id, id));
  }

  // Events
  async getEvents(filters: {
    search?: string;
    categories?: string[];
    targetAudience?: string[];
    eventDate?: string;
    dateRange?: { start: string; end: string };
    city?: string;
    state?: string;
    zipcode?: string;
    distance?: number;
    cost?: string[];
    registrationRequired?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  } = {}): Promise<{ events: Event[]; total: number }> {
    const conditions = [];

    // Only show approved and active events
    conditions.push(eq(events.isApproved, true));
    conditions.push(eq(events.isActive, true));

    // Search filters
    if (filters.search) {
      conditions.push(
        or(
          ilike(events.title, `%${filters.search}%`),
          ilike(events.description, `%${filters.search}%`),
          ilike(events.organizer, `%${filters.search}%`),
          ilike(events.venue, `%${filters.search}%`)
        )
      );
    }

    // Category filters
    if (filters.categories && filters.categories.length > 0) {
      conditions.push(
        or(
          ...filters.categories.map((category) =>
            sql`${events.categories} && ARRAY[${category}]::text[]`
          )
        )
      );
    }

    // Target audience filters
    if (filters.targetAudience && filters.targetAudience.length > 0) {
      conditions.push(
        or(
          ...filters.targetAudience.map((audience) =>
            sql`${events.targetAudience} && ARRAY[${audience}]::text[]`
          )
        )
      );
    }

    // Date filters - convert date column to string for accurate comparison
    if (filters.eventDate) {
      conditions.push(sql`DATE(${events.eventDate}) = ${filters.eventDate}`);
    }

    if (filters.dateRange) {
      conditions.push(
        and(
          sql`${events.eventDate} >= ${filters.dateRange.start}`,
          sql`${events.eventDate} <= ${filters.dateRange.end}`
        )
      );
    }

    // Location filters
    if (filters.city) {
      conditions.push(ilike(events.city, `%${filters.city}%`));
    }

    if (filters.state) {
      conditions.push(ilike(events.state, `%${filters.state}%`));
    }

    if (filters.zipcode) {
      conditions.push(eq(events.zipcode, filters.zipcode));
    }

    // Cost filters
    if (filters.cost && filters.cost.length > 0) {
      conditions.push(
        or(
          ...filters.cost.map((costRange) => ilike(events.cost, `%${costRange}%`))
        )
      );
    }

    // Registration required filter
    if (filters.registrationRequired !== undefined) {
      conditions.push(eq(events.registrationRequired, filters.registrationRequired));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Build sorting
    let orderBy = asc(events.eventDate); // Default sort by event date ascending
    if (filters.sortBy) {
      const order = filters.sortOrder === "desc" ? desc : asc;
      switch (filters.sortBy) {
        case "title":
          orderBy = order(events.title);
          break;
        case "eventDate":
          orderBy = order(events.eventDate);
          break;
        case "organizer":
          orderBy = order(events.organizer);
          break;
        case "createdAt":
          orderBy = order(events.createdAt);
          break;
        case "thumbsUp":
          orderBy = order(sql`(
            SELECT COUNT(*)
            FROM ${thumbsUp}
            WHERE ${thumbsUp.listingType} = 'event'
              AND ${thumbsUp.listingId} = ${events.id}
          )`);
          break;
        case "rating":
          orderBy = order(sql`(
            SELECT AVG(rating)
            FROM ${reviews}
            WHERE ${reviews.listingType} = 'event'
              AND ${reviews.listingId} = ${events.id}
          )`);
          break;
        case "viewCount":
          orderBy = order(events.viewCount);
          break;
        default:
          orderBy = asc(events.eventDate);
      }
    }

    // Execute main query with thumbs up count
    const mainQuery = db.select({
      id: events.id,
      title: events.title,
      description: events.description,
      organizer: events.organizer,
      organizerEmail: events.organizerEmail,
      organizerPhone: events.organizerPhone,
      eventDate: events.eventDate,
      startTime: events.startTime,
      endTime: events.endTime,
      venue: events.venue,
      address: events.address,
      city: events.city,
      state: events.state,
      zipcode: events.zipcode,
      latitude: events.latitude,
      longitude: events.longitude,
      categories: events.categories,
      targetAudience: events.targetAudience,
      ageRange: events.ageRange,
      cost: events.cost,
      registrationRequired: events.registrationRequired,
      registrationLink: events.registrationLink,
      photoUrl: events.photoUrl,
      contactInfo: events.contactInfo,
      specialInstructions: events.specialInstructions,
      viewCount: events.viewCount,
      isApproved: events.isApproved,
      isActive: events.isActive,
      submittedAt: events.submittedAt,
      approvedAt: events.approvedAt,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt,
      thumbsUpCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM thumbs_up WHERE listing_type = 'event' AND listing_id = events.id), 0) AS INTEGER)`,
      averageRating: sql<number>`CAST(COALESCE((SELECT AVG(rating::NUMERIC) FROM reviews WHERE listing_type = 'event' AND listing_id = events.id), 0) AS NUMERIC(3,1))`,
      reviewCount: sql<number>`CAST(COALESCE((SELECT COUNT(*) FROM reviews WHERE listing_type = 'event' AND listing_id = events.id), 0) AS INTEGER)`
    }).from(events);

    const eventsQuery = whereClause 
      ? mainQuery.where(whereClause)
      : mainQuery;

    const eventsList = await eventsQuery
      .orderBy(orderBy)
      .limit(filters.limit || 5)
      .offset(filters.offset || 0);

    // Execute count query
    const countQuery = db.select({ count: count() }).from(events);
    const totalQuery = whereClause 
      ? countQuery.where(whereClause)
      : countQuery;

    const totalResult = await totalQuery;

    return {
      events: eventsList,
      total: totalResult[0]?.count || 0
    };
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async approveEvent(id: number): Promise<void> {
    await db
      .update(events)
      .set({ isApproved: true, isActive: true, approvedAt: new Date() })
      .where(eq(events.id, id));
  }

  async deleteEvent(id: number): Promise<void> {
    await db
      .delete(events)
      .where(eq(events.id, id));
  }

  // Reviews
  async getReviews(listingType: string, listingId: number): Promise<any[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          r.id, 
          r.user_id as "userId", 
          r.listing_type as "listingType", 
          r.listing_id as "listingId", 
          r.title, 
          r.rating, 
          r.content, 
          r.created_at as "createdAt", 
          r.updated_at as "updatedAt",
          u.first_name as "reviewerFirstName",
          u.last_name as "reviewerLastName", 
          u.nickname as "reviewerNickname",
          u.email as "reviewerEmail",
          u.profile_image_url as "reviewerProfileImageUrl",
          u.created_at as "reviewerCreatedAt"
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.listing_type = ${listingType} AND r.listing_id = ${listingId}
        ORDER BY r.created_at DESC
      `);

      return result.rows || [];
    } catch (error) {
      console.error("Error in getReviews:", error);
      throw error;
    }
  }

  async getReviewById(id: number): Promise<Review | undefined> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    return result[0];
  }

  async hasUserReviewed(userId: string, listingType: string, listingId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, userId),
          eq(reviews.listingType, listingType),
          eq(reviews.listingId, listingId)
        )
      );
    return result.length > 0;
  }

  async createReview(review: InsertReview): Promise<Review> {
    // Check if user has already reviewed this listing
    const hasReviewed = await this.hasUserReviewed(review.userId, review.listingType, review.listingId);
    if (hasReviewed) {
      throw new Error('User has already reviewed this listing');
    }

    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<Review> {
    const [updatedReview] = await db
      .update(reviews)
      .set(review)
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteReview(id: number, userId: string): Promise<void> {
    // Check if user is admin
    const userRole = await this.getUserRole(userId);

    if (userRole === 'admin') {
      // Admin can delete any review
      await db
        .delete(reviews)
        .where(eq(reviews.id, id));
    } else {
      // Regular users can only delete their own reviews
      await db
        .delete(reviews)
        .where(and(eq(reviews.id, id), eq(reviews.userId, userId)));
    }
  }

  // Thumbs Up
  async toggleThumbsUp(userId: string, listingType: string, listingId: number): Promise<boolean> {
    const existing = await db
      .select()
      .from(thumbsUp)
      .where(
        and(
          eq(thumbsUp.userId, userId),
          eq(thumbsUp.listingType, listingType),
          eq(thumbsUp.listingId, listingId)
        )
      );

    if (existing.length > 0) {
      await db
        .delete(thumbsUp)
        .where(
          and(
            eq(thumbsUp.userId, userId),
            eq(thumbsUp.listingType, listingType),
            eq(thumbsUp.listingId, listingId)
          )
        );
      return false;
    } else {
      await db.insert(thumbsUp).values({
        userId,
        listingType,
        listingId,
      });
      return true;
    }
  }

  async getThumbsUpCount(listingType: string, listingId: number): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(thumbsUp)
      .where(and(eq(thumbsUp.listingType, listingType), eq(thumbsUp.listingId, listingId)));
    return result[0]?.count || 0;
  }

  async hasUserThumbedUp(userId: string, listingType: string, listingId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(thumbsUp)
      .where(
        and(
          eq(thumbsUp.userId, userId),
          eq(thumbsUp.listingType, listingType),
          eq(thumbsUp.listingId, listingId)
        )
      );
    return result.length > 0;
  }

  // Bookmarks
  async toggleBookmark(userId: string, listingType: string, listingId: number): Promise<boolean> {
    const existing = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.listingType, listingType),
          eq(bookmarks.listingId, listingId)
        )
      );

    if (existing.length > 0) {
      await db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, userId),
            eq(bookmarks.listingType, listingType),
            eq(bookmarks.listingId, listingId)
          )
        );
      return false;
    } else {
      await db.insert(bookmarks).values({
        userId,
        listingType,
        listingId,
      });
      return true;
    }
  }

  async getUserBookmarks(userId: string, options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<{ bookmarks: any[]; total: number }> {
    const limit = options.limit || 5;
    const offset = options.offset || 0;

    // Get total count first
    const totalResult = await db
      .select({ count: count() })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId));

    const total = totalResult[0]?.count || 0;

    // Get paginated bookmarks
    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))
      .limit(limit)
      .offset(offset);

    // Fetch the actual listing data for each bookmark
    const bookmarksWithListings = await Promise.all(
      userBookmarks.map(async (bookmark) => {
        let listing: any = null;

        try {
          switch (bookmark.listingType) {
            case "tutoring":
              listing = await this.getTutoringProvider(bookmark.listingId);
              break;
            case "camp":
              listing = await this.getSummerCamp(bookmark.listingId);
              break;
            case "internship":
              listing = await this.getInternship(bookmark.listingId);
              break;
            case "job":
              listing = await this.getJob(bookmark.listingId);
              break;
            case "service":
              listing = await this.getService(bookmark.listingId);
              break;
          }
          
          // Add thumbsUpCount to listing if found
          if (listing) {
            const thumbsUpCount = await this.getThumbsUpCount(bookmark.listingType, bookmark.listingId);
            listing = { ...listing, thumbsUpCount };
          }
        } catch (error) {
          console.error(`Error fetching listing ${bookmark.listingType}:${bookmark.listingId}:`, error);
        }

        return {
          ...bookmark,
          listing
        };
      })
    );

    // Filter out bookmarks where the listing was not found (deleted listings)
    const validBookmarks = bookmarksWithListings.filter(b => b.listing !== null);

    return {
      bookmarks: validBookmarks,
      total
    };
  }

  async hasUserBookmarked(userId: string, listingType: string, listingId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.listingType, listingType),
          eq(bookmarks.listingId, listingId)
        )
      );
    return result.length > 0;
  }

  // Reports
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getReports(): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.isResolved, false))
      .orderBy(desc(reports.createdAt));
  }

  async resolveReport(id: number): Promise<void> {
    await db
      .update(reports)
      .set({ isResolved: true })
      .where(eq(reports.id, id));
  }

  // View Tracking Implementation
  async trackView(tableName: string, listingId: number, userId: string | null, clientIp: string): Promise<{ wasTracked: boolean }> {
    const RATE_LIMIT_MINUTES = 5; // Prevent rapid view increments for 5 minutes
    
    // Use IP address as identifier for anonymous users
    const trackingId = userId || `anon_${clientIp}`;
    
    try {
      console.log(`[DEBUG] Tracking view for table ${tableName}, listing ID ${listingId}, by ${userId ? 'user' : 'anonymous'} ${trackingId}`);
      
      // Convert table name back to listing type for the tracking table
      const listingTypeMapping = {
        'tutoring_providers': 'tutoring',
        'summer_camps': 'camp',
        'internships': 'internship',
        'jobs': 'job',
        'events': 'event',
        'services': 'service'
      };
      
      const listingType = listingTypeMapping[tableName as keyof typeof listingTypeMapping];
      if (!listingType) {
        console.log(`[DEBUG] Invalid listing type for table: ${tableName}`);
        return { wasTracked: false };
      }
      
      // Calculate time threshold for rate limiting
      const rateThreshold = new Date();
      rateThreshold.setMinutes(rateThreshold.getMinutes() - RATE_LIMIT_MINUTES);
      console.log(`[DEBUG] Rate limit threshold: ${rateThreshold.toISOString()}`);
      
      // Check if user/IP viewed this listing recently using simple date comparison
      const recentView = await db
        .select()
        .from(viewTracking)
        .where(
          and(
            eq(viewTracking.userId, trackingId),
            eq(viewTracking.listingType, listingType),
            eq(viewTracking.listingId, listingId),
            sql`${viewTracking.lastViewedAt} > ${rateThreshold}`
          )
        )
        .limit(1);

      console.log(`[DEBUG] Recent view check: found ${recentView.length} recent views`);
      if (recentView.length > 0) {
        console.log(`[DEBUG] Recent view found at: ${recentView[0].lastViewedAt}`);
        // User/IP viewed this recently, don't increment view count
        return { wasTracked: false };
      }

      // Insert or update view tracking record using proper upsert
      console.log(`[DEBUG] Inserting/updating view tracking record`);
      await db
        .insert(viewTracking)
        .values({
          userId: trackingId,
          listingType,
          listingId,
          lastViewedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [viewTracking.userId, viewTracking.listingType, viewTracking.listingId],
          set: {
            lastViewedAt: new Date(),
          },
        });

      // Increment view count in the appropriate table
      console.log(`[DEBUG] Incrementing view count for ${tableName}`);
      switch (tableName) {
        case 'tutoring_providers':
          await db
            .update(tutoringProviders)
            .set({ 
              viewCount: sql`${tutoringProviders.viewCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(tutoringProviders.id, listingId));
          break;
        case 'summer_camps':
          await db
            .update(summerCamps)
            .set({ 
              viewCount: sql`${summerCamps.viewCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(summerCamps.id, listingId));
          break;
        case 'internships':
          await db
            .update(internships)
            .set({ 
              viewCount: sql`${internships.viewCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(internships.id, listingId));
          break;
        case 'jobs':
          await db
            .update(jobs)
            .set({ 
              viewCount: sql`${jobs.viewCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(jobs.id, listingId));
          break;
        case 'events':
          await db
            .update(events)
            .set({ 
              viewCount: sql`${events.viewCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(events.id, listingId));
          break;
        default:
          console.log(`[DEBUG] Unknown table name: ${tableName}`);
          return { wasTracked: false };
      }

      console.log(`[DEBUG] View successfully tracked and incremented`);
      return { wasTracked: true }; // View was successfully tracked
    } catch (error) {
      console.error('Error tracking view:', error);
      return { wasTracked: false };
    }
  }

  // Admin
  async getPendingApprovals(): Promise<{
    tutoringProviders: TutoringProvider[];
    summerCamps: SummerCamp[];
    internships: Internship[];
    jobs: Job[];
    services: Service[];
    events: Event[];
  }> {
    const [
      pendingTutoringProviders,
      pendingSummerCamps,
      pendingInternships,
      pendingJobs,
      pendingServices,
      pendingEvents,
    ] = await Promise.all([
      db.select().from(tutoringProviders).where(eq(tutoringProviders.isApproved, false)),
      db.select().from(summerCamps).where(eq(summerCamps.isApproved, false)),
      db.select().from(internships).where(eq(internships.isApproved, false)),
      db.select().from(jobs).where(eq(jobs.isApproved, false)),
      db.select().from(services).where(eq(services.isApproved, false)),
      db.select().from(events).where(eq(events.isApproved, false)),
    ]);

    return {
      tutoringProviders: pendingTutoringProviders,
      summerCamps: pendingSummerCamps,
      internships: pendingInternships,
      jobs: pendingJobs,
      services: pendingServices,
      events: pendingEvents,
    };
  }

  async getLiveListings(): Promise<{
    tutoringProviders: TutoringProvider[];
    summerCamps: SummerCamp[];
    internships: Internship[];
    jobs: Job[];
    services: Service[];
    events: Event[];
  }> {
    const [
      liveTutoringProviders,
      liveSummerCamps,
      liveInternships,
      liveJobs,
      liveServices,
      liveEvents,
    ] = await Promise.all([
      db.select().from(tutoringProviders).where(eq(tutoringProviders.isApproved, true)).limit(50),
      db.select().from(summerCamps).where(eq(summerCamps.isApproved, true)).limit(50),
      db.select().from(internships).where(eq(internships.isApproved, true)).limit(50),
      db.select().from(jobs).where(eq(jobs.isApproved, true)).limit(50),
      db.select().from(services).where(eq(services.isApproved, true)).limit(50),
      db.select().from(events).where(eq(events.isApproved, true)).limit(50),
    ]);

    return {
      tutoringProviders: liveTutoringProviders,
      summerCamps: liveSummerCamps,
      internships: liveInternships,
      jobs: liveJobs,
      services: liveServices,
      events: liveEvents,
    };
  }

  async searchListings(type: string, query: string): Promise<any[]> {
    const searchTerm = `%${query}%`;

    switch (type) {
      case 'tutoring-providers':
        return await db
          .select()
          .from(tutoringProviders)
          .where(and(
            eq(tutoringProviders.isApproved, true),
            or(
              ilike(tutoringProviders.name, searchTerm),
              ilike(tutoringProviders.description, searchTerm),
              ilike(tutoringProviders.city, searchTerm),
              ilike(tutoringProviders.state, searchTerm)
            )
          ))
          .limit(20);

      case 'summer-camps':
        return await db
          .select()
          .from(summerCamps)
          .where(and(
            eq(summerCamps.isApproved, true),
            or(
              ilike(summerCamps.name, searchTerm),
              ilike(summerCamps.description, searchTerm),
              ilike(summerCamps.city, searchTerm),
              ilike(summerCamps.state, searchTerm)
            )
          ))
          .limit(20);

      case 'internships':
        return await db
          .select()
          .from(internships)
          .where(and(
            eq(internships.isApproved, true),
            or(
              ilike(internships.title, searchTerm),
              ilike(internships.companyName, searchTerm),
              ilike(internships.description, searchTerm),
              ilike(internships.city, searchTerm),
              ilike(internships.state, searchTerm)
            )
          ))
          .limit(20);

      case 'jobs':
        return await db
          .select()
          .from(jobs)
          .where(and(
            eq(jobs.isApproved, true),
            or(
              ilike(jobs.title, searchTerm),
              ilike(jobs.companyName, searchTerm),
              ilike(jobs.description, searchTerm),
              ilike(jobs.city, searchTerm),
              ilike(jobs.state, searchTerm)
            )
          ))
          .limit(20);

      case 'events':
        return await db
          .select()
          .from(events)
          .where(and(
            eq(events.isApproved, true),
            or(
              ilike(events.title, searchTerm),
              ilike(events.organizer, searchTerm),
              ilike(events.description, searchTerm),
              ilike(events.venue, searchTerm),
              ilike(events.city, searchTerm),
              ilike(events.state, searchTerm)
            )
          ))
          .limit(20);

      case 'services':
        return await db
          .select()
          .from(services)
          .where(and(
            eq(services.isApproved, true),
            or(
              ilike(services.name, searchTerm),
              ilike(services.description, searchTerm),
              ilike(services.type, searchTerm),
              ilike(services.city, searchTerm),
              ilike(services.state, searchTerm)
            )
          ))
          .limit(20);

      default:
        return [];
    }
  }

  async deactivateListing(type: string, id: number): Promise<void> {
    switch (type) {
      case 'tutoring-provider':
        await db
          .update(tutoringProviders)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(tutoringProviders.id, id));
        break;
      case 'summer-camp':
        await db
          .update(summerCamps)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(summerCamps.id, id));
        break;
      case 'internship':
        await db
          .update(internships)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(internships.id, id));
        break;
      case 'job':
        await db
          .update(jobs)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(jobs.id, id));
        break;
      case 'event':
        await db
          .update(events)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(events.id, id));
        break;
      case 'service':
        await db
          .update(services)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(services.id, id));
        break;
    }
  }

  async activateListing(type: string, id: number): Promise<void> {
    switch (type) {
      case 'tutoring-provider':
        await db
          .update(tutoringProviders)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(tutoringProviders.id, id));
        break;
      case 'summer-camp':
        await db
          .update(summerCamps)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(summerCamps.id, id));
        break;
      case 'internship':
        await db
          .update(internships)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(internships.id, id));
        break;
      case 'job':
        await db
          .update(jobs)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(jobs.id, id));
        break;
      case 'event':
        await db
          .update(events)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(events.id, id));
        break;
      case 'service':
        await db
          .update(services)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(services.id, id));
        break;
    }
  }
}

export const storage = new DatabaseStorage();