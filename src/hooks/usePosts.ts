
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

export interface Post {
  id: string;
  author_id: string;
  content: string;
  media_urls: string[] | null;
  community_id: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string | null;
}

/**
 * Custom hook for post-related operations
 * Optimized to work with consolidated RLS policies
 */
export const usePosts = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();
  
  // Fetch posts with optimized query
  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // This query leverages our optimized RLS policy that uses get_auth_user()
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      return data as unknown as Post[];
    },
    enabled: !!profile, // Only run when user is authenticated
  });

  // Create a new post
  const createPost = useMutation({
    mutationFn: async (newPost: { content: string; media_urls?: string[]; community_id?: string }) => {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: profile?.id as string,
          content: newPost.content,
          media_urls: newPost.media_urls || null,
          community_id: newPost.community_id || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      return data as unknown as Post;
    },
    onSuccess: () => {
      toast.success('Post created successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to create post', { 
        description: error.message 
      });
    },
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost,
  };
};
