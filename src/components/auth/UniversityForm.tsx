
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface UniversityFormProps {
  onComplete: (data: { university: string; college: string }) => void;
}

const formSchema = z.object({
  university: z.string().default("mit-adt"),
  college: z.string().min(1, { message: "Please enter your college name" }),
});

const UniversityForm = ({ onComplete }: UniversityFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: "mit-adt",
      college: "",
    },
  });

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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mit-adt">MIT ADT University</SelectItem>
                    {/* Add more universities as needed */}
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
                <FormControl>
                  <Input placeholder="Enter your college name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default UniversityForm;
