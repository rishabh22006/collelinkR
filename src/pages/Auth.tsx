
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, UserCircle, ArrowRight, ChevronLeft, ChevronRight, School, BookOpen, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/authStore';
import { Separator } from '@/components/ui/separator';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  displayName: z.string().min(2, { message: 'Display name must be at least 2 characters' }),
  university: z.string().min(2, { message: 'Please select a university' }),
  college: z.string().min(2, { message: 'Please enter your college name' }),
});

// Onboarding steps
const STEPS = {
  FEATURES: 0,
  UNIVERSITY: 1,
  AUTH: 2
};

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [currentStep, setCurrentStep] = useState(STEPS.FEATURES);
  const { session, setSession } = useAuthStore();
  const navigate = useNavigate();

  const universities = [
    { value: "mit-adt", label: "MIT ADT University" },
    { value: "other", label: "Other University" }
  ];

  useEffect(() => {
    // Check if user is already logged in
    if (session) {
      navigate('/');
    }

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, setSession]);

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
      displayName: '',
      university: 'mit-adt',
      college: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error('Login failed', {
          description: error.message,
        });
        return;
      }

      toast.success('Welcome back!');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error('Google login failed', {
          description: error.message,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.displayName,
            university: values.university,
            college: values.college,
          },
        },
      });

      if (error) {
        toast.error('Signup failed', {
          description: error.message,
        });
        return;
      }

      toast.success('Account created!', {
        description: 'Please check your email to confirm your account.',
      });
      
      // Switch to login tab
      setActiveTab('login');
      
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const featureCards = [
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: "Discover Events",
      description: "Find and join exciting campus events, workshops, and activities that match your interests."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Join Communities",
      description: "Connect with like-minded peers through various campus communities and interest groups."
    },
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: "Explore Clubs",
      description: "Discover and participate in student clubs that enhance your campus experience and skills."
    }
  ];

  const renderStep = () => {
    switch(currentStep) {
      case STEPS.FEATURES:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome to ColleLink</h1>
              <p className="text-muted-foreground mt-2">Your gateway to campus life</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
              {featureCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-all">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-2">
                        {card.icon}
                      </div>
                      <CardTitle>{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{card.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={nextStep} className="gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
        
      case STEPS.UNIVERSITY:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold">Tell us about your institution</h1>
              <p className="text-muted-foreground mt-2">This helps us connect you with relevant communities</p>
            </div>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <FormLabel>University</FormLabel>
                  <Select 
                    defaultValue={signupForm.getValues().university}
                    onValueChange={(value) => signupForm.setValue('university', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni.value} value={uni.value}>{uni.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>College</FormLabel>
                  <Input 
                    placeholder="Enter your college name"
                    value={signupForm.getValues().college}
                    onChange={(e) => signupForm.setValue('college', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={nextStep} className="gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );
        
      case STEPS.AUTH:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground mt-2">Join your campus community</p>
            </div>

            <div className="bg-card rounded-xl shadow-lg border border-border p-6">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
                <TabsList className="grid grid-cols-2 mb-6">
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
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="you@example.com" className="pl-10" {...field} />
                              </div>
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
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                      
                      <div className="relative my-4">
                        <Separator />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.5453 6.54545H8.00001V9.63636H12.3093C11.9502 11.6 10.2047 12.7273 8.00001 12.7273C5.38183 12.7273 3.27274 10.6182 3.27274 8C3.27274 5.38182 5.38183 3.27273 8.00001 3.27273C9.2411 3.27273 10.3638 3.76364 11.2047 4.53636L13.5273 2.21818C12.0956 0.872727 10.1638 0 8.00001 0C3.58183 0 0 3.58182 0 8C0 12.4182 3.58183 16 8.00001 16C12.0502 16 15.2729 13.0909 15.2729 8C15.2729 7.52727 15.5453 6.54545 15.5453 6.54545Z" fill="#FFC107"/>
                          <path d="M0.89093 4.27273L3.58184 6.30909C4.28912 4.58182 5.9891 3.27273 8.00002 3.27273C9.24112 3.27273 10.3638 3.76364 11.2047 4.53636L13.5273 2.21818C12.0956 0.872727 10.1638 0 8.00002 0C4.89093 0 2.10911 1.72727 0.89093 4.27273Z" fill="#FF3D00"/>
                          <path d="M8.00001 16C10.1182 16 12.0045 15.1636 13.4227 13.8636L10.8727 11.7273C10.0773 12.3091 9.09093 12.7273 8.00001 12.7273C5.8091 12.7273 3.9091 11.6 3.54547 10.0182L0.836374 12.0727C2.03638 14.4909 4.83638 16 8.00001 16Z" fill="#4CAF50"/>
                          <path d="M15.5452 6.54545H8V9.63636H12.3091C12.1408 10.5455 11.6409 11.3273 10.9454 11.9273L10.9682 11.9091L13.5182 14.0455C13.3636 14.1818 15.2727 12.5455 15.2727 8C15.2727 7.52727 15.5452 6.54545 15.5452 6.54545Z" fill="#1976D2"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="you@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="university"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>University</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your university" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {universities.map((uni) => (
                                  <SelectItem key={uni.value} value={uni.value}>{uni.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your college name" {...field} />
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
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                      </Button>
                      
                      <div className="relative my-4">
                        <Separator />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.5453 6.54545H8.00001V9.63636H12.3093C11.9502 11.6 10.2047 12.7273 8.00001 12.7273C5.38183 12.7273 3.27274 10.6182 3.27274 8C3.27274 5.38182 5.38183 3.27273 8.00001 3.27273C9.2411 3.27273 10.3638 3.76364 11.2047 4.53636L13.5273 2.21818C12.0956 0.872727 10.1638 0 8.00001 0C3.58183 0 0 3.58182 0 8C0 12.4182 3.58183 16 8.00001 16C12.0502 16 15.2729 13.0909 15.2729 8C15.2729 7.52727 15.5453 6.54545 15.5453 6.54545Z" fill="#FFC107"/>
                          <path d="M0.89093 4.27273L3.58184 6.30909C4.28912 4.58182 5.9891 3.27273 8.00002 3.27273C9.24112 3.27273 10.3638 3.76364 11.2047 4.53636L13.5273 2.21818C12.0956 0.872727 10.1638 0 8.00002 0C4.89093 0 2.10911 1.72727 0.89093 4.27273Z" fill="#FF3D00"/>
                          <path d="M8.00001 16C10.1182 16 12.0045 15.1636 13.4227 13.8636L10.8727 11.7273C10.0773 12.3091 9.09093 12.7273 8.00001 12.7273C5.8091 12.7273 3.9091 11.6 3.54547 10.0182L0.836374 12.0727C2.03638 14.4909 4.83638 16 8.00001 16Z" fill="#4CAF50"/>
                          <path d="M15.5452 6.54545H8V9.63636H12.3091C12.1408 10.5455 11.6409 11.3273 10.9454 11.9273L10.9682 11.9091L13.5182 14.0455C13.3636 14.1818 15.2727 12.5455 15.2727 8C15.2727 7.52727 15.5452 6.54545 15.5452 6.54545Z" fill="#1976D2"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={prevStep} size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back to institution details
              </Button>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/95">
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
