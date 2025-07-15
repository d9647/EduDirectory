// Text formatting utilities for descriptions and content

import React from 'react';

export function formatDescription(text: string | undefined | null): JSX.Element {
  if (!text) return React.createElement('span', { className: "text-gray-500 italic" }, 'No description provided');
  
  // Split by double newlines to create paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  
  return React.createElement('div', 
    { className: "space-y-3" },
    paragraphs.map((paragraph, index) => {
      // Process each paragraph for formatting
      const formattedParagraph = formatInlinText(paragraph.trim());
      return React.createElement('p', 
        { key: index, className: "text-gray-700 leading-relaxed" },
        formattedParagraph
      );
    })
  );
}

function formatInlinText(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let currentIndex = 0;
  
  // Simple bold formatting: **text** -> <strong>text</strong>
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.slice(currentIndex, match.index));
    }
    
    // Add the bold text
    parts.push(
      React.createElement('strong', 
        { key: `bold-${match.index}`, className: "font-semibold" },
        match[1]
      )
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  // If no formatting was found, return the original text
  return parts.length === 0 ? [text] : parts;
}

export function formatArrayField(items: string[] | string | undefined | null): string {
  if (!items) return "Not specified";
  
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed.join(", ") : items;
    } catch {
      return items;
    }
  }
  
  return Array.isArray(items) ? items.join(", ") : String(items);
}

export function formatSalary(salaryRange: string | undefined, salaryType: string | undefined): string {
  if (!salaryRange) return "Not specified";
  
  const typeLabel = salaryType === "hourly" ? "/hour" : 
                   salaryType === "monthly" ? "/month" : 
                   salaryType === "yearly" ? "/year" : "";
  
  return `${salaryRange}${typeLabel}`;
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Not specified";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return dateString;
  }
}

export function formatBoolean(value: boolean | undefined, trueText: string = "Yes", falseText: string = "No"): string {
  return value ? trueText : falseText;
}