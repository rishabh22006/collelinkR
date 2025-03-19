
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Users, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/connections', label: 'Connections', icon: Users },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50 transition-all duration-300 ease-smooth">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'nav-link',
                isActive && 'active'
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
