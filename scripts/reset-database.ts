
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  try {
    console.log("Dropping all tables...");
    
    // Drop tables in reverse dependency order
    await db.execute(sql`DROP TABLE IF EXISTS reports CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS bookmarks CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS thumbs_up CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS reviews CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS jobs CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS internships CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS summer_camps CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS tutoring_providers CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE`);
    
    console.log("All tables dropped successfully.");
    console.log("Please run 'npm run db:push' to recreate the schema.");
    
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    process.exit(0);
  }
}

resetDatabase();
