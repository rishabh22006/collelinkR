
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Club, AdminManagementResult } from './useClubTypes';

/**
 * Hook for club administration functionality
 */
export const useClubAdmin = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  // Check if user is a club admin
  const isClubAdmin = async (clubId: string) => {
    if (!profile?.id) return false;

    try {
      // Using direct query instead of RPC
      const { data, error } = await supabase
        .from('club_admins')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', profile.id)
        .single();

      if (error) {
        console.error('Error checking club admin status:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Failed to check club admin status:', err);
      return false;
    }
  };

  // Check if user is the club creator
  const isClubCreator = async (clubId: string) => {
    if (!profile?.id) return false;

    try {
      // Using direct query instead of RPC
      const { data, error } = await supabase
        .from('clubs')
        .select('creator_id')
        .eq('id', clubId)
        .single();

      if (error) {
        console.error('Error checking club creator status:', error);
        return false;
      }

      return data.creator_id === profile.id;
    } catch (err) {
      console.error('Failed to check club creator status:', err);
      return false;
    }
  };

  // Create a new club
  const createClub = useMutation({
    mutationFn: async (clubData: {
      name: string;
      description?: string;
      institution?: string;
      logo_url?: string;
      banner_url?: string;
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to create a club');
      }

      try {
        // Create the club first
        const { data: newClub, error: clubError } = await supabase
          .from('clubs')
          .insert({
            name: clubData.name,
            description: clubData.description || null,
            institution: clubData.institution || null,
            logo_url: clubData.logo_url || null,
            banner_url: clubData.banner_url || null,
            creator_id: profile.id
          })
          .select()
          .single();

        if (clubError) {
          throw clubError;
        }

        // Make creator an admin
        const { error: adminError } = await supabase
          .from('club_admins')
          .insert({
            club_id: newClub.id,
            user_id: profile.id
          });

        if (adminError) {
          throw adminError;
        }

        // Also make creator a member
        const { error: memberError } = await supabase
          .from('club_members')
          .insert({
            club_id: newClub.id,
            user_id: profile.id
          });

        if (memberError) {
          throw memberError;
        }

        return newClub as Club;
      } catch (err) {
        console.error('Failed to create club:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Club created successfully');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create club', {
        description: error.message,
      });
    },
  });

  // Add an admin to a club
  const addClubAdmin = useMutation({
    mutationFn: async ({ clubId, userId }: { clubId: string, userId: string }): Promise<AdminManagementResult> => {
      try {
        // Check if the user is already an admin
        const { data: existingAdmin } = await supabase
          .from('club_admins')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', userId)
          .single();

        if (existingAdmin) {
          return {
            success: false,
            error: 'already_admin',
            message: 'User is already an admin'
          };
        }

        // Add as admin
        const { error } = await supabase
          .from('club_admins')
          .insert({
            club_id: clubId,
            user_id: userId
          });

        if (error) {
          throw new Error(error.message);
        }

        // Also ensure user is a member
        const { data: existingMember } = await supabase
          .from('club_members')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', userId)
          .single();

        if (!existingMember) {
          await supabase
            .from('club_members')
            .insert({
              club_id: clubId,
              user_id: userId
            });
        }

        return {
          success: true,
          message: 'Admin added successfully'
        };
      } catch (err) {
        console.error('Failed to add admin:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to add admin', {
        description: error.message,
      });
    },
  });

  // Remove an admin from a club
  const removeClubAdmin = useMutation({
    mutationFn: async ({ clubId, userId }: { clubId: string, userId: string }): Promise<AdminManagementResult> => {
      try {
        // Check if this is the creator trying to remove themselves
        const { data: club } = await supabase
          .from('clubs')
          .select('creator_id')
          .eq('id', clubId)
          .single();

        if (club && club.creator_id === userId) {
          return {
            success: false,
            error: 'creator_removal',
            message: 'Cannot remove the club creator. Transfer ownership first.'
          };
        }

        // Count current admins
        const { count } = await supabase
          .from('club_admins')
          .select('*', { count: 'exact', head: true })
          .eq('club_id', clubId);

        // Don't allow removing the last admin
        if (count && count <= 1) {
          return {
            success: false,
            error: 'last_admin',
            message: 'Cannot remove the last admin'
          };
        }

        // Remove admin
        const { error } = await supabase
          .from('club_admins')
          .delete()
          .eq('club_id', clubId)
          .eq('user_id', userId);

        if (error) {
          throw new Error(error.message);
        }

        return {
          success: true,
          message: 'Admin removed successfully'
        };
      } catch (err) {
        console.error('Failed to remove admin:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to remove admin', {
        description: error.message,
      });
    },
  });

  // Transfer club ownership
  const transferClubOwnership = useMutation({
    mutationFn: async ({ 
      clubId, 
      newOwnerId 
    }: { 
      clubId: string, 
      newOwnerId: string 
    }) => {
      if (!profile?.id) {
        throw new Error('You must be logged in to transfer ownership');
      }

      try {
        // Check if the current user is the creator
        const { data: club } = await supabase
          .from('clubs')
          .select('creator_id')
          .eq('id', clubId)
          .single();

        if (!club || club.creator_id !== profile.id) {
          throw new Error('Only the creator can transfer ownership');
        }

        // Check if new owner is already an admin
        const { data: isAdmin } = await supabase
          .from('club_admins')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', newOwnerId)
          .single();

        if (!isAdmin) {
          throw new Error('New owner must be an admin first');
        }

        // Transfer ownership
        const { error } = await supabase
          .from('clubs')
          .update({ creator_id: newOwnerId })
          .eq('id', clubId);

        if (error) {
          throw new Error(error.message);
        }

        return true;
      } catch (err) {
        console.error('Failed to transfer ownership:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Club ownership transferred successfully');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-members'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to transfer club ownership', {
        description: error.message,
      });
    },
  });

  // Get club members with admin status
  const getClubMembers = async (clubId: string) => {
    try {
      const { data: members, error: membersError } = await supabase
        .from('club_members')
        .select('user_id, joined_at')
        .eq('club_id', clubId);

      if (membersError) {
        console.error('Error fetching club members:', membersError);
        return [];
      }

      // Get admin status for each member
      const { data: admins, error: adminsError } = await supabase
        .from('club_admins')
        .select('user_id')
        .eq('club_id', clubId);

      if (adminsError) {
        console.error('Error fetching club admins:', adminsError);
        return [];
      }

      // Get profiles for all members
      const memberIds = members.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .in('id', memberIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      // Combine data into the expected format
      const memberWithProfiles = members.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id);
        const isAdmin = admins?.some(a => a.user_id === member.user_id) || false;
        
        return {
          user_id: member.user_id,
          joined_at: member.joined_at,
          is_admin: isAdmin,
          display_name: profile?.display_name || 'Unknown User',
          avatar_url: profile?.avatar_url
        };
      });

      return memberWithProfiles;
    } catch (err) {
      console.error('Failed to fetch club members:', err);
      return [];
    }
  };

  return {
    isClubAdmin,
    isClubCreator,
    createClub,
    addClubAdmin,
    removeClubAdmin,
    transferClubOwnership,
    getClubMembers,
  };
};
