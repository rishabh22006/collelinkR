
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Users, MessageSquare, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';

const BottomNavbarWithChat = () => {
  const location = useLocation();
  const { profile } = useAuthStore();
  const { navItems } = useNavigation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
      <div className="container">
        <div className="flex items-center justify-around">
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1", 
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {location.pathname === "/" ? 
              <Home className="h-5 w-5 fill-current" /> : 
              <Home className="h-5 w-5" />
            }
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1", 
              location.pathname === "/search" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {location.pathname === "/search" ? 
              <Search className="h-5 w-5 fill-current" /> : 
              <Search className="h-5 w-5" />
            }
            <span className="text-xs mt-1">Search</span>
          </Link>
          
          <Link 
            to="/communities" 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1", 
              location.pathname === "/communities" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {location.pathname === "/communities" ? 
              <Users className="h-5 w-5 fill-current" /> : 
              <Users className="h-5 w-5" />
            }
            <span className="text-xs mt-1">Communities</span>
          </Link>
          
          <Link 
            to="/messages" 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1 relative", 
              location.pathname === "/messages" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {location.pathname === "/messages" ? 
              <MessageSquare className="h-5 w-5 fill-current" /> : 
              <MessageSquare className="h-5 w-5" />
            }
            <span className="text-xs mt-1">Chat</span>
            {profile && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                3
              </Badge>
            )}
          </Link>
          
          <Link 
            to="/notifications" 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1 relative", 
              location.pathname === "/notifications" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {location.pathname === "/notifications" ? 
              <Bell className="h-5 w-5 fill-current" /> : 
              <Bell className="h-5 w-5" />
            }
            <span className="text-xs mt-1">Alerts</span>
            {profile && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                2
              </Badge>
            )}
          </Link>
          
          <Link 
            to="/profile" 
            className={cn(
              "flex flex-col items-center justify-center py-3 px-1", 
              location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {location.pathname === "/profile" ? 
              <User className="h-5 w-5 fill-current" /> : 
              <User className="h-5 w-5" />
            }
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbarWithChat;
