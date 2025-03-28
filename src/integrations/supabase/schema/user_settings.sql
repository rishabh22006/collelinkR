
-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system',
  language TEXT NOT NULL DEFAULT 'en',
  notifications JSONB NOT NULL DEFAULT '{
    "messages": true,
    "events": true,
    "friendRequests": true,
    "achievements": true,
    "likes": true,
    "systemUpdates": true
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Add RLS policies for user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own settings
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (user_id = auth.uid());

-- Only allow users to update their own settings
CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (user_id = auth.uid());

-- Only allow users to insert their own settings
CREATE POLICY "Users can insert their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Add trigger to update the updated_at timestamp
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
