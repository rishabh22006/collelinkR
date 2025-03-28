
import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, MessageSquare, UserPlus, Share2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommunityDataProps } from '@/data/clubsData';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import HostEventForm from '@/components/events/HostEventForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface CommunityDetailViewProps {
  community: CommunityDataProps;
  isOpen: boolean;
  onClose: () => void;
  onJoinToggle: () => void;
}

const CommunityDetailView = ({ community, isOpen, onClose, onJoinToggle }: CommunityDetailViewProps) => {
  const logoPlaceholder = community.name.charAt(0);
  const { profile } = useAuthStore();
  const [isHostingEvent, setIsHostingEvent] = useState(false);

  const handleHostEvent = () => {
    if (!profile) {
      toast.error("Please sign in to host events");
      return;
    }
    
    if (!community.isJoined) {
      toast.error("You must be a member to host events");
      return;
    }
    
    setIsHostingEvent(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="h-32 bg-primary/10 relative">
            {/* Community banner area */}
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
                {community.image ? (
                  <img src={community.image} alt={community.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">{logoPlaceholder}</span>
                )}
              </div>
              <div className="flex gap-2 self-end">
                {community.isJoined && (
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
                  variant={community.isJoined ? "secondary" : "default"} 
                  onClick={onJoinToggle}
                >
                  {community.isJoined ? 'Joined' : 'Join Community'}
                </Button>
              </div>
            </div>

            <DialogHeader className="text-left space-y-1 pb-2">
              <DialogTitle className="text-xl">{community.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {community.institution}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs py-0">
                <Users className="h-3 w-3 mr-1" />
                {community.members} members
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
                    {community.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Activity</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created in {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Active discussions</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" size="sm" className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    Invite
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
                  <h3 className="text-base font-medium">Upcoming Community Events</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                    Stay tuned for upcoming events organized by this community.
                  </p>
                  
                  {community.isJoined && (
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
          hostType="community"
          hostId={community.id}
          hostName={community.name}
        />
      )}
    </>
  );
};

export default CommunityDetailView;
