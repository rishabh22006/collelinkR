
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Search, ArrowLeft, Users, UserCheck, Star, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Import refactored components
import FeaturedClubCard from '@/components/clubs/FeaturedClubCard';
import ClubCard from '@/components/clubs/ClubCard';
import CommunityCard from '@/components/clubs/CommunityCard';
import RegisterClubCard from '@/components/clubs/RegisterClubCard';
import CreateCommunityCard from '@/components/clubs/CreateCommunityCard';

// Import data
import { clubsData, communitiesData } from '@/data/clubsData';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clubs");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // Extract unique categories from club and community data
  useEffect(() => {
    const clubCategories = [...new Set(clubsData.map(club => club.category))];
    setAllCategories(clubCategories.sort());
  }, []);

  // Toggle filter function
  const toggleFilter = (category: string) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(filter => filter !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  const filteredClubs = clubsData.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeFilters.length === 0 || activeFilters.includes(club.category);
    
    return matchesSearch && matchesCategory;
  });

  const filteredCommunities = communitiesData.filter(community => {
    const matchesSearch = 
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For communities, we're using the same filters as clubs for simplicity
    // In a real app, you might have different categories for communities
    const matchesCategory = activeFilters.length === 0;
    
    return matchesSearch && matchesCategory;
  });

  const featuredClubs = filteredClubs.filter(club => club.isFeatured);
  const featuredCommunities = filteredCommunities.filter(community => community.isFeatured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <TopNavbar />
      
      <div className="container py-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Clubs & Communities</h1>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search clubs and communities..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter UI */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-foreground">Filter by category:</h2>
            {activeFilters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 px-2 text-xs"
              >
                <X size={14} className="mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
              <Badge
                key={category}
                variant={activeFilters.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Clubs Section */}
        {(featuredClubs.length > 0 || featuredCommunities.length > 0) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              Featured
            </h2>
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {activeTab === "clubs" && featuredClubs.map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <FeaturedClubCard club={club} />
                </motion.div>
              ))}
              
              {activeTab === "communities" && featuredCommunities.map((community) => (
                <motion.div key={community.id} variants={itemVariants}>
                  <FeaturedClubCard club={{
                    ...community, 
                    category: "Community",
                    members: community.members,
                  }} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clubs" className="flex items-center gap-2">
              <UserCheck size={16} />
              <span>Clubs</span>
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <Users size={16} />
              <span>Communities</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clubs">
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <RegisterClubCard />
              </motion.div>
              
              {filteredClubs
                .filter(club => !club.isFeatured)
                .map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="communities">
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCommunities
                .filter(community => !community.isFeatured)
                .map((community) => (
                <motion.div key={community.id} variants={itemVariants}>
                  <CommunityCard community={community} />
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <CreateCommunityCard />
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Clubs;
