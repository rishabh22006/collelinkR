
import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Layers, ChevronDown, Info, Users, Settings, FileText, LogOut, PlusCircle, ExternalLink, Award, Sun, Moon, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/Logo';
import { useAuthStore } from '@/stores/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/badge';

const TopNavbar = () => {
  const { profile, signOut } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden md:flex items-center gap-6">
              <NavLink
                to="/certificates"
                className={({ isActive }) => cn(
                  'text-sm font-medium',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Certificates
              </NavLink>
              <NavLink
                to="/events"
                className={({ isActive }) => cn(
                  'text-sm font-medium',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Events
              </NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                    More <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/about" className="cursor-pointer">
                        <Info className="mr-2 h-4 w-4" />
                        <span>About</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/partners" className="cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Our Partners</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register-club" className="cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Register a Club</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/privacy-policy" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Privacy Policy</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}</span>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
            </div>
            
            <Link to="/notifications" className="p-2 rounded-full hover:bg-accent relative">
              <Bell size={20} />
              {profile && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  3
                </Badge>
              )}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xs">
                      {profile?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {profile?.display_name || 'User'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/edit" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-events" className="cursor-pointer">
                      <Layers className="mr-2 h-4 w-4" />
                      <span>My Events</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
