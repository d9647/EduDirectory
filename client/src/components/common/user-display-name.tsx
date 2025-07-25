import { getDisplayName } from "@shared/utils";
import type { User } from "@shared/schema";
import { UserBadge } from "./user-badge";

interface UserDisplayNameProps {
  user: User | null | undefined;
  contributionStats?: { listingsCount: number; reviewsCount: number };
  showBadge?: boolean;
  className?: string;
}

export function UserDisplayName({ 
  user, 
  contributionStats, 
  showBadge = false, 
  className = "" 
}: UserDisplayNameProps) {
  const displayName = getDisplayName(user);
  
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span>{displayName}</span>
      {showBadge && user && (
        <UserBadge user={user} contributionStats={contributionStats} />
      )}
    </span>
  );
}