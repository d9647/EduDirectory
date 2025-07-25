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

  if (!stats) return null;

  const badges = [];

  // Always show "NEW" badge for new users (if applicable)
  if (stats.isNewUser) {
    badges.push(
      <TooltipProvider key="new">
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">
              🆕 NEW
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>New user - joined within the last 30 days</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Always show contribution level badge (if applicable)
  if (stats.totalContributions > 0) {
    const badgeColors = {
      contributor: "bg-orange-100 text-orange-800 hover:bg-orange-200", // Bronze
      active: "bg-slate-100 text-slate-800 hover:bg-slate-200", // Silver
      top: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" // Gold
    };

    const badgeIcons = {
      contributor: "🥉", // Bronze medal
      active: "🥈", // Silver medal
      top: "🥇" // Gold medal
    };

    const badgeColor = badgeColors[stats.level as keyof typeof badgeColors] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
    const badgeIcon = badgeIcons[stats.level as keyof typeof badgeIcons] || "";

    badges.push(
      <TooltipProvider key="contribution">
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`${badgeColor} text-xs`}>
              {badgeIcon} {stats.levelName}
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

  if (badges.length === 0) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {badges}
    </div>
  );
}