
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image, Users, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useClubs } from '@/hooks/useClubs';
import { useCommunities } from '@/hooks/useCommunities';

const CreatePost = () => {
  const navigate = useNavigate();
  const { session, profile } = useAuthStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [postType, setPostType] = useState<'personal' | 'club' | 'community'>('personal');
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  
  const { clubs } = useClubs();
  const { getAllCommunities } = useCommunities();
  
  // Fetch clubs where user is a member
  const { data: userClubs = [] } = useQuery({
    queryKey: ['user-clubs'],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('club_members')
        .select('club_id, clubs(*)')
        .eq('user_id', profile.id);
      
      if (error) {
        console.error('Error fetching user clubs:', error);
        return [];
      }
      
      return data.map(item => item.clubs);
    },
    enabled: !!profile?.id
  });
  
  // Fetch communities where user is a member
  const { data: userCommunities = [] } = useQuery({
    queryKey: ['user-communities'],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('community_members')
        .select('community_id, communities(*)')
        .eq('member_id', profile.id);
      
      if (error) {
        console.error('Error fetching user communities:', error);
        return [];
      }
      
      return data.map(item => item.communities);
    },
    enabled: !!profile?.id
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePostTypeChange = (value: string) => {
    setPostType(value as 'personal' | 'club' | 'community');
    setSelectedClubId(null);
    setSelectedCommunityId(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }
    
    if (postType === 'club' && !selectedClubId) {
      toast.error('Please select a club for your post');
      return;
    }
    
    if (postType === 'community' && !selectedCommunityId) {
      toast.error('Please select a community for your post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let mediaUrls: string[] = [];
      
      // If a file was selected, upload it
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `posts/${session.user.id}/${fileName}`;
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, selectedFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
          
        mediaUrls = [urlData.publicUrl];
      }
      
      // Create the post with appropriate community_id based on post type
      const postData = {
        author_id: session.user.id,
        content,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        community_id: postType === 'community' ? selectedCommunityId : 
                    postType === 'club' ? selectedClubId : 
                    null
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select();
        
      if (error) {
        throw error;
      }
      
      toast.success('Post created successfully!');
      navigate('/');
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
      <TopNavbar />
      
      <main className="container py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold">Create Post</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <Textarea
                placeholder="What's on your mind?"
                className="resize-none min-h-[150px] border-0 p-0 focus-visible:ring-0 text-lg"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {previewUrl && (
                <div className="mt-4 relative">
                  <img 
                    src={previewUrl} 
                    alt="Selected media" 
                    className="w-full max-h-[300px] object-contain rounded-lg" 
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8"
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div>
                <Label htmlFor="media" className="sr-only">Add media</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('media')?.click()}
                  className="flex items-center"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Add Media
                </Button>
                <Input
                  id="media"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="w-[200px]">
                <Label htmlFor="postType" className="sr-only">Post type</Label>
                <Select value={postType} onValueChange={handlePostTypeChange}>
                  <SelectTrigger id="postType">
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Post</SelectItem>
                    <SelectItem value="club">Club Post</SelectItem>
                    <SelectItem value="community">Community Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {postType === 'club' && (
                <div className="w-[200px]">
                  <Label htmlFor="club" className="sr-only">Select club</Label>
                  <Select value={selectedClubId || undefined} onValueChange={setSelectedClubId}>
                    <SelectTrigger id="club">
                      <SelectValue placeholder="Select club" />
                    </SelectTrigger>
                    <SelectContent>
                      {userClubs.length === 0 ? (
                        <SelectItem value="none" disabled>
                          You're not a member of any clubs
                        </SelectItem>
                      ) : (
                        userClubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {postType === 'community' && (
                <div className="w-[200px]">
                  <Label htmlFor="community" className="sr-only">Select community</Label>
                  <Select value={selectedCommunityId || undefined} onValueChange={setSelectedCommunityId}>
                    <SelectTrigger id="community">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {userCommunities.length === 0 ? (
                        <SelectItem value="none" disabled>
                          You're not a member of any communities
                        </SelectItem>
                      ) : (
                        userCommunities.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                variant="default"
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default CreatePost;
