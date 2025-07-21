const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeVolunteerOpportunities() {
  console.log('🚀 Starting volunteer opportunity scraper...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set a longer timeout
    page.setDefaultTimeout(30000);
    
    console.log('📡 Navigating to teensvolunteer.org...');
    await page.goto('https://teensvolunteer.org/volunteer-opportunities/?fwp_location=eastbay', {
      waitUntil: 'domcontentloaded'
    });

    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract opportunities from the main page
    console.log('🔍 Extracting volunteer opportunities...');
    const opportunities = await page.evaluate(() => {
      const results = [];
      const h3Elements = document.querySelectorAll('h3');
      
      h3Elements.forEach((h3, index) => {
        const title = h3.textContent.trim();
        if (!title) return;
        
        // Extract organization and position
        const parts = title.split('–');
        const companyName = parts[0]?.trim() || title;
        const jobTitle = parts[1]?.trim() || title;
        
        // Find location
        let location = '';
        let isVirtual = false;
        
        // Check for Virtual label
        const prevElement = h3.previousElementSibling;
        if (prevElement && prevElement.textContent.includes('Virtual')) {
          isVirtual = true;
          location = 'Virtual';
        } else {
          // Try to find location in surrounding text
          const locationMatch = h3.parentElement?.textContent.match(/(Fremont|Oakland|Berkeley|San Leandro|Hayward|Alameda|Newark|Emeryville|Richmond|Albany)/i);
          location = locationMatch ? locationMatch[1] : '';
        }
        
                 // Find Read More link - look more broadly
         let readMoreLink = null;
         const parentElement = h3.parentElement;
         if (parentElement) {
           // Look for any link that contains "volunteer-opportunities" or "read more"
           const links = parentElement.querySelectorAll('a');
           for (const link of links) {
             if (link.href.includes('volunteer-opportunities') || 
                 link.textContent.toLowerCase().includes('read more')) {
               readMoreLink = link.href;
               break;
             }
           }
         }
        
        results.push({
          companyName,
          title: jobTitle,
          location,
          isVirtual,
          detailUrl: readMoreLink,
          originalTitle: title
        });
      });
      
      return results;
    });

    console.log(`✅ Found ${opportunities.length} opportunities on main page`);
    
    if (opportunities.length === 0) {
      console.log('❌ No opportunities found. The page structure might have changed.');
      return;
    }

    // Process each opportunity to get details
    const detailedOpportunities = [];
    
    // Process first 3 opportunities for testing
    const testOpportunities = opportunities.slice(0, 3);
    for (let i = 0; i < testOpportunities.length; i++) {
      const opportunity = testOpportunities[i];
                console.log(`📝 Processing ${i + 1}/${testOpportunities.length}: ${opportunity.title}`);
          
          if (opportunity.detailUrl) {
            try {
              console.log(`🔗 Following link: ${opportunity.detailUrl}`);
              await page.goto(opportunity.detailUrl, { waitUntil: 'domcontentloaded' });
              await new Promise(resolve => setTimeout(resolve, 2000));

              // Debug: Check what elements exist on the page
              console.log('🔍 Looking for job_description div...');
              const debugInfo = await page.evaluate(() => {
                const allDivs = document.querySelectorAll('div');
                console.log(`Found ${allDivs.length} divs on the page`);
                
                // Look for any div with 'job' or 'description' in class name
                const possibleDivs = Array.from(allDivs).filter(div => {
                  const className = div.className || '';
                  return className.toLowerCase().includes('job') || 
                         className.toLowerCase().includes('description') ||
                         className.toLowerCase().includes('content');
                });
                
                console.log(`Found ${possibleDivs.length} divs with job/description/content classes:`);
                possibleDivs.forEach((div, index) => {
                  console.log(`${index + 1}. Class: "${div.className}" - Text preview: "${div.textContent.substring(0, 100)}..."`);
                });
                
                return {
                  totalDivs: allDivs.length,
                  possibleDivs: possibleDivs.map(div => ({
                    className: div.className,
                    textPreview: div.textContent.substring(0, 100)
                  }))
                };
              });
              
              //console.log(`📊 Debug info: Found ${debugInfo.totalDivs} total divs, ${debugInfo.possibleDivs.length} relevant divs`);
              debugInfo.possibleDivs.forEach((div, index) => {
                console.log(`${index + 1}. Class: "${div.className}" - Text: "${div.textPreview}..."`);
              });

                     const details = await page.evaluate(() => {
             let description = '';
             let websiteLink = '';
             let address = '';
             let city = '';
             let state = '';
             let zipcode = '';

                          // Debug: Check what elements exist on the page
             console.log('🔍 Looking for job_description div...');
             const allDivs = document.querySelectorAll('div');
             console.log(`Found ${allDivs.length} divs on the page`);
             
             // Look for any div with 'job' or 'description' in class name
             const possibleDivs = Array.from(allDivs).filter(div => {
               const className = div.className || '';
               return className.toLowerCase().includes('job') || 
                      className.toLowerCase().includes('description') ||
                      className.toLowerCase().includes('content');
             });
             
             console.log(`Found ${possibleDivs.length} divs with job/description/content classes:`);
             possibleDivs.forEach((div, index) => {
               console.log(`${index + 1}. Class: "${div.className}" - Text preview: "${div.textContent.substring(0, 100)}..."`);
             });
             
             // Look for ALL job_description divs and get the 4th one
             const jobDescriptionDivs = document.querySelectorAll('div.job_description');
             
             // Collect all job_description div texts for debugging
             const jobDescriptionTexts = Array.from(jobDescriptionDivs).map((div, index) => ({
               index: index + 1,
               text: div.textContent.trim()
             }));
             
             if (jobDescriptionDivs.length >= 1) {
               // Get the 1st job_description div (since you said there's only 1)
               const jobDescriptionDiv = jobDescriptionDivs[0];
               
               // Get the text content and filter out JavaScript
               let text = jobDescriptionDiv.textContent.trim();
               
               // Remove all JavaScript code
               text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
               text = text.replace(/jQuery\([^)]*\)/g, '');
               text = text.replace(/window\.location[^;]*/g, '');
               text = text.replace(/setTimeout\([^)]*\)/g, '');
               text = text.replace(/if\([^)]*\)\s*\{[^}]*\}/g, '');
               text = text.replace(/function\s*\([^)]*\)\s*\{[^}]*\}/g, '');
               text = text.replace(/\.elementor-[^)]*\)/g, '');
               text = text.replace(/facetwp-[^)]*\)/g, '');
               text = text.replace(/[a-zA-Z]+\.[a-zA-Z]+\([^)]*\)/g, '');
               
               // Clean up whitespace
               description = text.replace(/\s+/g, ' ').trim();
             } else {
               description = ''; // Set empty description if not enough divs found
             }

             // Look for button with data-id="880402a" for website link
             const websiteButton = document.querySelector('[data-id="880402a"]');
             if (websiteButton && websiteButton.textContent.trim()) {
               websiteLink = websiteButton.textContent.trim();
               console.log(`🔗 Found website button: "${websiteLink}"`);
             } else {
               console.log(`🔗 No website button with data-id="880402a" found`);
             }

             // Set address fields to default values
             address = '';
             city = 'Alameda County';
             state = 'California';
             zipcode = '';
             
             // Look for element with data-id="85cb594"
             const addressElement = document.querySelector('[data-id="85cb594"]');
             if (addressElement && addressElement.textContent.trim()) {
               const addressText = addressElement.textContent.trim();
               console.log(`📍 Found address element with data-id="85cb594": "${addressText}"`);
               
               // Parse address components
               const addressParts = addressText.split(',').map(part => part.trim()).filter(part => part.length > 0);
               
               if (addressParts.length >= 1) {
                 address = addressParts[0]; // First part is usually the street address
               }
               
               if (addressParts.length >= 2) {
                 city = addressParts[1]; // Second part is usually the city
               }
               
               // Look for state and zipcode pattern (CA 94501)
               const stateZipMatch = addressText.match(/(CA|California)\s+(\d{5})/i);
               if (stateZipMatch) {
                 state = stateZipMatch[1];
                 zipcode = stateZipMatch[2];
               } else {
                 state = 'CA'; // Default to CA
               }
               
               console.log(`📍 Parsed address: "${address}", city: "${city}", state: "${state}", zipcode: "${zipcode}"`);
             } else {
               console.log(`📍 No address element with data-id="85cb594" found`);
             }

             // Only use job_description div content, no fallback to avoid too much text

             // Fallback for website - look for external links
             if (!websiteLink) {
               const links = document.querySelectorAll('a[href*="http"]');
               for (const link of links) {
                 const href = link.href;
                 if (!href.includes('teensvolunteer.org') && 
                     !href.includes('facebook.com') && 
                     !href.includes('twitter.com') &&
                     !href.includes('instagram.com')) {
                   websiteLink = href;
                   break;
                 }
               }
             }

             return { 
               description, 
               websiteLink, 
               address, 
               city, 
               state, 
               zipcode,
               jobDescriptionCount: jobDescriptionDivs.length,
               jobDescriptionTexts: jobDescriptionTexts,
               foundJobDescription: jobDescriptionDivs.length >= 1,
               descriptionLength: description.length
             };
           });

          opportunity.description = details.description;
          opportunity.applicationLink = details.websiteLink;
          opportunity.address = details.address;
          opportunity.city = details.city;
          opportunity.state = details.state;
          opportunity.zipcode = details.zipcode;
          
          // Log debug info in Node.js console
          //console.log(`Debug info: Address: ${details.address || 'Not found'}`);
          //console.log(`Debug info: City: ${details.city || 'Not found'}`);
          //console.log(`Debug info: State: ${details.state || 'Not found'}`);
          //console.log(`Debug info: Zipcode: ${details.zipcode || 'Not found'}`);
          //console.log(`Debug info: Job description found: ${details.foundJobDescription}`);
          //console.log(`Debug info: Found ${details.jobDescriptionCount} job_description divs`);
          //console.log(`Debug info: 📝 All job_description div texts:`);
          //details.jobDescriptionTexts.forEach((item, index) => {
            //console.log(`${item.index}. "${item.text.substring(0, 200)}..."`);
          //});
          console.log(`📄 Description length: ${details.descriptionLength} characters`);
          if (details.description) {
            console.log(`📝 Final description: "${details.description}"`);
          }
          
          console.log(`📄 Description length: ${details.description.length} characters`);
          console.log(`🔗 Website link: ${details.websiteLink || 'Not found'}`);
          
        } catch (error) {
          console.log(`⚠️ Error processing ${opportunity.title}: ${error.message}`);
          opportunity.description = '';
          opportunity.applicationLink = '';
        }
      } else {
        opportunity.description = '';
        opportunity.applicationLink = '';
      }

      detailedOpportunities.push(opportunity);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Be respectful
    }

    // Generate CSV
    const CSV_HEADER = 'companyName,title,location,address,city,state,zipcode,isRemote,categories,compensation,compensationRange,salaryMin,salaryMax,salaryType,jobType,description,workSchedule,schedule,minimumAge,openingDate,closingDate,isOngoing,applicationDeadline,eligibility,applicationLink,hasTraining,hasAdvancement,requiresTransportation,requiresResume,photoUrl,isActive,isApproved';
    
    const csvRows = [CSV_HEADER];
    
    detailedOpportunities.forEach(opportunity => {
      const row = [
        `"${opportunity.companyName}"`,
        `"${opportunity.title}"`,
        `""`, //set nothing
        `"${opportunity.address || ''}"`, // address
        `"${opportunity.city || (opportunity.location === 'Virtual' ? '' : opportunity.location)}"`,
        `"${opportunity.state || 'CA'}"`,
        `"${opportunity.zipcode || ''}"`, // zipcode
        opportunity.isVirtual ? 'true' : 'false',
        '"Community Service"',
        '"Volunteer / Unpaid"',
        '""', // compensationRange
        '""', // salaryMin
        '""', // salaryMax
        '""', // salaryType
        '""', // jobType
        `"${opportunity.description.replace(/"/g, '""')}"`,
        '""', // workSchedule
        '""', // schedule
        '""', // minimumAge
        '""', // openingDate
        '""', // closingDate
        'true', // isOngoing
        '""', // applicationDeadline
        '""', // eligibility
        `"${opportunity.applicationLink}"`,
        'false', // hasTraining
        'false', // hasAdvancement
        'false', // requiresTransportation
        'false', // requiresResume
        '""', // photoUrl
        'true', // isActive
        'false' // isApproved
      ];
      
      csvRows.push(row.join(','));
    });

    // Save CSV file
    const filename = `volunteer-opportunities-${new Date().toISOString().split('T')[0]}.csv`;
    fs.writeFileSync(filename, csvRows.join('\n'));
    
    console.log(`\n🎉 Success! Generated ${detailedOpportunities.length} volunteer opportunities`);
    console.log(`📁 File saved: ${filename}`);
    console.log(`\n📊 Summary:`);
    console.log(`- Total: ${detailedOpportunities.length}`);
    console.log(`- Virtual: ${detailedOpportunities.filter(o => o.isVirtual).length}`);
    console.log(`- In-person: ${detailedOpportunities.filter(o => !o.isVirtual).length}`);
    
    // Show sample
    console.log(`\n📋 Sample data:`);
    detailedOpportunities.slice(0, 3).forEach((opp, i) => {
      console.log(`${i + 1}. ${opp.companyName} - ${opp.title} (${opp.location})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed');
  }
}

// Run the scraper
if (require.main === module) {
  scrapeVolunteerOpportunities().catch(console.error);
}

module.exports = { scrapeVolunteerOpportunities }; 