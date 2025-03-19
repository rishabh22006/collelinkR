
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNavbar from '@/components/layout/BottomNavbar';
import { PlusCircle, Users, Calendar, Award } from 'lucide-react';

// Mock club data
const clubsData = [
  {
    id: 1,
    name: "Tech Enthusiasts",
    members: 128,
    category: "Technology",
    description: "A community for tech lovers and innovators.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: true
  },
  {
    id: 2,
    name: "Creative Arts Society",
    members: 94,
    category: "Arts",
    description: "Express yourself through various art forms.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: false
  },
  {
    id: 3,
    name: "Entrepreneurship Hub",
    members: 76,
    category: "Business",
    description: "Connect with fellow entrepreneurs and innovators.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: false
  },
  {
    id: 4,
    name: "Sports Club",
    members: 152,
    category: "Sports",
    description: "Join for various sporting activities and events.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: true
  }
];

// Club card component
const ClubCard = ({ club }: { club: typeof clubsData[0] }) => {
  const [isJoined, setIsJoined] = React.useState(club.isJoined);

  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-36 overflow-hidden">
        <img 
          src={club.image} 
          alt={club.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{club.name}</h3>
            <p className="text-sm text-muted-foreground">{club.category}</p>
          </div>
          <Button 
            variant={isJoined ? "secondary" : "default"} 
            size="sm"
            onClick={() => setIsJoined(!isJoined)}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Button>
        </div>
        <p className="text-sm mb-3">{club.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users size={14} className="mr-1" />
          <span>{club.members} members</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Clubs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Clubs & Communities</h1>
          <Button variant="ghost" size="icon" className="btn-icon">
            <PlusCircle size={20} />
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            <TabsTrigger value="all">All Clubs</TabsTrigger>
            <TabsTrigger value="joined">My Clubs</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
            <TabsTrigger value="arts">Arts</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {clubsData.map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="joined">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {clubsData.filter(club => club.isJoined).map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="tech">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {clubsData.filter(club => club.category === "Technology").map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="arts">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {clubsData.filter(club => club.category === "Arts").map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="sports">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {clubsData.filter(club => club.category === "Sports").map((club) => (
                <motion.div key={club.id} variants={itemVariants}>
                  <ClubCard club={club} />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Clubs;
