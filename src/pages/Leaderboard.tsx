
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/hooks/useAuth';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Award, Medal, Share2, Download, Trophy, Globe, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const Leaderboard = () => {
  const { profile } = useAuth();
  const { 
    leaderboard, 
    institutionLeaderboard, 
    userRank,
    isLoading,
    isInstitutionLoading 
  } = useLeaderboard();
  
  const [viewType, setViewType] = useState<'global' | 'institution'>('global');

  const handleShare = () => {
    if (userRank) {
      if (navigator.share) {
        navigator.share({
          title: 'My Certificate Ranking',
          text: `I've earned ${userRank.total_points} points and ranked #${userRank.overall_rank} on the Certificates Leaderboard!`,
          url: window.location.href,
        }).catch(() => {
          toast.info('Copied leaderboard share link to clipboard');
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(
          `I've earned ${userRank.total_points} points and ranked #${userRank.overall_rank} on the Certificates Leaderboard! ${window.location.href}`
        );
        toast.info('Copied leaderboard share link to clipboard');
      }
    }
  };

  const handleDownloadBadge = () => {
    toast.success('Achievement badge added to your profile', { 
      description: 'You can now display this on your resume'
    });
  };

  const getRankColor = (rank: number | null) => {
    if (!rank) return 'bg-gray-100 text-gray-500';
    if (rank === 1) return 'bg-yellow-100 text-yellow-700';
    if (rank === 2) return 'bg-gray-100 text-gray-700';
    if (rank === 3) return 'bg-amber-100 text-amber-700';
    if (rank <= 10) return 'bg-emerald-100 text-emerald-700';
    return 'bg-blue-100 text-blue-700';
  };

  const getRankTitle = (rank: number | null) => {
    if (!rank) return 'Not Ranked';
    if (rank === 1) return 'Gold Champion';
    if (rank === 2) return 'Silver Achiever';
    if (rank === 3) return 'Bronze Achiever';
    if (rank <= 10) return 'Top Performer';
    if (rank <= 50) return 'High Achiever';
    return 'Rising Star';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen pb-16">
      <TopNavbar />
      
      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Achievements Leaderboard</h1>
              <p className="text-muted-foreground">
                See how you rank among your peers
              </p>
            </div>
          </div>

          {userRank && (
            <Card className="mb-8 border-t-4 shadow-sm" style={{ borderTopColor: 'hsl(var(--primary))' }}>
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center">
                  <Trophy className="h-5 w-5 text-primary" />
                  Your Ranking
                </CardTitle>
                <CardDescription>
                  Based on your certificate achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${getRankColor(userRank.overall_rank)}`}>
                      <span className="text-lg font-bold">
                        {userRank.overall_rank || '-'}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Global Rank</div>
                      <div className="text-xs text-muted-foreground">
                        {getRankTitle(userRank.overall_rank)}
                      </div>
                    </div>
                  </div>

                  {userRank.institution && (
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-2 ${getRankColor(userRank.institution_rank)}`}>
                        <span className="text-lg font-bold">
                          {userRank.institution_rank || '-'}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Institution Rank</div>
                        <div className="text-xs text-muted-foreground truncate max-w-full">
                          {userRank.institution}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 mb-2">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Total Points</div>
                      <div className="text-xl font-bold text-primary">
                        {userRank.total_points}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-1"
                  onClick={handleDownloadBadge}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Add to Resume
                </Button>
              </CardFooter>
            </Card>
          )}

          <Tabs defaultValue="global" onValueChange={(value) => setViewType(value as 'global' | 'institution')}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="global" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Global
              </TabsTrigger>
              <TabsTrigger value="institution" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Institution
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global">
              <div className="bg-card rounded-lg border">
                <div className="p-4 border-b">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Global Leaderboard
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Top achievers across all institutions
                  </p>
                </div>
                <LeaderboardTable 
                  entries={leaderboard}
                  isLoading={isLoading}
                  highlightUserId={profile?.id}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="institution">
              <div className="bg-card rounded-lg border">
                <div className="p-4 border-b">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Institution Leaderboard
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Top achievers at {profile?.institution || 'your institution'}
                  </p>
                </div>
                <LeaderboardTable 
                  entries={institutionLeaderboard}
                  isLoading={isInstitutionLoading}
                  highlightUserId={profile?.id}
                  showInstitution={false}
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default Leaderboard;
