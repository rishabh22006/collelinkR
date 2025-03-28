
import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, MapPin, Globe, Mail, Share2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClubDataProps } from '@/data/clubsData';
import { useAuthStore } from '@/stores/authStore';
import { useClubs, useClubMembership } from '@/hooks/useClubs';
import { toast } from 'sonner';
import HostEventForm from '@/components/events/HostEventForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface ClubDetailViewProps {
  club: ClubDataProps;
  isOpen: boolean;
  onClose: () => void;
  onJoinToggle: () => void;
}

const ClubDetailView = ({ club, isOpen, onClose, onJoinToggle }: ClubDetailViewProps) => {
  const logoPlaceholder = club.name.charAt(0);
  const { profile } = useAuthStore();
  const { isClubAdmin } = useClubs();
  const { data: membershipData } = useClubMembership(club.id);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHostingEvent, setIsHostingEvent] = useState(false);

  useEffect(() => {
    if (profile?.id && club.id) {
      const checkAdmin = async () => {
        const adminStatus = await isClubAdmin(club.id);
        setIsAdmin(adminStatus);
      };
      checkAdmin();
    }
  }, [profile?.id, club.id, isClubAdmin]);

  const handleHostEvent = () => {
    if (!profile) {
      toast.error("Please sign in to host events");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Only club admins can host events");
      return;
    }
    
    setIsHostingEvent(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="h-32 bg-primary/10 relative">
            {/* Club banner area */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 bg-background/50 hover:bg-background/80" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-4 border-background">
                {club.image ? (
                  <img src={club.image} alt={club.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
                )}
              </div>
              <div className="flex gap-2 self-end">
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    onClick={handleHostEvent}
                    className="gap-1"
                  >
                    <Calendar className="h-4 w-4" />
                    Host Event
                  </Button>
                )}
                <Button 
                  variant={club.isJoined ? "secondary" : "default"} 
                  onClick={onJoinToggle}
                >
                  {club.isJoined ? 'Joined' : 'Join Club'}
                </Button>
              </div>
            </div>

            <DialogHeader className="text-left space-y-1 pb-2">
              <DialogTitle className="text-xl flex items-center gap-2">
                {club.name}
                {isAdmin && (
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {club.institution}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs py-0">
                <Users className="h-3 w-3 mr-1" />
                {club.members} members
              </Badge>
              <Badge variant="outline" className="text-xs py-0">
                {club.category}
              </Badge>
            </div>

            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    {club.description || `This is the official club page for ${club.name} at ${club.institution}. Join us to participate in events, connect with peers, and grow your network.`}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Details</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Founded in {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{club.institution}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Open to all students</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="events">
                <div className="min-h-32 flex flex-col items-center justify-center py-6">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-base font-medium">Upcoming Club Events</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                    Stay tuned for upcoming events organized by this club.
                  </p>
                  
                  {isAdmin && (
                    <Button 
                      onClick={handleHostEvent} 
                      size="sm"
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Host New Event
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {isHostingEvent && (
        <HostEventForm
          open={isHostingEvent}
          onClose={() => setIsHostingEvent(false)}
          hostType="club"
          hostId={club.id}
          hostName={club.name}
        />
      )}
    </>
  );
};

export default ClubDetailView;
