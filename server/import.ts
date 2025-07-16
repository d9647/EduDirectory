import csv from 'csv-parser';
import { storage } from './storage.js';
import type { InsertTutoringProvider, InsertSummerCamp, InsertInternship, InsertJob } from '../shared/schema.js';

interface ImportRow {
  [key: string]: string;
}

export class ImportService {
  
  // Helper function to parse array fields
  private parseArrayField(value: string | undefined): string[] {
    if (!value || value.trim() === '') return [];
    return value.split(';').map(item => item.trim()).filter(item => item.length > 0);
  }

  // Helper function to parse boolean fields
  private parseBoolean(value: string | undefined): boolean | undefined {
    if (!value || value.trim() === '') return undefined;
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes') return true;
    if (lower === 'false' || lower === '0' || lower === 'no') return false;
    return undefined;
  }

  // Helper function to parse number fields
  private parseNumber(value: string | undefined): number | undefined {
    if (!value || value.trim() === '') return undefined;
    const num = parseInt(value.trim(), 10);
    return isNaN(num) ? undefined : num;
  }

  // Helper function to parse date fields
  private parseDate(value: string | undefined): Date | undefined {
    if (!value || value.trim() === '') return undefined;
    const date = new Date(value.trim());
    return isNaN(date.getTime()) ? undefined : date;
  }

  // Parse CSV data into array of objects
  private parseCSV(csvData: string): Promise<ImportRow[]> {
    return new Promise((resolve, reject) => {
      const results: ImportRow[] = [];
      const { Readable } = require('stream');
      const readableStream = new Readable();
      readableStream.push(csvData);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on('data', (data: ImportRow) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: Error) => reject(error));
    });
  }

  // Import tutoring providers
  async importTutoringProviders(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      const rows = await this.parseCSV(csvData);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const provider: InsertTutoringProvider = {
            name: row.name || '',
            type: row.type as 'private_tutor' | 'business' || 'business',
            description: row.description || '',
            categories: this.parseArrayField(row.categories),
            subjects: this.parseArrayField(row.subjects),
            city: row.city || '',
            state: row.state || '',
            deliveryMode: row.deliveryMode as 'In-person' | 'Remote' | 'Hybrid' || undefined,
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: false,
            isActive: true,
          };

          // Validate required fields
          if (!provider.name || !provider.description || !provider.city || !provider.state || !provider.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (name, description, city, state, categories)`);
            continue;
          }

          await storage.createTutoringProvider(provider);
          success++;
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { success, errors };
  }

  // Import summer camps
  async importSummerCamps(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      const rows = await this.parseCSV(csvData);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const camp: InsertSummerCamp = {
            name: row.name || '',
            description: row.description || '',
            categories: this.parseArrayField(row.categories),
            city: row.city || '',
            state: row.state || '',
            cost: row.cost || undefined,
            selectivityLevel: this.parseNumber(row.selectivityLevel),
            minimumAge: this.parseNumber(row.minimumAge),
            hasScholarship: this.parseBoolean(row.hasScholarship),
            tags: this.parseArrayField(row.tags),
            dates: row.dates || undefined,
            length: row.length || undefined,
            applicationOpen: this.parseDate(row.applicationOpen),
            applicationDeadline: this.parseDate(row.applicationDeadline),
            deliveryMode: row.deliveryMode as 'In-person' | 'Remote' | 'Hybrid' || undefined,
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: false,
            isActive: true,
            applicationAvailable: true,
          };

          // Validate required fields
          if (!camp.name || !camp.description || !camp.city || !camp.state || !camp.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (name, description, city, state, categories)`);
            continue;
          }

          await storage.createSummerCamp(camp);
          success++;
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { success, errors };
  }

  // Import internships
  async importInternships(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      const rows = await this.parseCSV(csvData);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const internship: InsertInternship = {
            companyName: row.companyName || '',
            title: row.title || '',
            description: row.description || '',
            types: this.parseArrayField(row.types),
            city: row.city || '',
            state: row.state || '',
            compensation: row.compensation as 'Paid' | 'Unpaid' | 'Stipend' | 'Academic Credit' || undefined,
            duration: this.parseArrayField(row.duration),
            minimumAge: this.parseNumber(row.minimumAge),
            hasMentorship: this.parseBoolean(row.hasMentorship),
            deliveryMode: row.deliveryMode as 'In-person' | 'Remote' | 'Hybrid' || undefined,
            applicationOpen: this.parseDate(row.applicationOpen),
            applicationDeadline: this.parseDate(row.applicationDeadline),
            internshipDates: row.internshipDates || undefined,
            prerequisites: row.prerequisites || undefined,
            tuition: row.tuition || undefined,
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: false,
            isActive: true,
          };

          // Validate required fields
          if (!internship.companyName || !internship.title || !internship.description || !internship.city || !internship.state || !internship.types.length) {
            errors.push(`Row ${i + 2}: Missing required fields (companyName, title, description, city, state, types)`);
            continue;
          }

          await storage.createInternship(internship);
          success++;
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { success, errors };
  }

  // Import jobs
  async importJobs(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      const rows = await this.parseCSV(csvData);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          const job: InsertJob = {
            companyName: row.companyName || '',
            title: row.title || '',
            description: row.description || '',
            categories: this.parseArrayField(row.categories),
            city: row.city || '',
            state: row.state || '',
            jobType: this.parseArrayField(row.jobType),
            schedule: this.parseArrayField(row.schedule),
            minimumAge: this.parseNumber(row.minimumAge),
            hasTraining: this.parseBoolean(row.hasTraining),
            salaryRange: row.salaryRange || undefined,
            salaryType: row.salaryType as 'Hourly' | 'Monthly' | 'Yearly' || undefined,
            deliveryMode: row.deliveryMode as 'In-person' | 'Remote' | 'Hybrid' || undefined,
            openingDate: this.parseDate(row.openingDate),
            closingDate: this.parseDate(row.closingDate),
            isOngoing: this.parseBoolean(row.isOngoing),
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: false,
            isActive: true,
          };

          // Validate required fields
          if (!job.companyName || !job.title || !job.description || !job.city || !job.state || !job.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (companyName, title, description, city, state, categories)`);
            continue;
          }

          await storage.createJob(job);
          success++;
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { success, errors };
  }
}

export const importService = new ImportService();