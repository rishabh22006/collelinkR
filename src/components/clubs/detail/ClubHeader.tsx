
import React from 'react';
import { ArrowLeft, Award, Shield, UserMinus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMemberCount } from '@/utils/dataUtils';

interface ClubHeaderProps {
  club: any;
  onClose: () => void;
  isMember: boolean;
  isAdmin: boolean;
  handleLeaveClub: (e?: React.MouseEvent) => void;
  handleJoinClub: (e?: React.MouseEvent) => void;
  openEventForm: () => void;
  openAdminManagement: () => void;
}

const ClubHeader = ({
  club,
  onClose,
  isMember,
  isAdmin,
  handleLeaveClub,
  handleJoinClub,
  openEventForm,
  openAdminManagement
}: ClubHeaderProps) => {
  return (
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
          <span>{getMemberCount(club)} members</span>
          
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
  );
};

export default ClubHeader;
