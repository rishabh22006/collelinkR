
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { ArrowLeft, Users, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getDefaultCategory } from '@/utils/dataUtils';

// Import refactored components
import ClubsFilter from '@/components/clubs/ClubsFilter';
import FeaturedSection from '@/components/clubs/FeaturedSection';
import ClubsTabContent from '@/components/clubs/ClubsTabContent';
import CommunitiesTabContent from '@/components/clubs/CommunitiesTabContent';

// Define extended types to include all possible properties
interface ExtendedClub {
  id: string;
  name: string;
  description?: string;
  institution?: string;
  logo_url?: string;
  banner_url?: string;
  category?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  creator_id?: string;
  created_at: string;
  updated_at?: string;
  member_count?: number;
  members_count?: number;
}

interface ExtendedCommunity {
  id: string;
  name: string;
  description?: string;
  institution?: string;
  logo_url?: string;
  banner_url?: string;
  is_featured?: boolean;
  is_private?: boolean;
  is_verified?: boolean;
  creator_id?: string;
  created_at: string;
  updated_at?: string;
  members_count?: number;
  member_count?: number;
}

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clubs");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // Fetch clubs from database
  const { data: clubsData = [], isLoading: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clubs:', error);
        return [];
      }

      // Add derived properties for compatibility
      return (data || []).map(club => ({
        ...club,
        category: getDefaultCategory() // Default category for all clubs
      })) as ExtendedClub[];
    }
  });
  
  // Fetch communities from database
  const { data: communitiesData = [], isLoading: isLoadingCommunities } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching communities:', error);
        return [];
      }
      
      return data || [];
    }
  });
  
  // Extract all unique categories and add 'General' as default
  useEffect(() => {
    if (clubsData.length > 0) {
      const categoriesSet = new Set<string>();
      
      // Add 'General' as a default category
      categoriesSet.add('General');
      
      // Add any other categories found in clubs
      clubsData.forEach(club => {
        if (club.category) {
          categoriesSet.add(club.category);
        }
      });
      
      setAllCategories(Array.from(categoriesSet).sort());
    }
  }, [clubsData]);

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
      (club.institution && club.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.category && club.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeFilters.length === 0 || 
                           (club.category && activeFilters.includes(club.category));
    
    return matchesSearch && matchesCategory;
  });

  const filteredCommunities = communitiesData.filter(community => {
    const matchesSearch = 
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (community.description && community.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For communities, we're using the same filters as clubs for simplicity
    const matchesCategory = activeFilters.length === 0;
    
    return matchesSearch && matchesCategory;
  });

  const featuredClubs = filteredClubs.filter(club => club.is_featured);
  const featuredCommunities = filteredCommunities.filter(community => community.is_featured);

  // Transform clubs for FeaturedClubCard
  const transformClubForFeatured = (club: ExtendedClub) => ({
    id: Number(club.id), // Convert string ID to number for compatibility
    name: club.name,
    institution: club.institution || '',
    category: club.category || 'General',
    image: club.logo_url || '',
    isJoined: false,
    isFeatured: true,
    members: club.member_count || club.members_count || 0,
    description: club.description || ''
  });

  // Transform community for FeaturedClubCard
  const transformCommunityForFeatured = (community: ExtendedCommunity) => ({
    id: Number(community.id), // Convert string ID to number for compatibility
    name: community.name,
    institution: community.institution || '',
    category: 'Community',
    image: community.logo_url || '',
    isJoined: false,
    isFeatured: true,
    members: community.members_count || community.member_count || 0,
    description: community.description || ''
  });

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

  // Loading placeholders
  const renderSkeletons = (count: number) => (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-border p-4">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="w-16 h-16 rounded-full mb-3" />
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <TopNavbar />
      
      <div className="container py-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Clubs & Communities</h1>
        </div>
        
        <ClubsFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={allCategories}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
        />

        {/* Featured Clubs Section */}
        <FeaturedSection 
          activeTab={activeTab}
          featuredClubs={featuredClubs}
          featuredCommunities={featuredCommunities}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          transformClubForFeatured={transformClubForFeatured}
          transformCommunityForFeatured={transformCommunityForFeatured}
        />

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
            <ClubsTabContent 
              isLoading={isLoadingClubs}
              filteredClubs={filteredClubs}
              renderSkeletons={renderSkeletons}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
            />
          </TabsContent>
          
          <TabsContent value="communities">
            <CommunitiesTabContent 
              isLoading={isLoadingCommunities}
              filteredCommunities={filteredCommunities}
              renderSkeletons={renderSkeletons}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Clubs;
