
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClubAdminsListProps {
  members: any[];
  isAdmin: boolean;
  openAdminManagement: () => void;
}

const ClubAdminsList = ({ members, isAdmin, openAdminManagement }: ClubAdminsListProps) => {
  const admins = members ? members.filter(admin => admin.is_admin) : [];
  
  return (
    <>
      <h3 className="font-medium mb-3">Club Administrators</h3>
      
      <div className="space-y-2">
        {admins.map(admin => (
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
    </>
  );
};

export default ClubAdminsList;
