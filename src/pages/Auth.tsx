
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AnimatePresence } from 'framer-motion';
import FeaturesIntro from '@/components/auth/FeaturesIntro';
import UniversityForm from '@/components/auth/UniversityForm';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define form schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  displayName: z.string().min(2, { message: 'Display name must be at least 2 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

enum OnboardingStep {
  FEATURES_INTRO,
  UNIVERSITY_FORM,
  AUTH_FORM
}

const Auth = () => {
  const navigate = useNavigate();
  const { session, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.FEATURES_INTRO);
  const [universityData, setUniversityData] = useState({ university: '', college: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      // Refresh auth state
      await checkAuth();
      navigate('/');
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // Get college name from its ID
      let collegeName = '';
      
      if (universityData.college) {
        const { data: collegeData } = await supabase
          .from('colleges')
          .select('name')
          .eq('id', universityData.college)
          .single();
          
        if (collegeData) {
          collegeName = collegeData.name;
        }
      }
      
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.displayName,
            university: universityData.university,
            college: collegeName || universityData.college,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Account created successfully', {
        description: 'Please check your email for verification',
      });
      
      // Directly sign in after signup (if no email verification is required)
      await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      // Refresh auth state
      await checkAuth();
      navigate('/');
    } catch (error: any) {
      toast.error('Signup failed', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUniversityFormComplete = (data: { university: string; college: string }) => {
    setUniversityData(data);
    setStep(OnboardingStep.AUTH_FORM);
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case OnboardingStep.FEATURES_INTRO:
        return <FeaturesIntro onContinue={() => setStep(OnboardingStep.UNIVERSITY_FORM)} />;
      case OnboardingStep.UNIVERSITY_FORM:
        return <UniversityForm onComplete={handleUniversityFormComplete} />;
      case OnboardingStep.AUTH_FORM:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to ColleLink</CardTitle>
              <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-sm text-muted-foreground mb-2">
                        <p>University: {universityData.university}</p>
                        <p>College: {universityData.college}</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
