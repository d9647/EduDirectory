import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertTutoringProviderSchema,
  insertSummerCampSchema,
  insertInternshipSchema,
  insertJobSchema,
  insertReviewSchema,
  insertReportSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tutoring Providers
  app.get('/api/tutoring-providers', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        categories: req.query.categories ? (req.query.categories as string).split(',') : undefined,
        subjects: req.query.subjects ? (req.query.subjects as string).split(',') : undefined,
        type: req.query.type as string,
        city: req.query.city as string,
        state: req.query.state as string,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await storage.getTutoringProviders(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching tutoring providers:", error);
      res.status(500).json({ message: "Failed to fetch tutoring providers" });
    }
  });

  app.get('/api/tutoring-providers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const provider = await storage.getTutoringProvider(id);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error("Error fetching tutoring provider:", error);
      res.status(500).json({ message: "Failed to fetch tutoring provider" });
    }
  });

  app.post('/api/tutoring-providers', async (req, res) => {
    try {
      const validatedData = insertTutoringProviderSchema.parse(req.body);
      const provider = await storage.createTutoringProvider(validatedData);
      res.status(201).json(provider);
    } catch (error) {
      console.error("Error creating tutoring provider:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tutoring provider" });
    }
  });

  // Summer Camps
  app.get('/api/summer-camps', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        categories: req.query.categories ? (req.query.categories as string).split(',') : undefined,
        difficultyLevel: req.query.difficultyLevel ? (req.query.difficultyLevel as string).split(',').map(Number) : undefined,
        city: req.query.city as string,
        state: req.query.state as string,
        hasScholarship: req.query.hasScholarship === 'true' ? true : req.query.hasScholarship === 'false' ? false : undefined,
        applicationAvailable: req.query.applicationAvailable === 'true' ? true : req.query.applicationAvailable === 'false' ? false : undefined,
        minimumAge: req.query.minimumAge ? parseInt(req.query.minimumAge as string) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await storage.getSummerCamps(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching summer camps:", error);
      res.status(500).json({ message: "Failed to fetch summer camps" });
    }
  });

  app.get('/api/summer-camps/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const camp = await storage.getSummerCamp(id);
      if (!camp) {
        return res.status(404).json({ message: "Camp not found" });
      }
      res.json(camp);
    } catch (error) {
      console.error("Error fetching summer camp:", error);
      res.status(500).json({ message: "Failed to fetch summer camp" });
    }
  });

  app.post('/api/summer-camps', async (req, res) => {
    try {
      const validatedData = insertSummerCampSchema.parse(req.body);
      const camp = await storage.createSummerCamp(validatedData);
      res.status(201).json(camp);
    } catch (error) {
      console.error("Error creating summer camp:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create summer camp" });
    }
  });

  // Internships
  app.get('/api/internships', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        types: req.query.types ? (req.query.types as string).split(',') : undefined,
        compensation: req.query.compensation ? (req.query.compensation as string).split(',') : undefined,
        city: req.query.city as string,
        state: req.query.state as string,
        isRemote: req.query.isRemote === 'true' ? true : req.query.isRemote === 'false' ? false : undefined,
        hasMentorship: req.query.hasMentorship === 'true' ? true : req.query.hasMentorship === 'false' ? false : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await storage.getInternships(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching internships:", error);
      res.status(500).json({ message: "Failed to fetch internships" });
    }
  });

  app.get('/api/internships/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const internship = await storage.getInternship(id);
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
    } catch (error) {
      console.error("Error fetching internship:", error);
      res.status(500).json({ message: "Failed to fetch internship" });
    }
  });

  app.post('/api/internships', async (req, res) => {
    try {
      const validatedData = insertInternshipSchema.parse(req.body);
      const internship = await storage.createInternship(validatedData);
      res.status(201).json(internship);
    } catch (error) {
      console.error("Error creating internship:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create internship" });
    }
  });

  // Jobs
  app.get('/api/jobs', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        categories: req.query.categories ? (req.query.categories as string).split(',') : undefined,
        compensation: req.query.compensation ? (req.query.compensation as string).split(',') : undefined,
        city: req.query.city as string,
        state: req.query.state as string,
        isRemote: req.query.isRemote === 'true' ? true : req.query.isRemote === 'false' ? false : undefined,
        minimumAge: req.query.minimumAge ? parseInt(req.query.minimumAge as string) : undefined,
        hasTraining: req.query.hasTraining === 'true' ? true : req.query.hasTraining === 'false' ? false : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await storage.getJobs(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs', async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Reviews
  app.get('/api/reviews/:listingType/:listingId', async (req, res) => {
    try {
      const { listingType, listingId } = req.params;
      const reviews = await storage.getReviews(listingType, parseInt(listingId));
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.put('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      const validatedData = insertReviewSchema.partial().parse(req.body);
      const review = await storage.updateReview(id, validatedData);
      res.json(review);
    } catch (error) {
      console.error("Error updating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      await storage.deleteReview(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Thumbs Up
  app.post('/api/thumbs-up', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { listingType, listingId } = req.body;
      const isThumbedUp = await storage.toggleThumbsUp(userId, listingType, parseInt(listingId));
      res.json({ isThumbedUp });
    } catch (error) {
      console.error("Error toggling thumbs up:", error);
      res.status(500).json({ message: "Failed to toggle thumbs up" });
    }
  });

  app.get('/api/thumbs-up/:listingType/:listingId', async (req, res) => {
    try {
      const { listingType, listingId } = req.params;
      const count = await storage.getThumbsUpCount(listingType, parseInt(listingId));
      res.json({ count });
    } catch (error) {
      console.error("Error fetching thumbs up count:", error);
      res.status(500).json({ message: "Failed to fetch thumbs up count" });
    }
  });

  app.get('/api/thumbs-up/:listingType/:listingId/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { listingType, listingId } = req.params;
      const hasThumbedUp = await storage.hasUserThumbedUp(userId, listingType, parseInt(listingId));
      res.json({ hasThumbedUp });
    } catch (error) {
      console.error("Error checking thumbs up status:", error);
      res.status(500).json({ message: "Failed to check thumbs up status" });
    }
  });

  // Bookmarks
  app.post('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { listingType, listingId } = req.body;
      const isBookmarked = await storage.toggleBookmark(userId, listingType, parseInt(listingId));
      res.json({ isBookmarked });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      res.status(500).json({ message: "Failed to toggle bookmark" });
    }
  });

  app.get('/api/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.get('/api/bookmarks/:listingType/:listingId/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { listingType, listingId } = req.params;
      const isBookmarked = await storage.hasUserBookmarked(userId, listingType, parseInt(listingId));
      res.json({ isBookmarked });
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      res.status(500).json({ message: "Failed to check bookmark status" });
    }
  });

  // Reports
  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertReportSchema.parse({ ...req.body, userId });
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Admin routes
  app.get('/api/admin/pending-approvals', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const pendingApprovals = await storage.getPendingApprovals();
      res.json(pendingApprovals);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      res.status(500).json({ message: "Failed to fetch pending approvals" });
    }
  });

  app.get('/api/admin/live-listings', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const liveListings = await storage.getLiveListings();
      res.json(liveListings);
    } catch (error) {
      console.error("Error fetching live listings:", error);
      res.status(500).json({ message: "Failed to fetch live listings" });
    }
  });

  app.get('/api/admin/search-listings/:type', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const { type } = req.params;
      const { query } = req.query;
      
      if (!query) {
        return res.json([]);
      }
      
      const results = await storage.searchListings(type, query);
      res.json(results);
    } catch (error) {
      console.error("Error searching listings:", error);
      res.status(500).json({ message: "Failed to search listings" });
    }
  });

  app.post('/api/admin/deactivate/:type/:id', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const { type, id } = req.params;
      await storage.deactivateListing(type, parseInt(id));
      res.json({ message: "Listing deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating listing:", error);
      res.status(500).json({ message: "Failed to deactivate listing" });
    }
  });

  app.post('/api/admin/activate/:type/:id', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const { type, id } = req.params;
      await storage.activateListing(type, parseInt(id));
      res.json({ message: "Listing activated successfully" });
    } catch (error) {
      console.error("Error activating listing:", error);
      res.status(500).json({ message: "Failed to activate listing" });
    }
  });

  app.post('/api/admin/approve/:type/:id', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const { type, id } = req.params;
      const listingId = parseInt(id);

      switch (type) {
        case 'tutoring-provider':
          await storage.approveTutoringProvider(listingId);
          break;
        case 'summer-camp':
          await storage.approveSummerCamp(listingId);
          break;
        case 'internship':
          await storage.approveInternship(listingId);
          break;
        case 'job':
          await storage.approveJob(listingId);
          break;
        default:
          return res.status(400).json({ message: "Invalid listing type" });
      }

      res.json({ message: "Approved successfully" });
    } catch (error) {
      console.error("Error approving listing:", error);
      res.status(500).json({ message: "Failed to approve listing" });
    }
  });

  app.get('/api/admin/reports', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/admin/reports/:id/resolve', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const id = parseInt(req.params.id);
      await storage.resolveReport(id);
      res.json({ message: "Report resolved successfully" });
    } catch (error) {
      console.error("Error resolving report:", error);
      res.status(500).json({ message: "Failed to resolve report" });
    }
  });

  // Admin edit routes
  app.put('/api/admin/edit/:type/:id', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const { type, id } = req.params;
      const listingId = parseInt(id);
      const updateData = { ...req.body };

      console.log('Original updateData:', JSON.stringify(updateData, null, 2));

      // Remove fields that shouldn't be updated through admin edit
      const protectedFields = ['id', 'submittedAt', 'approvedAt', 'createdAt', 'updatedAt'];
      protectedFields.forEach(field => {
        delete updateData[field];
      });

      // Clean up undefined and empty string values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      // Convert date strings to Date objects for database compatibility (these are date fields, not timestamp)
      const dateFields = ['applicationOpen', 'applicationDeadline', 'applicationDueDate', 'openingDate', 'closingDate'];
      
      for (const field of dateFields) {
        if (updateData[field] !== undefined) {
          if (typeof updateData[field] === 'string' && updateData[field].trim()) {
            const dateValue = new Date(updateData[field]);
            if (!isNaN(dateValue.getTime())) {
              updateData[field] = dateValue;
              console.log(`Converted ${field} to Date:`, dateValue);
            } else {
              console.log(`Invalid date value for field ${field}: ${updateData[field]}`);
              delete updateData[field];
            }
          } else {
            delete updateData[field];
          }
        }
      }

      // Convert string arrays back to arrays if they were serialized
      const arrayFields = ['categories', 'subjects', 'types', 'tags', 'duration', 'jobType', 'schedule'];
      
      for (const field of arrayFields) {
        if (updateData[field] && typeof updateData[field] === 'string') {
          updateData[field] = updateData[field].split(',').map(item => item.trim()).filter(Boolean);
        }
      }

      // Convert numeric fields
      if (updateData.selectivityLevel !== undefined) {
        updateData.selectivityLevel = parseInt(updateData.selectivityLevel) || null;
      }
      if (updateData.minimumAge !== undefined) {
        updateData.minimumAge = parseInt(updateData.minimumAge) || null;
      }
      
      // Convert decimal fields for salary ranges
      if (updateData.salaryMin !== undefined) {
        updateData.salaryMin = parseFloat(updateData.salaryMin) || null;
      }
      if (updateData.salaryMax !== undefined) {
        updateData.salaryMax = parseFloat(updateData.salaryMax) || null;
      }
      
      // Convert boolean fields
      const booleanFields = ['isRemote', 'hasScholarship', 'applicationAvailable', 'hasMentorship', 'hasTraining', 'hasAdvancement', 'requiresTransportation', 'requiresResume', 'isOngoing'];
      booleanFields.forEach(field => {
        if (updateData[field] !== undefined) {
          updateData[field] = updateData[field] === 'true' || updateData[field] === true;
        }
      });

      console.log('Processed updateData:', JSON.stringify(updateData, null, 2));

      let updatedListing;
      switch (type) {
        case 'tutoring-provider':
          updatedListing = await storage.updateTutoringProvider(listingId, updateData);
          break;
        case 'summer-camp':
          updatedListing = await storage.updateSummerCamp(listingId, updateData);
          break;
        case 'internship':
          updatedListing = await storage.updateInternship(listingId, updateData);
          break;
        case 'job':
          updatedListing = await storage.updateJob(listingId, updateData);
          break;
        default:
          return res.status(400).json({ message: "Invalid listing type" });
      }

      res.json(updatedListing);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  // Google Sheets Template
  app.get('/api/template', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'google-sheets-template.html'));
  });

  const httpServer = createServer(app);
  return httpServer;
}
