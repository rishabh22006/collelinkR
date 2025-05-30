
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useClubs } from '@/hooks/useClubs';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const RegisterClubCard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasUniversityInfo } = useAuthStore();
  const { createClub } = useClubs();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to register a club');
      navigate('/auth');
      return;
    }
    
    if (!name.trim()) {
      toast.error('Please provide a club name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the updated createClub method without logo and banner
      const result = await createClub.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        institution: institution.trim() || undefined
      });
      
      toast.success('Club registered successfully!');
      navigate('/clubs');
    } catch (error) {
      console.error('Error creating club:', error);
      toast.error('Failed to register club', { 
        description: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show example data for visual understanding
  const mockExampleClub = {
    name: 'MIT Tech Club',
    description: 'A community for tech enthusiasts to collaborate, learn and build projects.',
    institution: 'Massachusetts Institute of Technology',
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Register a Club</CardTitle>
        <CardDescription>
          Create a new club for your university or organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="club-name">Club Name*</Label>
            <Input
              id="club-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mockExampleClub.name}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={mockExampleClub.description}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder={mockExampleClub.institution}
            />
          </div>
          
          {/* Example visual preview card */}
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-medium mb-1">Preview:</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {name ? name.charAt(0) : 'C'}
              </div>
              <div>
                <p className="font-medium">{name || mockExampleClub.name}</p>
                <p className="text-xs text-muted-foreground">{institution || mockExampleClub.institution}</p>
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
                Registering...
              </>
            ) : (
              <>
                Register Club
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
        <p>
          By registering a club, you'll automatically become its administrator.
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterClubCard;
