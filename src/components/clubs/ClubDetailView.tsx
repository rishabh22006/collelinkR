
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, UserCheck, UserMinus, CalendarPlus, Award, Calendar, Settings, Shield } from 'lucide-react';
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
import { useQuery } from '@tanstack/react-query';
import { ClubMemberWithProfile } from '@/hooks/useClubTypes';
import AdminManagement from './AdminManagement';

export interface ClubDetailViewProps {
  clubId: string;
  isOpen: boolean;
  onClose: () => void;
  onJoinToggle: (e?: React.MouseEvent) => void;
  isJoined?: boolean;
}

const ClubDetailView = ({ clubId, isOpen, onClose, onJoinToggle, isJoined }: ClubDetailViewProps) => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const { getClub, isClubAdmin, getClubMembershipStatus, joinClub, leaveClub } = useClubs();
  
  // Fetch club details
  const { 
    data: clubDetails, 
    isLoading,
    refetch: refetchClub 
  } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => getClub(clubId),
    enabled: isOpen && !!clubId
  });
  
  // Fetch membership status
  const {
    data: membershipStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['club-membership', clubId],
    queryFn: () => getClubMembershipStatus(clubId),
    enabled: isOpen && !!clubId && !!profile?.id
  });
  
  // Fetch club members
  const {
    data: members,
    isLoading: isMembersLoading,
    refetch: refetchMembers
  } = useQuery({
    queryKey: ['club-members', clubId],
    queryFn: async () => {
      // This would be a real function call to your backend to get members with profiles
      // For example purposes, we'll mock this
      const mockMembers: ClubMemberWithProfile[] = [
        { 
          user_id: '1', 
          joined_at: new Date().toISOString(),
          is_admin: true,
          display_name: 'Admin User',
          avatar_url: null
        },
        { 
          user_id: '2', 
          joined_at: new Date().toISOString(),
          is_admin: false,
          display_name: 'Regular Member',
          avatar_url: null
        },
      ];
      
      if (profile?.id) {
        // Add current user for demo purposes
        mockMembers.push({
          user_id: profile.id,
          joined_at: new Date().toISOString(),
          is_admin: membershipStatus?.isAdmin || false,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url
        });
      }
      
      return mockMembers;
    },
    enabled: isOpen && !!clubId
  });
  
  const isAdmin = membershipStatus?.isAdmin || false;
  const isCreator = membershipStatus?.isCreator || false;
  const isMember = isJoined !== undefined ? isJoined : membershipStatus?.isMember || false;
  
  const handleJoinClub = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await joinClub.mutateAsync(clubId);
      refetchStatus();
      refetchClub();
      onJoinToggle(e);
    } catch (error) {
      console.error('Failed to join club:', error);
    }
  };
  
  const handleLeaveClub = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await leaveClub.mutateAsync(clubId);
      refetchStatus();
      refetchClub();
      onJoinToggle(e);
    } catch (error) {
      console.error('Failed to leave club:', error);
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
    // Refetch club data after admin changes
    refetchClub();
    refetchMembers();
    refetchStatus();
  };
  
  // Dummy club data for now
  const club = clubDetails || {
    id: clubId,
    name: 'Photography Club',
    description: 'A community for photography enthusiasts to share their work, learn new techniques, and participate in photo walks and workshops.',
    member_count: 156,
    is_verified: true,
    banner_url: 'https://images.unsplash.com/photo-1506241537529-eefea1fbe44d',
    logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    events: [
      { id: '1', title: 'Photo Walk', date: '2023-06-15', attendees: 24 },
      { id: '2', title: 'Portrait Workshop', date: '2023-07-10', attendees: 18 },
    ]
  };
  
  if (!isOpen) return null;
  
  return (
    <div>
      {/* Banner and Basic Info */}
      <div className="relative">
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${club.banner_url || 'https://via.placeholder.com/800x400'})` }}
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
            <AvatarImage src={club.logo_url || undefined} />
            <AvatarFallback className="text-xl">{club.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{club.name}</h1>
              {club.is_verified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isMember ? (
                <Button variant="outline" onClick={handleLeaveClub}>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Leave
                </Button>
              ) : (
                <Button onClick={handleJoinClub}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join
                </Button>
              )}
              
              {isAdmin && (
                <>
                  <Button onClick={openEventForm}>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Host Event
                  </Button>
                  <Button variant="outline" onClick={openAdminManagement}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{club.members_count || 0} members</span>
            
            {isAdmin && (
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
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
          
          {(!club.events || club.events.length === 0) ? (
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
                    <span>{event.attendees} attending</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="admins" className="mt-4">
          <h3 className="font-medium mb-3">Club Administrators</h3>
          
          <div className="space-y-2">
            {members && members
              .filter(admin => admin.is_admin)
              .map(admin => (
                <Card key={admin.user_id}>
                  <CardContent className="p-3 flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={admin.avatar_url || undefined} />
                      <AvatarFallback>{admin.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{admin.display_name}</span>
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
        </TabsContent>
        
        <TabsContent value="members" className="mt-4">
          <h3 className="font-medium mb-3">Club Members</h3>
          
          <p className="text-muted-foreground">
            This club has {club.members_count || 0} members in total.
          </p>
          
          <div className="space-y-2 mt-4">
            {members && members.map(member => (
              <Card key={member.user_id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback>{member.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.display_name}</span>
                  </div>
                  
                  {member.is_admin && (
                    <Badge variant="outline">Admin</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
      
      {showAdminManagement && members && (
        <AdminManagement
          open={showAdminManagement}
          onClose={closeAdminManagement}
          clubId={clubId}
          isCreator={isCreator}
          members={members}
        />
      )}
    </div>
  );
};

export default ClubDetailView;
