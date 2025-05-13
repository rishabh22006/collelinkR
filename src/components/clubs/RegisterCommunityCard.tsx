
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2, Lock, Unlock } from 'lucide-react';
import { useCommunities } from '@/hooks/useCommunities';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const RegisterCommunityCard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { createCommunity } = useCommunities();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to register a community');
      navigate('/auth');
      return;
    }
    
    if (!name.trim()) {
      toast.error('Please provide a community name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the updated createCommunity method without logo and banner
      const result = await createCommunity.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        is_private: isPrivate
      });
      
      toast.success('Community registered successfully!');
      navigate('/communities');
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to register community', { 
        description: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show example data for visual understanding
  const mockExampleCommunity = {
    name: 'UI/UX Design Community',
    description: 'A group for UI/UX designers to share knowledge, get feedback, and collaborate on projects.'
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create a Community</CardTitle>
        <CardDescription>
          Start a community based on shared interests or goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="community-name">Community Name*</Label>
            <Input
              id="community-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mockExampleCommunity.name}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={mockExampleCommunity.description}
              rows={4}
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  {isPrivate ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                  Private Community
                </Label>
                <p className="text-sm text-muted-foreground">
                  Private communities are only visible to members
                </p>
              </div>
              <Switch 
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
          </div>
          
          {/* Example visual preview card */}
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-medium mb-1">Preview:</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {name ? name.charAt(0) : 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{name || mockExampleCommunity.name}</p>
                  {isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {description || mockExampleCommunity.description}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
        <p>
          By creating a community, you'll automatically become its administrator.
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterCommunityCard;
