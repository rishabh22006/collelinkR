
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Link as LinkIcon, Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEventHost } from '@/hooks/useEventHost';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface HostEventFormProps {
  open: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
  hostType: 'club' | 'community';
  hostId: string | null;
  hostName: string;
}

interface FormValues {
  title: string;
  description: string;
  date: Date;
  time: string;
  endDate?: Date;
  endTime?: string;
  location?: string;
  category: string;
  isOnline: boolean;
  onlineLink?: string;
  imageUrl?: string;
  cardColor: string;
  textColor: string;
}

const eventCategories = [
  'Academic',
  'Social',
  'Sports',
  'Cultural',
  'Hackathons',
  'Workshops',
  'Fests',
  'Other'
];

const colorOptions = [
  { name: 'Blue', bg: 'bg-blue-500', text: 'text-white' },
  { name: 'Green', bg: 'bg-green-500', text: 'text-white' },
  { name: 'Red', bg: 'bg-red-500', text: 'text-white' },
  { name: 'Purple', bg: 'bg-purple-500', text: 'text-white' },
  { name: 'Orange', bg: 'bg-orange-500', text: 'text-white' },
  { name: 'Pink', bg: 'bg-pink-500', text: 'text-white' },
  { name: 'Teal', bg: 'bg-teal-500', text: 'text-white' },
  { name: 'Yellow', bg: 'bg-yellow-400', text: 'text-black' },
  { name: 'Gray', bg: 'bg-gray-500', text: 'text-white' },
  { name: 'White', bg: 'bg-white', text: 'text-black' },
];

const HostEventForm = ({ open, onClose, onEventCreated, hostType, hostId, hostName }: HostEventFormProps) => {
  const { hostEvent } = useEventHost();
  const [isChecking, setIsChecking] = useState(false);
  const [locationTab, setLocationTab] = useState("physical");

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: eventCategories[0],
      date: new Date(),
      time: '12:00',
      isOnline: false,
      cardColor: 'bg-blue-500',
      textColor: 'text-white',
    }
  });

  const watchIsOnline = form.watch("isOnline");

  const onSubmit = async (data: FormValues) => {
    setIsChecking(true);
    
    try {
      // Combine date and time
      const dateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      dateTime.setHours(hours, minutes);

      // Combine end date and time if provided
      let endDateTime = undefined;
      if (data.endDate) {
        endDateTime = new Date(data.endDate);
        if (data.endTime) {
          const [endHours, endMinutes] = data.endTime.split(':').map(Number);
          endDateTime.setHours(endHours, endMinutes);
        } else {
          // Default to end of day
          endDateTime.setHours(23, 59);
        }
      }
      
      // Format data for submission
      const formattedData = {
        title: data.title,
        description: data.description,
        date: dateTime.toISOString(),
        end_date: endDateTime?.toISOString(),
        location: data.isOnline ? 'Online' : data.location,
        category: data.category,
        image_url: data.imageUrl,
        host_type: hostType,
        host_id: hostId || undefined,
        metadata: {
          isOnline: data.isOnline,
          onlineLink: data.onlineLink,
          cardColor: data.cardColor,
          textColor: data.textColor
        }
      };
      
      await hostEvent.mutateAsync(formattedData);
      form.reset();
      if (onEventCreated) onEventCreated();
      onClose();
    } catch (error) {
      console.error('Error hosting event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Host a New Event</DialogTitle>
          <DialogDescription>
            Create an event as {hostName}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Event title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Event description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter event description" 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                rules={{ required: "Event date is required" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
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
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                name="time"
                rules={{ required: "Start time is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
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
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            const eventStart = form.getValues('date');
                            return eventStart ? date < eventStart : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isOnline"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Online Event</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Toggle if this is an online event
                    </p>
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
            
            {watchIsOnline ? (
              <FormField
                control={form.control}
                name="onlineLink"
                rules={{
                  required: watchIsOnline ? "Online meeting link is required" : false,
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: "Please enter a valid URL",
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                        <LinkIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="https://meet.google.com/abc-defg-hij"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="location"
                rules={{
                  required: !watchIsOnline ? "Location is required" : false,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                        <MapPin className="ml-2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Enter event location" 
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL for event poster/banner" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add a URL to an image for your event poster or banner
                  </p>
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Card Appearance</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cardColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.slice(0, 10).map((color) => (
                          <div 
                            key={color.name}
                            className={cn(
                              "w-full aspect-square rounded-md cursor-pointer border-2",
                              color.bg,
                              field.value === color.bg ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-transparent"
                            )}
                            title={color.name}
                            onClick={() => {
                              field.onChange(color.bg);
                              // If we change background color, update text color accordingly
                              form.setValue("textColor", color.text);
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={cn(
                            "flex items-center justify-center h-10 rounded-md cursor-pointer border-2",
                            "bg-white",
                            field.value === 'text-black' ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-transparent"
                          )}
                          onClick={() => field.onChange('text-black')}
                        >
                          <span className="text-black font-medium">Text</span>
                        </div>
                        
                        <div 
                          className={cn(
                            "flex items-center justify-center h-10 rounded-md cursor-pointer border-2",
                            "bg-black",
                            field.value === 'text-white' ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-transparent"
                          )}
                          onClick={() => field.onChange('text-white')}
                        >
                          <span className="text-white font-medium">Text</span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className={cn(
                "p-4 rounded-md mt-2 transition-colors border",
                form.watch('cardColor'),
                form.watch('textColor')
              )}>
                <p className="font-medium">Card Preview</p>
                <p className="text-sm opacity-80">This is how your event card will appear</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={hostEvent.isPending || isChecking}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={hostEvent.isPending || isChecking}
              >
                {hostEvent.isPending || isChecking ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HostEventForm;
