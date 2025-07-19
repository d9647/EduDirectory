# CSV Import Guide & Data Collection Strategy

## 🚀 Quick Start Guide

### 1. **CSV Templates Created**
I've created CSV templates for all listing types:
- `csv-templates/tutoring-providers-template.csv`
- `csv-templates/summer-camps-template.csv`
- `csv-templates/internships-template.csv`
- `csv-templates/jobs-template.csv`

### 2. **Admin Panel Features**
The admin panel now includes:
- **File Upload**: Select CSV files for import
- **Data Preview**: See first 5 rows before importing
- **Template Download**: Download templates for each listing type
- **Import Status**: Real-time feedback on import success/failure
- **Error Handling**: Detailed error messages for failed imports

### 3. **Backend API Ready**
Import endpoints are available:
- `POST /api/admin/import/tutoring-providers`
- `POST /api/admin/import/summer-camps`
- `POST /api/admin/import/internships`
- `POST /api/admin/import/jobs`

## 📊 Data Collection Strategy

### **Phase 1: Quick Start (Week 1-2)**

#### **Priority Targets - Tri-Valley Area**

**Tutoring Providers (Target: 50-100)**
- **Mathnasium** (Dublin, Pleasanton)
- **Kumon Centers** (all cities)
- **Sylvan Learning Centers**
- **Huntington Learning Centers**
- **Private tutors** (via Yelp/Google)

**Summer Camps (Target: 30-50)**
- **Dublin Unified Summer Programs**
- **Pleasanton Unified Summer Camps**
- **Livermore Valley Joint Unified Programs**
- **UC Berkeley Summer Sessions**
- **Stanford Pre-Collegiate Studies**

**Internships (Target: 20-30)**
- **Lawrence Livermore National Laboratory**
- **Sandia National Laboratories**
- **Local Government** (City internships)
- **School Districts** (Education internships)

**Jobs (Target: 50-100)**
- **Retail Stores** (Safeway, Target, Walmart)
- **Restaurants** (Fast food, casual dining)
- **Recreation Centers** (YMCA, city pools)
- **Libraries** (Part-time positions)

### **Phase 2: Data Collection Methods**

#### **Method 1: Manual Research (Recommended)**
**Tools:**
- Google Sheets for data entry
- Yelp Business API (if available)
- Google Places API (limited free tier)

**Process:**
1. Search each source systematically
2. Extract business information
3. Standardize data format
4. Validate contact information

#### **Method 2: Web Scraping**
**Target Websites:**
- Yelp (respect robots.txt)
- Google My Business listings
- Chamber of Commerce directories
- School district websites

**Legal Considerations:**
- Check robots.txt before scraping
- Respect rate limits
- Verify terms of service
- Consider reaching out to businesses directly

#### **Method 3: Direct Outreach**
**Strategy:**
- Contact businesses directly via phone/email
- Offer free listing on your platform
- Provide incentives for early adoption
- Build relationships with local business owners

## 🛠️ How to Use the CSV Import

### **Step 1: Download Templates**
1. Go to Admin Panel (`/admin`)
2. Select import type (e.g., "Tutoring Providers")
3. Click "Download Template"
4. Open in Excel/Google Sheets

### **Step 2: Fill in Data**
**Required Fields for Each Type:**

**Tutoring Providers:**
- `name` (required)
- `type` (business/private_tutor)
- `description` (required)
- `city`, `state` (required)
- `categories`, `subjects` (semicolon-separated)
- `website`, `phone`, `email` (optional)

**Summer Camps:**
- `name` (required)
- `description` (required)
- `city`, `state` (required)
- `categories`, `tags` (semicolon-separated)
- `cost`, `dates`, `length` (optional)

**Internships:**
- `companyName`, `title` (required)
- `description` (required)
- `city`, `state` (required)
- `types` (semicolon-separated)
- `compensation`, `duration` (optional)

**Jobs:**
- `companyName`, `title` (required)
- `description` (required)
- `city`, `state` (required)
- `categories`, `jobType` (semicolon-separated)
- `salaryRange`, `schedule` (optional)

### **Step 3: Import Data**
1. Save as CSV file
2. Upload in Admin Panel
3. Preview data (first 5 rows)
4. Click "Import Data"
5. Check import status

## 📋 Data Collection Checklist

### **For Each Listing, Collect:**
- [ ] Business name
- [ ] Contact information (phone, email, website)
- [ ] Address (street, city, state, zip)
- [ ] Categories/subjects
- [ ] Description
- [ ] Pricing information
- [ ] Operating hours
- [ ] Photos (if available)

### **Quality Standards:**
- [ ] Valid phone numbers
- [ ] Working websites
- [ ] Accurate addresses
- [ ] Complete descriptions
- [ ] Proper categorization

## 🎯 Success Metrics

### **Phase 1 Goals:**
- 50+ tutoring providers
- 30+ summer camps
- 20+ internships
- 50+ jobs
- 90% data accuracy

### **Phase 2 Goals:**
- 200+ total listings
- 95% data accuracy
- 50% business verification
- User engagement metrics

## 🔧 Technical Implementation

### **CSV Format Requirements:**
- **Delimiter**: Comma (,)
- **Array fields**: Semicolon-separated (;)
- **Boolean fields**: true/false, 1/0, yes/no
- **Date fields**: YYYY-MM-DD format
- **Required fields**: Must be filled
- **Optional fields**: Can be empty

### **Error Handling:**
- Invalid data format
- Missing required fields
- Duplicate entries
- Database connection issues

## 📞 Tri-Valley Resources

### **Business Directories:**
- Dublin Chamber of Commerce
- Pleasanton Chamber of Commerce
- Livermore Chamber of Commerce
- San Ramon Chamber of Commerce

### **School Districts:**
- Dublin Unified School District
- Pleasanton Unified School District
- Livermore Valley Joint Unified School District
- San Ramon Valley Unified School District

### **Major Employers:**
- Lawrence Livermore National Laboratory
- Sandia National Laboratories
- Workday (Pleasanton)
- Roche (Pleasanton)
- Chevron (San Ramon)

## 🚀 Next Steps

1. **Start with CSV import** - Use the templates provided
2. **Focus on tutoring providers first** - Highest demand
3. **Build relationships** - Contact businesses directly
4. **Encourage self-listing** - Make it easy for businesses to add themselves

## 💡 Tips for Success

1. **Start Small**: Begin with 10-20 listings to test the system
2. **Quality Over Quantity**: Ensure data accuracy before scaling
3. **Build Relationships**: Contact businesses directly when possible
4. **Validate Data**: Call phone numbers and check websites
5. **Use Templates**: Download and use the provided CSV templates
6. **Test Import**: Always preview data before importing

## 🆘 Troubleshooting

### **Common Issues:**
- **CSV parsing errors**: Check for extra commas or quotes
- **Missing required fields**: Ensure all required fields are filled
- **Array field format**: Use semicolons (;) to separate multiple values
- **Date format**: Use YYYY-MM-DD format for dates
- **Boolean values**: Use true/false, 1/0, or yes/no

### **Getting Help:**
- Check the admin panel for detailed error messages
- Verify CSV format matches the templates
- Test with a small dataset first
- Contact support if issues persist

---

**Ready to start importing data?** 
1. Download the CSV templates
2. Collect data from the sources listed above
3. Use the admin panel to import your data
4. Monitor the import status and fix any errors
5. Scale up once the initial import is successful! 