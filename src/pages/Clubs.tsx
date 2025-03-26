
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { PlusCircle, Search, ArrowLeft, Users, UserCheck, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

// Mock club data with institution information and featured status
const clubsData = [
  {
    id: 1,
    name: "Abit rgit",
    institution: "RGIT",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: true,
    members: 320
  },
  {
    id: 2,
    name: "ACE committee",
    institution: "GPT",
    category: "Management",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: false,
    isFeatured: false,
    members: 145
  },
  {
    id: 3,
    name: "CodeX Club",
    institution: "PDEA",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: false,
    isFeatured: true,
    members: 280
  },
  {
    id: 4,
    name: "CSE (AIML) Department",
    institution: "SIGCE",
    category: "Academic",
    image: "",
    isJoined: true,
    isFeatured: false,
    members: 210
  },
  {
    id: 5,
    name: "CSI Chapter",
    institution: "LTCE",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: true,
    isFeatured: true,
    members: 350
  },
  {
    id: 6,
    name: "CSI VIT",
    institution: "VIT",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 175
  },
  {
    id: 7,
    name: "Eloquence Club",
    institution: "SIGCE",
    category: "Communication",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 120
  },
  {
    id: 8,
    name: "EN. IC. Centre",
    institution: "SIGCE",
    category: "Innovation",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 90
  },
  {
    id: 9,
    name: "FOSS SIGCE",
    institution: "SIGCE",
    category: "Open Source",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 150
  },
  {
    id: 10,
    name: "GDG on Campus",
    institution: "LTCE",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 200
  },
  {
    id: 11,
    name: "Google developer groups on",
    institution: "NMIMS",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 230
  },
  {
    id: 12,
    name: "Google Developer Groups On Campus",
    institution: "SIES",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 185
  }
];

// Mock community data
const communitiesData = [
  {
    id: 1,
    name: "Computer Science Club",
    institution: "RGIT",
    members: 245,
    description: "For CS enthusiasts to collaborate and learn together.",
    isJoined: false,
    isFeatured: true
  },
  {
    id: 2,
    name: "Engineering Society",
    institution: "GPT",
    members: 187,
    description: "Connect with fellow engineering students and professionals.",
    isJoined: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "Arts & Culture",
    institution: "PDEA",
    members: 156,
    description: "Discuss art, literature and cultural events around campus.",
    isJoined: false,
    isFeatured: false
  },
  {
    id: 4,
    name: "Sports Club",
    institution: "SIGCE",
    members: 320,
    description: "Join teams, find workout partners, and discuss sports.",
    isJoined: false,
    isFeatured: false
  },
];

// Featured Club card component
const FeaturedClubCard = ({ club }: { club: typeof clubsData[0] }) => {
  const [isJoined, setIsJoined] = useState(club.isJoined);
  const logoPlaceholder = club.name.charAt(0);

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0">
          {club.image ? (
            <img src={club.image} alt={club.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-foreground">{club.name}</h3>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{club.institution}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs py-0">
              <Users className="h-3 w-3 mr-1" />
              {club.members} members
            </Badge>
            <Badge variant="outline" className="text-xs py-0">
              {club.category}
            </Badge>
          </div>
        </div>
        <Button 
          variant={isJoined ? "secondary" : "default"} 
          size="sm"
          className="shrink-0"
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </motion.div>
  );
};

// Club card component
const ClubCard = ({ club }: { club: typeof clubsData[0] }) => {
  const [isJoined, setIsJoined] = useState(club.isJoined);
  const logoPlaceholder = club.name.charAt(0);

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
          {club.image ? (
            <img src={club.image} alt={club.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
          )}
        </div>
        <h3 className="font-medium text-base mb-1 text-foreground">{club.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{club.institution}</p>
        <Button 
          variant={isJoined ? "secondary" : "default"} 
          size="sm"
          className="w-full"
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </motion.div>
  );
};

// Community card component
const CommunityCard = ({ community }: { community: typeof communitiesData[0] }) => {
  const [isJoined, setIsJoined] = useState(community.isJoined);
  const logoPlaceholder = community.name.charAt(0);

  return (
    <motion.div 
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
          <span className="text-xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
        </div>
        <h3 className="font-medium text-base mb-1 text-foreground">{community.name}</h3>
        <p className="text-sm text-muted-foreground mb-1">{community.institution}</p>
        <p className="text-xs text-muted-foreground mb-3">{community.members} members</p>
        <Button 
          variant={isJoined ? "secondary" : "default"} 
          size="sm"
          className="w-full"
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </motion.div>
  );
};

const RegisterClubCard = () => (
  <motion.div 
    className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="p-4 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <PlusCircle className="text-primary" size={24} />
      </div>
      <h3 className="font-medium text-base mb-1 text-foreground">Get Your Club Listed</h3>
      <p className="text-sm text-muted-foreground mb-3">Register here</p>
      <Button 
        variant="outline" 
        size="sm"
        className="w-full"
      >
        Register
      </Button>
    </div>
  </motion.div>
);

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clubs");
  
  const filteredClubs = clubsData.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommunities = communitiesData.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <FeaturedClubCard club={{...community, category: "Community", members: community.members}} />
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

              <motion.div 
                variants={itemVariants}
                className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <PlusCircle className="text-primary" size={24} />
                  </div>
                  <h3 className="font-medium text-base mb-1 text-foreground">Create New Community</h3>
                  <p className="text-sm text-muted-foreground mb-3">Connect with peers</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Create
                  </Button>
                </div>
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
