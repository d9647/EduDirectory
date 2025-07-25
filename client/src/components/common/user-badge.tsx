import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getContributionStats, type ContributionStats } from "@shared/utils";
import type { User } from "@shared/schema";

interface UserBadgeProps {
  user: User;
  contributionStats?: { listingsCount: number; reviewsCount: number };
  className?: string;
}

export function UserBadge({ user, contributionStats, className = "" }: UserBadgeProps) {
  if (!user.createdAt && !contributionStats) {
    return null;
  }

  const stats = contributionStats 
    ? getContributionStats(contributionStats.listingsCount, contributionStats.reviewsCount, user.createdAt)
    : null;

  // Show "NEW" badge for new users
  if (stats?.isNewUser) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs ${className}`}>
              NEW
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>New user - joined within the last 30 days</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Show contribution level badge
  if (stats && stats.totalContributions > 0) {
    const badgeColors = {
      contributor: "bg-bronze-100 text-bronze-800 hover:bg-bronze-200",
      active: "bg-silver-100 text-silver-800 hover:bg-silver-200", 
      top: "bg-gold-100 text-gold-800 hover:bg-gold-200"
    };

    const badgeColor = badgeColors[stats.level as keyof typeof badgeColors] || "bg-gray-100 text-gray-800 hover:bg-gray-200";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`${badgeColor} text-xs ${className}`}>
              {stats.level.toUpperCase()}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-medium">{stats.levelName}</p>
              <p>{stats.reviewsCount} reviews written</p>
              <p>{stats.listingsCount} listings added</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}