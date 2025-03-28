
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
import HostEventForm from '@/components/events/HostEventForm';

interface CommunityDetailViewProps {
  communityId: string;
}

const CommunityDetailView = ({ communityId }: CommunityDetailViewProps) => {
  const navigate = useNavigate();
  const [showEventForm, setShowEventForm] = useState(false);
  
  // Mock community data (replace with actual API call)
  const community = {
    id: communityId,
    name: 'UI/UX Design Community',
    description: 'A community for UI/UX designers to share knowledge, get feedback, and collaborate on projects.',
    memberCount: 234,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    events: [
      { id: '1', title: 'Design Systems Workshop', date: '2023-06-15', attendees: 32 },
      { id: '2', title: 'UX Research Methods', date: '2023-07-10', attendees: 24 },
    ],
    members: [
      { id: '1', name: 'Alice Johnson', avatar: null, role: 'admin' },
      { id: '2', name: 'Bob Miller', avatar: null, role: 'member' },
    ]
  };
  
  const isMember = true; // Replace with actual check
  const isAdmin = true; // Replace with actual check
  
  const joinCommunity = () => {
    console.log('Joining community...');
  };
  
  const leaveCommunity = () => {
    console.log('Leaving community...');
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
          style={{ backgroundImage: `url(${community.banner})` }}
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
            <AvatarImage src={community.logo} />
            <AvatarFallback className="text-xl">{community.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{community.name}</h1>
              {community.isVerified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isMember ? (
                <Button variant="outline" onClick={leaveCommunity}>Leave</Button>
              ) : (
                <Button onClick={joinCommunity}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join
                </Button>
              )}
              
              {/* Any member can host events in communities */}
              {isMember && (
                <Button onClick={openEventForm}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Host Event
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{community.memberCount.toString()} members</span>
          </div>
          
          <p className="mt-4 text-muted-foreground">{community.description}</p>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Tabs */}
      <Tabs defaultValue="events" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="mt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Events
          </h3>
          
          {community.events.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {community.events.map(event => (
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
        
        <TabsContent value="members" className="mt-4">
          <h3 className="font-medium mb-3">Community Members</h3>
          
          <div className="space-y-2">
            {community.members.map(member => (
              <Card key={member.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                  
                  {member.role === 'admin' && (
                    <Badge variant="outline" size="sm">Admin</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-muted-foreground mt-4">
            This community has {community.memberCount.toString()} members in total.
          </p>
        </TabsContent>
      </Tabs>
      
      {showEventForm && (
        <HostEventForm
          open={showEventForm}
          onClose={closeEventForm}
          hostType="community"
          hostId={community.id}
          hostName={community.name}
        />
      )}
    </div>
  );
};

export default CommunityDetailView;
