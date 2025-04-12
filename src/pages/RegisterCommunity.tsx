
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useCommunities } from '@/hooks/useCommunities';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Community name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  isPrivate: z.boolean().default(false),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const RegisterCommunity = () => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const { createCommunity } = useCommunities();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      contactEmail: profile?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile) {
      toast.error("You must be logged in to create a community");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create community using the hook without logo and banner
      await createCommunity.mutateAsync({
        name: values.name,
        description: values.description,
        is_private: values.isPrivate
      });
      
      toast.success("Community created successfully!");
      navigate('/communities');
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error("Failed to create community", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <TopNavbar />
      
      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
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
            <h1 className="text-2xl font-bold">Create a Community</h1>
          </div>
          
          <div className="bg-card rounded-xl border p-6 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Community Registration</h2>
                <p className="text-sm text-muted-foreground">
                  Create a community to connect with like-minded people
                </p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter community name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your community, its purpose, and activities"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about your community to attract members
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Private Community</FormLabel>
                          <FormDescription>
                            Make this community private and members can only join by invitation
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-secondary/20 rounded-lg p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Community Creation</p>
                    <p className="text-muted-foreground">
                      Your community will be created immediately and you'll be automatically
                      assigned as the admin. You can invite members after creation.
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Community..." : "Create Community"}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default RegisterCommunity;
