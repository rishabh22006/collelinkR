
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Languages } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUserSettings } from '@/hooks/useUserSettings';

const DisplaySettings: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();
  
  const [darkMode, setDarkMode] = React.useState(() => {
    // Default to system preference if no settings
    if (!settings) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [language, setLanguage] = React.useState(settings?.language || 'en');
  
  // Update local state when settings are loaded
  useEffect(() => {
    if (settings) {
      const isDark = settings.theme === 'dark' || 
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      setLanguage(settings.language);
    }
  }, [settings]);

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Update theme in document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Update settings in database
    updateSettings.mutate({
      theme: newDarkMode ? 'dark' : 'light'
    });
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Update settings in database
    updateSettings.mutate({
      language: newLanguage
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>
          Customize how the app looks and feels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              Dark Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark theme.
            </p>
          </div>
          <Switch 
            checked={darkMode}
            onCheckedChange={handleToggleDarkMode}
            disabled={updateSettings.isPending}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Languages size={16} />
            Language
          </Label>
          <select 
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={language}
            onChange={handleLanguageChange}
            disabled={updateSettings.isPending}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
