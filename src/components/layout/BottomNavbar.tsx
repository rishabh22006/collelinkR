
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  UserCheck,
  Settings,
} from 'lucide-react';

const BottomNavbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className={`py-3 px-2 flex flex-1 flex-col items-center justify-center ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home size={20} strokeWidth={2} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            to="/events"
            className={`py-3 px-2 flex flex-1 flex-col items-center justify-center ${
              isActive('/events') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Calendar size={20} strokeWidth={2} />
            <span className="text-xs mt-1">Events</span>
          </Link>

          <Link
            to="/communities"
            className={`py-3 px-2 flex flex-1 flex-col items-center justify-center ${
              pathname.includes('/communities') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Users size={20} strokeWidth={2} />
            <span className="text-xs mt-1">Communities</span>
          </Link>

          <Link
            to="/clubs"
            className={`py-3 px-2 flex flex-1 flex-col items-center justify-center ${
              pathname.includes('/clubs') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <UserCheck size={20} strokeWidth={2} />
            <span className="text-xs mt-1">Clubs</span>
          </Link>

          <Link
            to="/settings"
            className={`py-3 px-2 flex flex-1 flex-col items-center justify-center ${
              isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Settings size={20} strokeWidth={2} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
