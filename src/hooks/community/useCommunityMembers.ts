
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for community members operations
 */
export const useCommunityMembers = () => {
  // Get community members
  const getCommunityMembers = async (communityId: string) => {
    try {
      const { data: members, error: membersError } = await supabase
        .from('community_members')
        .select('member_id, role, joined_at')
        .eq('community_id', communityId);

      if (membersError) {
        console.error('Error fetching community members:', membersError);
        return [];
      }

      // Get profiles for all members
      const memberIds = members.map(m => m.member_id);
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
        const profile = profiles?.find(p => p.id === member.member_id);
        
        return {
          member_id: member.member_id,
          joined_at: member.joined_at,
          role: member.role,
          display_name: profile?.display_name || 'Unknown User',
          avatar_url: profile?.avatar_url
        };
      });

      return memberWithProfiles;
    } catch (err) {
      console.error('Failed to fetch community members:', err);
      return [];
    }
  };

  return {
    getCommunityMembers,
  };
};
