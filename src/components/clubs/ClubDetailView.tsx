
import React, { useState } from 'react';
import { ArrowLeft, Users, UserPlus, CalendarPlus, Award, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useClubs } from '@/hooks/useClubs';
import { useAuthStore } from '@/stores/authStore';
import HostEventForm from '@/components/events/HostEventForm';

interface ClubDetailViewProps {
  clubId: string;
}

const ClubDetailView = ({ clubId }: ClubDetailViewProps) => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [showEventForm, setShowEventForm] = useState(false);
  
  // Mock club data (replace with actual API call)
  const club = {
    id: clubId,
    name: 'Photography Club',
    description: 'A community for photography enthusiasts to share their work, learn new techniques, and participate in photo walks and workshops.',
    memberCount: 156,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1506241537529-eefea1fbe44d',
    logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    events: [
      { id: '1', title: 'Photo Walk', date: '2023-06-15', attendees: 24 },
      { id: '2', title: 'Portrait Workshop', date: '2023-07-10', attendees: 18 },
    ],
    admins: [
      { id: '1', name: 'John Smith', avatar: null },
      { id: '2', name: 'Emma Davis', avatar: null },
    ]
  };
  
  const isAdmin = true; // Replace with actual check
  const isMember = true; // Replace with actual check
  
  const joinClub = () => {
    console.log('Joining club...');
  };
  
  const leaveClub = () => {
    console.log('Leaving club...');
  };
  
  const openEventForm = () => {
    setShowEventForm(true);
  };
  
  const closeEventForm = () => {
    setShowEventForm(false);
  };
  
  return (
    <div>
      {/* Banner and Basic Info */}
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${club.banner})` }}
        />
        
        <div className="absolute top-4 left-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-background/80 backdrop-blur"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative px-4 pb-4 -mt-16">
          <Avatar className="h-24 w-24 border-4 border-background relative">
            <AvatarImage src={club.logo} />
            <AvatarFallback className="text-xl">{club.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{club.name}</h1>
              {club.isVerified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isMember ? (
                <Button variant="outline" onClick={leaveClub}>Leave</Button>
              ) : (
                <Button onClick={joinClub}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join
                </Button>
              )}
              
              {isAdmin && (
                <Button onClick={openEventForm}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Host Event
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{club.memberCount.toString()} members</span>
          </div>
          
          <p className="mt-4 text-muted-foreground">{club.description}</p>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Tabs */}
      <Tabs defaultValue="events" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="mt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Events
          </h3>
          
          {club.events.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {club.events.map(event => (
                <motion.div 
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  className="border rounded-lg p-3"
                >
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{event.date}</span>
                    <span>{event.attendees.toString()} attending</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="admins" className="mt-4">
          <h3 className="font-medium mb-3">Club Administrators</h3>
          
          <div className="space-y-2">
            {club.admins.map(admin => (
              <Card key={admin.id}>
                <CardContent className="p-3 flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={admin.avatar || undefined} />
                    <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{admin.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="mt-4">
          <h3 className="font-medium mb-3">Club Members</h3>
          
          <p className="text-muted-foreground">
            This club has {club.memberCount.toString()} members in total.
          </p>
          
          {/* You could add a members list here with pagination */}
        </TabsContent>
      </Tabs>
      
      {showEventForm && (
        <HostEventForm
          open={showEventForm}
          onClose={closeEventForm}
          hostType="club"
          hostId={club.id}
          hostName={club.name}
        />
      )}
    </div>
  );
};

export default ClubDetailView;
