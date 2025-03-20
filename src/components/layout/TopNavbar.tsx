
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Layers, Users, MessageSquare, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/Logo';

const TopNavbar = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/clubs', label: 'Clubs', icon: Layers },
    { path: '/communities', label: 'Communities', icon: Users },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container py-3">
        <div className="flex items-center justify-between mb-4">
          <Logo />
          <div className="flex items-center gap-1">
            {navItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  'p-2 rounded-md flex flex-col items-center justify-center text-xs',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <item.icon size={18} />
                <span className="mt-1">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
