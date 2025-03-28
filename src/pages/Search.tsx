
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Users, User, UserPlus, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CustomBadge from '@/components/ui/CustomBadge';
import MessageButton from '@/components/messaging/MessageButton';
import { useAuthStore } from '@/stores/authStore';

interface UserResult {
  id: string;
  display_name: string;
  avatar_url: string | null;
  institution: string | null;
  bio: string | null;
}

interface ClubResult {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
}

const Search = () => {
  const { profile } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [clubResults, setClubResults] = useState<ClubResult[]>([]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Search users
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, institution, bio')
        .ilike('display_name', `%${searchQuery}%`)
        .order('display_name')
        .limit(20);
      
      if (userError) throw userError;
      setUserResults(userData as UserResult[]);
      
      // Search clubs/communities
      const { data: clubData, error: clubError } = await supabase
        .from('communities')
        .select('id, name, logo_url, description')
        .ilike('name', `%${searchQuery}%`)
        .order('name')
        .limit(20);
      
      if (clubError) throw clubError;
      setClubResults(clubData as ClubResult[]);
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const debounceTimer = setTimeout(() => {
        handleSearch();
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery]);

  const filteredResults = () => {
    if (selectedTab === 'people') return userResults;
    if (selectedTab === 'clubs') return [];
    return [...userResults];
  };

  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <motion.main 
        className="container py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search people, clubs, communities..." 
            className="pl-10 py-6 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="clubs">Clubs & Communities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : searchQuery.trim().length < 3 ? (
                <div className="text-center py-12">
                  <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">Search for people and communities</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter at least 3 characters to start searching for people, clubs, or communities.
                  </p>
                </div>
              ) : userResults.length === 0 && clubResults.length === 0 ? (
                <div className="text-center py-12">
                  <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No results found</h2>
                  <p className="text-muted-foreground">
                    We couldn't find any matches for "{searchQuery}". Try another search term.
                  </p>
                </div>
              ) : (
                <>
                  {userResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">People</h2>
                        {userResults.length > 3 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTab('people')}>
                            See all
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userResults.slice(0, 3).map(user => (
                          <UserCard key={user.id} user={user} isSelf={user.id === profile?.id} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {clubResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Clubs & Communities</h2>
                        {clubResults.length > 3 && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTab('clubs')}>
                            See all
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clubResults.slice(0, 3).map(club => (
                          <ClubCard key={club.id} club={club} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="people">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Searching for people...</p>
                </div>
              ) : userResults.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No people found</h2>
                  <p className="text-muted-foreground">
                    We couldn't find any people matching "{searchQuery}".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userResults.map(user => (
                    <UserCard key={user.id} user={user} isSelf={user.id === profile?.id} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="clubs">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Searching for clubs and communities...</p>
                </div>
              ) : clubResults.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No clubs or communities found</h2>
                  <p className="text-muted-foreground">
                    We couldn't find any clubs or communities matching "{searchQuery}".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clubResults.map(club => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.main>

      <BottomNavbar />
    </div>
  );
};

interface UserCardProps {
  user: UserResult;
  isSelf: boolean;
}

const UserCard = ({ user, isSelf }: UserCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="h-20 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
          <div className="px-4 pb-4 pt-0 -mt-10">
            <Avatar className="h-16 w-16 border-4 border-background">
              <AvatarImage src={user.avatar_url || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user.display_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="mt-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{user.display_name}</h3>
                {user.institution && (
                  <CustomBadge size="sm" variant="secondary" className="mt-1">
                    {user.institution}
                  </CustomBadge>
                )}
              </div>
              
              {user.bio && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <Button size="sm" variant="outline" onClick={() => window.location.href = `/profile/${user.id}`}>
                  View Profile
                </Button>
                
                {!isSelf && (
                  <MessageButton 
                    userId={user.id} 
                    userName={user.display_name} 
                    variant="outline"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ClubCardProps {
  club: ClubResult;
}

const ClubCard = ({ club }: ClubCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="h-20 bg-gradient-to-r from-secondary/20 to-primary/20"></div>
          <div className="px-4 pb-4 pt-0 -mt-10">
            <Avatar className="h-16 w-16 border-4 border-background">
              <AvatarImage src={club.logo_url || ""} />
              <AvatarFallback className="bg-secondary/10 text-secondary text-lg">
                {club.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="mt-2">
              <h3 className="font-semibold text-lg">{club.name}</h3>
              
              {club.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{club.description}</p>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <Button size="sm" variant="outline" onClick={() => window.location.href = `/clubs/${club.id}`}>
                  View Club
                </Button>
                
                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Search;
