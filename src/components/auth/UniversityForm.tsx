
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UniversityFormProps {
  onComplete: (data: { university: string; college: string }) => void;
}

interface University {
  code: string;
  name: string;
}

interface College {
  id: string;
  name: string;
  university_code: string;
}

const formSchema = z.object({
  university: z.string().min(1, { message: "Please select your university" }),
  college: z.string().min(1, { message: "Please select your college" }),
});

const UniversityForm = ({ onComplete }: UniversityFormProps) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: "",
      college: "",
    },
  });

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setUniversities(data);
          // Set default university if available
          if (data.length > 0 && !form.getValues('university')) {
            form.setValue('university', data[0].code);
          }
        }
      } catch (error: any) {
        toast.error('Failed to load universities', { 
          description: error.message 
        });
      }
    };

    const fetchColleges = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setColleges(data);
        }
      } catch (error: any) {
        toast.error('Failed to load colleges', { 
          description: error.message 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
    fetchColleges();
  }, [form]);

  // Filter colleges based on selected university
  useEffect(() => {
    const selectedUniversity = form.watch('university');
    if (selectedUniversity && colleges.length > 0) {
      const filtered = colleges.filter(
        college => college.university_code === selectedUniversity
      );
      setFilteredColleges(filtered);
      
      // Reset college selection when university changes
      form.setValue('college', '');
    }
  }, [form.watch('university'), colleges, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Ensure both properties are always present by providing defaults
    onComplete({
      university: values.university || "mit-adt", // Default fallback
      college: values.college || "", // Default fallback
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Tell us about your campus</h2>
        <p className="text-muted-foreground mt-2">
          We'll connect you with the right community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {universities.map(university => (
                      <SelectItem key={university.code} value={university.code}>
                        {university.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading || filteredColleges.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredColleges.map(college => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>Continue</Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default UniversityForm;
