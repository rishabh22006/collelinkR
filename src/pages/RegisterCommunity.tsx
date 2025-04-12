
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Users, Info } from 'lucide-react';
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
import { uploadFile, STORAGE_BUCKETS } from '@/utils/setupStorage';
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
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
      toast.error("You must be logged in to create a community");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload logo if available
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadFile(STORAGE_BUCKETS.COMMUNITY_LOGOS, logoFile);
        if (!logoUrl) {
          throw new Error("Failed to upload logo");
        }
      }

      // Upload banner if available
      let bannerUrl = null;
      if (bannerFile) {
        bannerUrl = await uploadFile(STORAGE_BUCKETS.COMMUNITY_BANNERS, bannerFile);
        if (!bannerUrl) {
          throw new Error("Failed to upload banner");
        }
      }
      
      // Create community using the hook
      await createCommunity.mutateAsync({
        name: values.name,
        description: values.description,
        logo_url: logoUrl,
        banner_url: bannerUrl,
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
                          <p className="text-sm font-medium mb-1">Community Logo</p>
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
                          <p className="text-sm font-medium mb-1">Community Banner</p>
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
