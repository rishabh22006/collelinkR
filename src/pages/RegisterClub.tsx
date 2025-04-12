import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Building, Info } from 'lucide-react';
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
import { uploadFile, STORAGE_BUCKETS } from '@/utils/setupStorage';
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Logo image must be less than 5MB",
        });
        return;
      }
      setLogoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Banner image must be less than 10MB",
        });
        return;
      }
      setBannerFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile) {
      toast.error("You must be logged in to register a club");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload logo if available
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadFile(STORAGE_BUCKETS.CLUB_LOGOS, logoFile);
        if (!logoUrl) {
          throw new Error("Failed to upload logo");
        }
      }

      // Upload banner if available
      let bannerUrl = null;
      if (bannerFile) {
        bannerUrl = await uploadFile(STORAGE_BUCKETS.CLUB_BANNERS, bannerFile);
        if (!bannerUrl) {
          throw new Error("Failed to upload banner");
        }
      }
      
      // Create club using the hook
      await createClub.mutateAsync({
        name: values.clubName,
        description: values.description,
        institution: "MIT ADT University", // Default institution
        logo_url: logoUrl,
        banner_url: bannerUrl,
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                      {logoPreview ? (
                        <div className="relative">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-28 h-28 object-cover rounded-lg"
                          />
                          <Button 
                            type="button"
                            variant="secondary" 
                            size="sm" 
                            className="absolute -top-2 -right-2"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">Club Logo</p>
                          <p className="text-xs text-muted-foreground mb-2">PNG, JPG up to 5MB</p>
                          <Button type="button" variant="secondary" size="sm">
                            Select File
                          </Button>
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            onChange={handleLogoChange}
                            accept="image/*"
                          />
                        </>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                      {bannerPreview ? (
                        <div className="relative">
                          <img 
                            src={bannerPreview} 
                            alt="Banner preview" 
                            className="w-full h-28 object-cover rounded-lg"
                          />
                          <Button 
                            type="button"
                            variant="secondary" 
                            size="sm" 
                            className="absolute -top-2 -right-2"
                            onClick={() => {
                              setBannerFile(null);
                              setBannerPreview(null);
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">Club Banner</p>
                          <p className="text-xs text-muted-foreground mb-2">Recommended: 1200x400px</p>
                          <Button type="button" variant="secondary" size="sm">
                            Select File
                          </Button>
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            onChange={handleBannerChange}
                            accept="image/*"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
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
