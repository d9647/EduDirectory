import type { User } from "./schema";

// Display name utility with priority: nickname > firstName + lastName > firstName > lastName > email > Anonymous
export function getDisplayName(user: User | null | undefined): string {
  if (!user) return "Anonymous User";
  
  if (user.nickname?.trim()) {
    return user.nickname.trim();
  }
  
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (firstName) {
    return firstName;
  }
  
  if (lastName) {
    return lastName;
  }
  
  if (user.email) {
    const emailUser = user.email.split('@')[0];
    return emailUser;
  }
  
  return "Anonymous User";
}

// Contribution level calculation
export interface ContributionStats {
  listingsCount: number;
  reviewsCount: number;
  totalContributions: number;
  level: "newcomer" | "contributor" | "active" | "top";
  levelName: string;
  isNewUser: boolean;
}

export function getContributionLevel(listingsCount: number, reviewsCount: number): ContributionStats["level"] {
  const total = listingsCount + reviewsCount;
  
  if (total >= 15) return "top";
  if (total >= 5) return "active";
  if (total >= 1) return "contributor";
  return "newcomer";
}

export function getContributionLevelName(level: ContributionStats["level"]): string {
  const levelNames = {
    newcomer: "Newcomer",
    contributor: "Contributor", 
    active: "Active Member",
    top: "Top Contributor"
  };
  return levelNames[level];
}

// Check if user is new (registered within last 30 days)
export function isNewUser(createdAt: Date | string | null | undefined): boolean {
  if (!createdAt) return false;
  
  const created = new Date(createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return created > thirtyDaysAgo;
}

// Get user contribution stats
export function getContributionStats(
  listingsCount: number, 
  reviewsCount: number, 
  createdAt: Date | string | null | undefined
): ContributionStats {
  const totalContributions = listingsCount + reviewsCount;
  const level = getContributionLevel(listingsCount, reviewsCount);
  const levelName = getContributionLevelName(level);
  const userIsNew = isNewUser(createdAt);
  
  return {
    listingsCount,
    reviewsCount,
    totalContributions,
    level,
    levelName,
    isNewUser: userIsNew
  };
}