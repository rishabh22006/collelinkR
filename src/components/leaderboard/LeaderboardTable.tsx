
import React from 'react';
import { LeaderboardEntry } from '@/types/certificates';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trophy, Award, Medal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  highlightUserId?: string;
  showInstitution?: boolean;
  compact?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  entries, 
  isLoading = false,
  highlightUserId,
  showInstitution = true,
  compact = false
}) => {
  const { profile } = useAuth();

  const getRankIcon = (rank: number | null) => {
    if (!rank) return null;
    
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  const getNameInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
        <h3 className="text-lg font-medium">No leaderboard data</h3>
        <p className="text-muted-foreground">
          Start adding certificates to appear on the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead>Student</TableHead>
            {showInstitution && <TableHead className={compact ? 'hidden md:table-cell' : ''}>Institution</TableHead>}
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const isCurrentUser = entry.student_id === profile?.id || entry.student_id === highlightUserId;
            const rankDisplay = entry.overall_rank || entry.institution_rank;
            
            return (
              <TableRow 
                key={entry.id}
                className={cn(
                  isCurrentUser && "bg-primary/5 font-medium"
                )}
              >
                <TableCell className="text-center font-medium">
                  <div className="flex justify-center items-center">
                    {getRankIcon(rankDisplay) || rankDisplay || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.avatar_url || undefined} alt={entry.display_name} />
                      <AvatarFallback>{getNameInitials(entry.display_name)}</AvatarFallback>
                    </Avatar>
                    <span className={isCurrentUser ? "font-semibold" : ""}>
                      {entry.display_name || 'Unknown User'}
                      {isCurrentUser && <span className="ml-1 text-xs text-primary">(You)</span>}
                    </span>
                  </div>
                </TableCell>
                {showInstitution && (
                  <TableCell className={compact ? 'hidden md:table-cell' : ''}>
                    {entry.institution || 'Not specified'}
                  </TableCell>
                )}
                <TableCell className="text-right font-medium">
                  {entry.total_points}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
