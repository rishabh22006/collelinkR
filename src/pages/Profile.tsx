import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Calendar, MessageSquare, Edit, ArrowLeft, Check, Plus, ClipboardList, Pencil, MapPin, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import CustomBadge from '@/components/ui/CustomBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "No bio yet. Click edit to add one.");
  const [editableBio, setEditableBio] = useState(profile?.bio || "");
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Load user's registered events
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!profile?.id) return;
      
      setLoadingEvents(true);
      
      try {
        // Get event attendances for the user
        const { data: attendances, error: attendanceError } = await supabase
          .from('event_attendees')
          .select('*')
          .eq('attendee_id', profile.id)
          .order('registered_at', { ascending: false })
          .limit(5);
          
        if (attendanceError) throw attendanceError;
        
        if (attendances && attendances.length > 0) {
          // Get details for these events
          const eventIds = attendances.map(a => a.event_id);
          
          const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds);
            
          if (eventsError) throw eventsError;
          
          // Combine the data
          const eventsWithAttendance = events.map(event => {
            const attendance = attendances.find(a => a.event_id === event.id);
            return {
              ...event,
              registered_at: attendance?.registered_at
            };
          });
          
          setRegisteredEvents(eventsWithAttendance);
        } else {
          setRegisteredEvents([]);
        }
      } catch (error) {
        console.error('Error fetching user events:', error);
        toast.error('Failed to load your events');
      } finally {
        setLoadingEvents(false);
      }
    };
    
    fetchUserEvents();
  }, [profile?.id]);
  
  const savedBio = async () => {
    if (!profile?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ bio: editableBio })
        .eq('id', profile.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setBio(editableBio);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <header className="container py-4 flex items-center">
        <Button variant="ghost" size="icon" asChild>
          <ArrowLeft className="h-5 w-5" onClick={() => window.history.back()} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Profile</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="icon">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings size={18} />
          </Button>
        </div>
      </header>

      <main className="container py-4">
        <motion.div 
          className="flex flex-col items-center text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 relative">
            {profile?.avatar_url ? (
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                <AvatarFallback>{profile.display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            ) : (
              <User size={40} className="text-muted-foreground" />
            )}
            <div className="absolute bottom-0 right-0">
              <CustomBadge variant="primary" size="sm">Student</CustomBadge>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold">{profile?.display_name || 'Your Profile'}</h2>
          <p className="text-sm text-muted-foreground">
            @{profile?.display_name?.toLowerCase().replace(/\s+/g, '') || 'username'} • {profile?.institution || 'MIT ADT University'}
          </p>
          
          <div className="flex justify-center gap-6 my-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">{registeredEvents.length}</h3>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <div className="bg-card rounded-lg p-4 border text-left mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">About</h3>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={savedBio}>
                      <Check size={14} className="mr-1" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded-md text-sm"
                  rows={4}
                  value={editableBio}
                  onChange={(e) => setEditableBio(e.target.value)}
                  placeholder="Write something about yourself"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{bio}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 mb-6">
            <Button asChild>
              <Link to="/messages">
                <MessageSquare size={14} className="mr-1" />
                Message
              </Link>
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut size={14} className="mr-1" />
              Logout
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="events" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="details">My Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Registered Events</h3>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/calendar">
                      <Calendar size={14} className="mr-1" />
                      Calendar
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/">
                      <Plus size={14} className="mr-1" />
                      Find Events
                    </Link>
                  </Button>
                </div>
              </div>
              
              {loadingEvents ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : registeredEvents.length > 0 ? (
                <div className="space-y-3">
                  {registeredEvents.map(event => (
                    <motion.div
                      key={event.id}
                      className="p-4 border rounded-lg flex justify-between items-center"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {event.location || 'Online'}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="mx-auto mb-4 text-muted-foreground" size={40} />
                  <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't registered for any events yet.</p>
                  <Button asChild>
                    <Link to="/">
                      <Plus size={14} className="mr-1" />
                      Browse Events
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{profile?.display_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Institution</p>
                    <p className="font-medium">{profile?.institution || 'MIT ADT University'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">May 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Account Settings</h3>
                  <Button variant="outline" size="sm">
                    <Settings size={14} className="mr-1" />
                    Settings
                  </Button>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messaging Preferences
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-destructive hover:text-destructive" 
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Profile;
