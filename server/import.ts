import { storage } from './storage';
import type { InsertTutoringProvider, InsertSummerCamp, InsertInternship, InsertJob } from '../shared/schema';

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
      try {
        console.log('Starting CSV parse, data length:', csvData.length);
        
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        console.log('CSV lines found:', lines.length);
        
        if (lines.length < 2) {
          console.log('Error: Insufficient CSV lines');
          reject(new Error('CSV must have at least a header row and one data row'));
          return;
        }

        const headers = this.parseCSVRow(lines[0]);
        console.log('CSV headers:', headers);
        
        const results: ImportRow[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = this.parseCSVRow(lines[i]);
          const row: ImportRow = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          results.push(row);
        }

        console.log('CSV parsing completed, rows:', results.length);
        resolve(results);
      } catch (error) {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  }

  // Helper method to parse a single CSV row, handling quoted fields
  private parseCSVRow(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Import tutoring providers
  async importTutoringProviders(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      console.log('Starting tutoring providers import...');
      const rows = await this.parseCSV(csvData);
      console.log('Parsed rows:', rows.length);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          // Parse delivery mode array
          let deliveryModeArray: string[] = [];
          if (row.deliveryMode) {
            deliveryModeArray = this.parseArrayField(row.deliveryMode);
          }

          const provider: InsertTutoringProvider = {
            name: row.name || '',
            type: row.type as 'private_tutor' | 'business' || 'business',
            description: row.description || '',
            categories: this.parseArrayField(row.categories),
            subjects: this.parseArrayField(row.subjects),
            city: row.city || '',
            state: row.state || '',
            zipcode: row.zipcode || undefined,
            deliveryMode: deliveryModeArray,
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: this.parseBoolean(row.isApproved) !== undefined ? this.parseBoolean(row.isApproved)! : false,
            isActive: this.parseBoolean(row.isActive) !== undefined ? this.parseBoolean(row.isActive)! : true,
          };

          // Validate required fields
          if (!provider.name || !provider.description || !provider.city || !provider.state || !provider.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (name, description, city, state, categories)`);
            continue;
          }

          console.log(`Creating provider ${i + 1}:`, provider.name);
          await storage.createTutoringProvider(provider);
          success++;
        } catch (error) {
          console.error(`Error on row ${i + 2}:`, error);
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('CSV parsing error:', error);
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('Import completed. Success:', success, 'Errors:', errors.length);
    return { success, errors };
  }

  // Import summer camps
  async importSummerCamps(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      console.log('Starting summer camps import...');
      const rows = await this.parseCSV(csvData);
      console.log('Parsed rows:', rows.length);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          // Parse delivery mode array
          let deliveryModeArray: string[] = [];
          if (row.deliveryMode) {
            deliveryModeArray = this.parseArrayField(row.deliveryMode);
          }

          const camp: InsertSummerCamp = {
            name: row.name || '',
            description: row.description || '',
            categories: this.parseArrayField(row.categories),
            city: row.city || '',
            state: row.state || '',
            zipcode: row.zipcode || undefined,
            cost: row.cost || undefined,
            costRange: row.costRange || undefined,
            selectivityLevel: this.parseNumber(row.selectivityLevel),
            minimumAge: this.parseNumber(row.minimumAge),
            hasScholarship: this.parseBoolean(row.hasScholarship),
            tags: this.parseArrayField(row.tags),
            dates: row.dates || undefined,
            length: row.length || undefined,
            applicationOpen: this.parseDate(row.applicationOpen),
            applicationDueDate: this.parseDate(row.applicationDueDate),
            applicationDeadline: this.parseDate(row.applicationDeadline),
            eligibility: row.eligibility || undefined,
            deliveryMode: deliveryModeArray,
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            location: row.location || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: this.parseBoolean(row.isApproved) !== undefined ? this.parseBoolean(row.isApproved)! : false,
            isActive: this.parseBoolean(row.isActive) !== undefined ? this.parseBoolean(row.isActive)! : true,
            applicationAvailable: this.parseBoolean(row.applicationAvailable) !== undefined ? this.parseBoolean(row.applicationAvailable)! : true,
          };

          // Validate required fields
          if (!camp.name || !camp.description || !camp.city || !camp.state || !camp.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (name, description, city, state, categories)`);
            continue;
          }

          console.log(`Creating camp ${i + 1}:`, camp.name);
          await storage.createSummerCamp(camp);
          success++;
        } catch (error) {
          console.error(`Error on row ${i + 2}:`, error);
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('CSV parsing error:', error);
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('Import completed. Success:', success, 'Errors:', errors.length);
    return { success, errors };
  }

  // Import internships
  async importInternships(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      console.log('Starting internships import...');
      const rows = await this.parseCSV(csvData);
      console.log('Parsed rows:', rows.length);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          // Parse delivery mode array
          let deliveryModeArray: string[] = [];
          if (row.deliveryMode) {
            deliveryModeArray = this.parseArrayField(row.deliveryMode);
          }

          const internship: InsertInternship = {
            companyName: row.companyName || '',
            title: row.title || '',
            description: row.description || '',
            categories: this.parseArrayField(row.categories || row.types), // Support both field names
            city: row.city || '',
            state: row.state || '',
            zipcode: row.zipcode || undefined,
            compensation: row.compensation as 'Paid' | 'Unpaid' | 'Stipend' | 'Academic Credit' || undefined,
            duration: this.parseArrayField(row.duration),
            minimumAge: this.parseNumber(row.minimumAge),
            hasMentorship: this.parseBoolean(row.hasMentorship),
            hasTraining: this.parseBoolean(row.hasTraining),
            selectivityLevel: this.parseNumber(row.selectivityLevel),
            deliveryMode: deliveryModeArray,
            applicationOpen: this.parseDate(row.applicationOpen),
            applicationDeadline: this.parseDate(row.applicationDeadline),
            internshipDates: row.internshipDates || undefined,
            prerequisites: row.prerequisites || undefined,
            tuition: row.tuition || undefined,
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            location: row.location || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: this.parseBoolean(row.isApproved) !== undefined ? this.parseBoolean(row.isApproved)! : false,
            isActive: this.parseBoolean(row.isActive) !== undefined ? this.parseBoolean(row.isActive)! : true,
          };

          // Validate required fields
          if (!internship.companyName || !internship.title || !internship.description || !internship.city || !internship.state || !internship.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (companyName, title, description, city, state, categories)`);
            continue;
          }

          console.log(`Creating internship ${i + 1}:`, internship.title);
          await storage.createInternship(internship);
          success++;
        } catch (error) {
          console.error(`Error on row ${i + 2}:`, error);
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('CSV parsing error:', error);
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('Import completed. Success:', success, 'Errors:', errors.length);
    return { success, errors };
  }

  // Import jobs
  async importJobs(csvData: string): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    try {
      console.log('Starting jobs import...');
      const rows = await this.parseCSV(csvData);
      console.log('Parsed rows:', rows.length);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          // Parse delivery mode array
          let deliveryModeArray: string[] = [];
          if (row.deliveryMode) {
            deliveryModeArray = this.parseArrayField(row.deliveryMode);
          }

          const job: InsertJob = {
            companyName: row.companyName || '',
            title: row.title || '',
            description: row.description || '',
            categories: this.parseArrayField(row.categories),
            city: row.city || '',
            state: row.state || '',
            zipcode: row.zipcode || undefined,
            jobType: this.parseArrayField(row.jobType),
            schedule: this.parseArrayField(row.schedule),
            minimumAge: this.parseNumber(row.minimumAge),
            hasTraining: this.parseBoolean(row.hasTraining),
            salaryMin: this.parseNumber(row.salaryMin),
            salaryMax: this.parseNumber(row.salaryMax),
            salaryRange: row.salaryRange || undefined,
            salaryType: row.salaryType as 'Hourly' | 'Monthly' | 'Yearly' || undefined,
            deliveryMode: deliveryModeArray,
            openingDate: this.parseDate(row.openingDate),
            closingDate: this.parseDate(row.closingDate),
            isOngoing: this.parseBoolean(row.isOngoing),
            website: row.website || undefined,
            phone: row.phone || undefined,
            email: row.email || undefined,
            address: row.address || undefined,
            location: row.location || undefined,
            photoUrl: row.photoUrl || undefined,
            isApproved: this.parseBoolean(row.isApproved) !== undefined ? this.parseBoolean(row.isApproved)! : false,
            isActive: this.parseBoolean(row.isActive) !== undefined ? this.parseBoolean(row.isActive)! : true,
          };

          // Validate required fields
          if (!job.companyName || !job.title || !job.description || !job.city || !job.state || !job.categories.length) {
            errors.push(`Row ${i + 2}: Missing required fields (companyName, title, description, city, state, categories)`);
            continue;
          }

          console.log(`Creating job ${i + 1}:`, job.title);
          await storage.createJob(job);
          success++;
        } catch (error) {
          console.error(`Error on row ${i + 2}:`, error);
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('CSV parsing error:', error);
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('Import completed. Success:', success, 'Errors:', errors.length);
    return { success, errors };
  }
}

export const importService = new ImportService();