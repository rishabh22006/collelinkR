
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Certificate, certificate_type, competition_level } from '@/types/certificates';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface AddCertificateParams {
  title: string;
  issuer: string;
  certificate_type: certificate_type;
  competition_level?: competition_level;
  issue_date?: string;
  expiry_date?: string | null;
  media_url?: string | null;
  verification_hash?: string | null;
}

export const useCertificates = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  // Fetch user's certificates
  const {
    data: certificates = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      if (!profile?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    },
    enabled: !!profile?.id,
  });

  // Add a new certificate
  const addCertificate = useMutation({
    mutationFn: async (params: AddCertificateParams) => {
      if (!profile?.id) throw new Error('User not authenticated');

      // Get point rule for this certificate type/level
      const { data: pointRules, error: rulesError } = await supabase
        .from('point_rules')
        .select('*')
        .eq('certificate_type', params.certificate_type)
        .is('competition_level', params.competition_level || null)
        .maybeSingle();

      if (rulesError) throw rulesError;

      const points_awarded = pointRules?.points || 0;

      const { data, error } = await supabase
        .from('certificates')
        .insert({
          student_id: profile.id,
          title: params.title,
          issuer: params.issuer,
          certificate_type: params.certificate_type,
          competition_level: params.competition_level || null,
          issue_date: params.issue_date || new Date().toISOString(),
          expiry_date: params.expiry_date || null,
          points_awarded,
          media_url: params.media_url || null,
          verification_hash: params.verification_hash || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Certificate;
    },
    onSuccess: () => {
      toast.success('Certificate added successfully');
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to add certificate', {
        description: error.message,
      });
    },
  });

  return {
    certificates,
    isLoading,
    error,
    refetch,
    addCertificate,
  };
};
