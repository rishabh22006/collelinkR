
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCertificates } from '@/hooks/useCertificates';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { certificate_type, competition_level } from '@/types/certificates';

const formSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  issuer: z.string().min(2, 'Issuer is required'),
  certificate_type: z.enum(['course', 'competition', 'other']),
  competition_level: z.enum(['college', 'state', 'national', 'international']).optional().nullable(),
  issue_date: z.date().default(() => new Date()),
  expiry_date: z.date().optional().nullable(),
  media_url: z.string().url().optional().nullable(),
  verification_hash: z.string().optional().nullable(),
});

type CertificateFormValues = z.infer<typeof formSchema>;

const CertificateForm: React.FC = () => {
  const { addCertificate } = useCertificates();

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      issuer: '',
      certificate_type: 'course',
      competition_level: null,
      issue_date: new Date(),
      expiry_date: null,
      media_url: '',
      verification_hash: '',
    },
  });

  const certificateType = form.watch('certificate_type');

  const onSubmit = async (values: CertificateFormValues) => {
    addCertificate.mutate({
      title: values.title,
      issuer: values.issuer,
      certificate_type: values.certificate_type as certificate_type,
      competition_level: values.competition_level as competition_level,
      issue_date: values.issue_date.toISOString(),
      expiry_date: values.expiry_date ? values.expiry_date.toISOString() : null,
      media_url: values.media_url || null,
      verification_hash: values.verification_hash || null,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certificate title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issuing organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificate_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {certificateType === 'competition' && (
            <FormField
              control={form.control}
              name="competition_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select competition level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Higher competition levels earn more points
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="issue_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>No expiration</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="media_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/certificate.pdf" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Link to your certificate file or verification page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_hash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Hash (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter verification code or hash" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Enter any verification code provided with your certificate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={addCertificate.isPending}
            className="w-full md:w-auto"
          >
            {addCertificate.isPending ? 'Submitting...' : 'Add Certificate'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CertificateForm;
