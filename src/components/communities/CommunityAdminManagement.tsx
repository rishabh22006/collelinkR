
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, UserMinus, Crown, ArrowRightLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCommunities } from '@/hooks/useCommunities';
import { useAuthStore } from '@/stores/authStore';

interface CommunityMember {
  member_id: string;
  role: string;
  joined_at: string;
  display_name: string;
  avatar_url: string | null;
}

interface CommunityAdminManagementProps {
  open: boolean;
  onClose: () => void;
  communityId: string;
  isCreator: boolean;
  members: CommunityMember[];
  onAdminAdd?: (success: boolean) => void;
  onAdminRemove?: (success: boolean) => void;
  onOwnershipTransfer?: (success: boolean) => void;
}

const CommunityAdminManagement = ({
  open,
  onClose,
  communityId,
  isCreator,
  members,
  onAdminAdd,
  onAdminRemove,
  onOwnershipTransfer
}: CommunityAdminManagementProps) => {
  const { profile } = useAuthStore();
  const { 
    addCommunityAdmin, 
    removeCommunityAdmin, 
    transferCommunityOwnership 
  } = useCommunities();
  
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [admins, setAdmins] = useState<CommunityMember[]>([]);
  const [regularMembers, setRegularMembers] = useState<CommunityMember[]>([]);
  const [actionType, setActionType] = useState<'add' | 'remove' | 'transfer' | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    // Sort members into admins and regular members
    if (members) {
      const adminList = members.filter(member => member.role === 'admin');
      const regularList = members.filter(member => member.role === 'member');
      
      setAdmins(adminList);
      setRegularMembers(regularList);
    }
  }, [members]);
  
  const handleAction = (member: CommunityMember, action: 'add' | 'remove' | 'transfer') => {
    setSelectedMember(member);
    setActionType(action);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmAction = async () => {
    if (!selectedMember) return;
    
    try {
      if (actionType === 'add') {
        await addCommunityAdmin.mutateAsync({ 
          communityId, 
          userId: selectedMember.member_id 
        });
        onAdminAdd?.(true);
      } 
      else if (actionType === 'remove') {
        await removeCommunityAdmin.mutateAsync({ 
          communityId, 
          userId: selectedMember.member_id 
        });
        onAdminRemove?.(true);
      } 
      else if (actionType === 'transfer') {
        await transferCommunityOwnership.mutateAsync({ 
          communityId, 
          newOwnerId: selectedMember.member_id 
        });
        onOwnershipTransfer?.(true);
      }
    } catch (error) {
      console.error('Action failed:', error);
      if (actionType === 'add') onAdminAdd?.(false);
      else if (actionType === 'remove') onAdminRemove?.(false);
      else if (actionType === 'transfer') onOwnershipTransfer?.(false);
    }
    
    setConfirmDialogOpen(false);
    setSelectedMember(null);
  };
  
  const getConfirmMessage = () => {
    if (!selectedMember) return '';
    
    switch (actionType) {
      case 'add':
        return `Make ${selectedMember.display_name} an admin? This will give them the ability to manage community settings, events, and members.`;
      case 'remove':
        return `Remove ${selectedMember.display_name} as an admin? They will still remain a member of the community.`;
      case 'transfer':
        return `Transfer community ownership to ${selectedMember.display_name}? You will remain as an admin, but they will become the primary owner with full control.`;
      default:
        return '';
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Community Admins</DialogTitle>
            <DialogDescription>
              Communities can have up to 4 admins who can manage settings, events, and members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Crown size={16} className="text-amber-500" />
              Community Admins
            </h3>
            
            <div className="space-y-2">
              {admins.length === 0 ? (
                <p className="text-sm text-muted-foreground">No admins found</p>
              ) : (
                admins.map(admin => (
                  <Card key={admin.member_id} className="shadow-sm">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={admin.avatar_url || undefined} />
                          <AvatarFallback>{admin.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{admin.display_name}</p>
                          {isCreator && admin.member_id === profile?.id && (
                            <span className="text-xs text-amber-500 flex items-center gap-1">
                              <Crown size={10} /> Owner
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {isCreator && admin.member_id !== profile?.id && (
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => handleAction(admin, 'remove')}
                            title="Remove admin role"
                          >
                            <UserMinus size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => handleAction(admin, 'transfer')}
                            title="Transfer ownership"
                          >
                            <ArrowRightLeft size={14} />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {isCreator && admins.length < 4 && regularMembers.length > 0 && (
              <>
                <h3 className="text-sm font-medium mt-6">Add New Admin</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Select a member to promote to admin:
                </p>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {regularMembers.map(member => (
                    <Card key={member.member_id} className="shadow-sm">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar_url || undefined} />
                            <AvatarFallback>{member.display_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium">{member.display_name}</p>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1 h-7 text-xs"
                          onClick={() => handleAction(member, 'add')}
                        >
                          <Shield size={12} />
                          Make Admin
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'add' ? 'Add Admin' : 
               actionType === 'remove' ? 'Remove Admin' : 
               'Transfer Ownership'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getConfirmMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CommunityAdminManagement;
