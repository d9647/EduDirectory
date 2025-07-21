# Volunteer Opportunities Scraper

This script extracts volunteer opportunities from [teensvolunteer.org](https://teensvolunteer.org/volunteer-opportunities/?fwp_location=eastbay) and generates a CSV file ready for import into your Jobs system.

## Features

- ✅ **Extracts all volunteer opportunities** from the East Bay page
- ✅ **Follows "Read More" links** to get detailed descriptions
- ✅ **Maps to Jobs schema** with proper field mapping
- ✅ **Sets `isApproved: false`** for admin review
- ✅ **Handles virtual and in-person opportunities**
- ✅ **Generates clean CSV** ready for import

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the scraper:**
   ```bash
   npm start
   ```

## Output

The script will generate a CSV file named `volunteer-opportunities-YYYY-MM-DD.csv` with the following structure:

| Field | Value | Example |
|-------|-------|---------|
| `companyName` | Organization name | "Balance Boxes Bay Area" |
| `title` | Volunteer position | "Youth volunteers needed" |
| `location` | City name | "Fremont" |
| `city` | City name | "Fremont" |
| `state` | "CA" | "CA" |
| `compensation` | "Volunteer / Unpaid" | "Volunteer / Unpaid" |
| `description` | Full description from "Read More" | "Help pack and distribute..." |
| `applicationLink` | Website link | "https://example.org/volunteer" |
| `isOngoing` | `true` | `true` |
| `isApproved` | `false` | `false` (for admin review) |
| `isActive` | `true` | `true` |
| `isRemote` | `true/false` | `true` for virtual opportunities |

## Configuration

You can modify the script to:

- **Change the target URL** by editing the `page.goto()` call
- **Adjust scraping speed** by modifying the `slowMo` and `waitForTimeout` values
- **Add more fields** by extending the CSV header and row generation
- **Filter opportunities** by adding conditions in the extraction logic

## Notes

- The script runs in **non-headless mode** by default so you can see what's happening
- It includes **delays** to be respectful to the server
- **Error handling** is included for broken links
- The generated CSV is **ready for import** into your Jobs system

## Troubleshooting

If you encounter issues:

1. **Check your internet connection**
2. **Verify the website is accessible**
3. **Try increasing timeouts** if the site is slow
4. **Check the console output** for error messages

## Legal Notice

This script is for educational purposes. Please respect the website's robots.txt and terms of service when scraping data. 