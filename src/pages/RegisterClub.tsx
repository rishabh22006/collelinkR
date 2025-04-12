
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Info } from 'lucide-react';
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
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useClubs } from '@/hooks/useClubs';

const formSchema = z.object({
  clubName: z.string().min(3, {
    message: "Club name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Please select a category.",
  }),
  memberLimit: z.string().min(1, {
    message: "Please specify a member limit.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const RegisterClub = () => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const { createClub } = useClubs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clubName: "",
      description: "",
      category: "",
      memberLimit: "",
      contactEmail: profile?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile) {
      toast.error("You must be logged in to register a club");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create club using the hook without logo and banner
      await createClub.mutateAsync({
        name: values.clubName,
        description: values.description,
        institution: "MIT ADT University", // Default institution
      });
      
      toast.success("Club registered successfully!");
      navigate('/clubs');
    } catch (error) {
      console.error('Error registering club:', error);
      toast.error("Failed to register club", {
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
            <h1 className="text-2xl font-bold">Register a Club</h1>
          </div>
          
          <div className="bg-card rounded-xl border p-6 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Club Registration</h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below to register your club at MIT ADT University
                </p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clubName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter club name" {...field} />
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
                            placeholder="Describe your club, its purpose, and activities"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about your club to attract members
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Academic, Sports, Cultural" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="memberLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Member Limit</FormLabel>
                          <FormControl>
                            <Input type="number" min="5" placeholder="e.g., 50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="club-email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-secondary/20 rounded-lg p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Registration Confirmation</p>
                    <p className="text-muted-foreground">
                      Your club will be immediately registered and visible in the clubs directory.
                      You'll be able to manage it from your dashboard.
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering Club..." : "Register Club"}
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

export default RegisterClub;
