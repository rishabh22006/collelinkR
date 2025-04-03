
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, UserMinus, CalendarPlus, Award, Calendar, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import HostEventForm from '@/components/events/HostEventForm';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import CommunityAdminManagement from '@/components/communities/CommunityAdminManagement';
import { CommunityDetails } from '@/hooks/useClubTypes';

export interface CommunityDetailViewProps {
  communityId: string;
  isOpen: boolean;
  onClose: () => void;
  onJoinToggle: (e?: React.MouseEvent) => void;
  isJoined?: boolean;
}

const CommunityDetailView = ({ communityId, isOpen, onClose, onJoinToggle, isJoined }: CommunityDetailViewProps) => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const { 
    getCommunity, 
    getCommunityMembershipStatus, 
    joinCommunity, 
    leaveCommunity,
    getCommunityMembers
  } = useCommunities();
  
  // Fetch community details
  const { 
    data: communityDetails, 
    isLoading,
    refetch: refetchCommunity 
  } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => getCommunity(communityId),
    enabled: isOpen && !!communityId
  });
  
  // Fetch membership status
  const {
    data: membershipStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['community-membership', communityId],
    queryFn: () => getCommunityMembershipStatus(communityId),
    enabled: isOpen && !!communityId && !!profile?.id
  });
  
  // Fetch community members
  const {
    data: members,
    isLoading: isMembersLoading,
    refetch: refetchMembers
  } = useQuery({
    queryKey: ['community-members', communityId],
    queryFn: async () => {
      // For demo purposes we'll use mock data
      // In a real app, you'd fetch from your backend
      const mockMembers = [
        {
          member_id: '1',
          joined_at: new Date().toISOString(),
          role: 'admin',
          display_name: 'Community Admin',
          avatar_url: null
        },
        {
          member_id: '2',
          joined_at: new Date().toISOString(),
          role: 'member',
          display_name: 'Regular Member',
          avatar_url: null
        }
      ];
      
      if (profile?.id) {
        // Add current user for demo purposes
        mockMembers.push({
          member_id: profile.id,
          joined_at: new Date().toISOString(),
          role: membershipStatus?.isAdmin ? 'admin' : 'member',
          display_name: profile.display_name,
          avatar_url: profile.avatar_url
        });
      }
      
      return mockMembers;
    },
    enabled: isOpen && !!communityId
  });
  
  const isAdmin = membershipStatus?.isAdmin || false;
  const isCreator = membershipStatus?.isCreator || false;
  const isMember = isJoined !== undefined ? isJoined : membershipStatus?.isMember || false;
  
  const handleJoinCommunity = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await joinCommunity.mutateAsync(communityId);
      refetchStatus();
      refetchCommunity();
      onJoinToggle(e);
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };
  
  const handleLeaveCommunity = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await leaveCommunity.mutateAsync(communityId);
      refetchStatus();
      refetchCommunity();
      onJoinToggle(e);
    } catch (error) {
      console.error('Failed to leave community:', error);
    }
  };
  
  const openEventForm = () => {
    setShowEventForm(true);
  };
  
  const closeEventForm = () => {
    setShowEventForm(false);
  };
  
  const openAdminManagement = () => {
    setShowAdminManagement(true);
  };
  
  const closeAdminManagement = () => {
    setShowAdminManagement(false);
    // Refetch community data after admin changes
    refetchCommunity();
    refetchMembers();
    refetchStatus();
  };
  
  // Sample events data
  const events = [
    { id: '1', title: 'Design Workshop', date: '2023-06-15', attendees: 32 },
    { id: '2', title: 'UX Research Session', date: '2023-07-10', attendees: 24 },
  ];
  
  // Dummy community data for now
  const community = communityDetails || {
    id: communityId,
    name: 'UI/UX Design Community',
    description: 'A community for UI/UX designers to share knowledge, get feedback, and collaborate on projects.',
    members_count: 234,
    is_verified: true,
    banner_url: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    logo_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
  };
  
  if (!isOpen) return null;
  
  return (
    <div>
      {/* Banner and Basic Info */}
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${community.banner_url || 'https://via.placeholder.com/800x400'})` }}
        />
        
        <div className="absolute top-4 left-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-background/80 backdrop-blur"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative px-4 pb-4 -mt-16">
          <Avatar className="h-24 w-24 border-4 border-background relative">
            <AvatarImage src={community.logo_url || undefined} />
            <AvatarFallback className="text-xl">{community.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{community.name}</h1>
              {(communityDetails?.is_verified || (community as any).is_verified) && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isMember ? (
                <Button variant="outline" onClick={handleLeaveCommunity}>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Leave
                </Button>
              ) : (
                <Button onClick={handleJoinCommunity}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join
                </Button>
              )}
              
              {/* Any member can host events, but only admins can manage the community */}
              {isMember && (
                <Button onClick={openEventForm}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Host Event
                </Button>
              )}
              
              {isAdmin && (
                <Button variant="outline" onClick={openAdminManagement}>
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{community.members_count || 0} members</span>
            
            {isAdmin && (
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
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
          
          {(!events || events.length === 0) ? (
            <p className="text-muted-foreground text-center py-6">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <motion.div 
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  className="border rounded-lg p-3"
                >
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{event.date}</span>
                    <span>{event.attendees} attending</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="members" className="mt-4">
          <h3 className="font-medium mb-3">Community Members</h3>
          
          <div className="space-y-2">
            {members && members.map(member => (
              <Card key={member.member_id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback>{member.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.display_name}</span>
                  </div>
                  
                  {member.role === 'admin' && (
                    <Badge variant="outline">Admin</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {isAdmin && (
            <Button variant="outline" className="mt-4 w-full" onClick={openAdminManagement}>
              <Shield className="h-4 w-4 mr-2" />
              Manage Admins
            </Button>
          )}
          
          <p className="text-muted-foreground mt-4">
            This community has {community.members_count || 0} members in total.
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
      
      {showAdminManagement && members && (
        <CommunityAdminManagement
          open={showAdminManagement}
          onClose={closeAdminManagement}
          communityId={communityId}
          isCreator={isCreator}
          members={members}
        />
      )}
    </div>
  );
};

export default CommunityDetailView;
