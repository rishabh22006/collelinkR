
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getMemberCount } from '@/utils/dataUtils';

interface ClubMembersListProps {
  members: any[];
  club: any;
}

const ClubMembersList = ({ members, club }: ClubMembersListProps) => {
  return (
    <>
      <h3 className="font-medium mb-3">Club Members</h3>
      
      <p className="text-muted-foreground">
        This club has {getMemberCount(club)} members in total.
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
    </>
  );
};

export default ClubMembersList;
