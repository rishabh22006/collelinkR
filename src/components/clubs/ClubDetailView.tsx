
import React from 'react';
import { X, Users, Calendar, MapPin, Globe, Mail, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClubDataProps } from '@/data/clubsData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ClubDetailViewProps {
  club: ClubDataProps;
  isOpen: boolean;
  onClose: () => void;
  onJoinToggle: () => void;
}

const ClubDetailView = ({ club, isOpen, onClose, onJoinToggle }: ClubDetailViewProps) => {
  const logoPlaceholder = club.name.charAt(0);

  return (
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
            <Button 
              variant={club.isJoined ? "secondary" : "default"} 
              onClick={onJoinToggle}
              className="self-end"
            >
              {club.isJoined ? 'Joined' : 'Join Club'}
            </Button>
          </div>

          <DialogHeader className="text-left space-y-1 pb-2">
            <DialogTitle className="text-xl">{club.name}</DialogTitle>
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

          <div className="space-y-4">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDetailView;
