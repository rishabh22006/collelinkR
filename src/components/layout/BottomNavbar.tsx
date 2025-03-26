
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, UsersRound, BellRing, Calendar, Award, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Communities', path: '/clubs', icon: UsersRound },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Leaderboard', path: '/leaderboard', icon: Medal },
    { name: 'Notifications', path: '/notifications', icon: BellRing },
  ];

  const isActive = (path: string) => {
    // Special case for communities and clubs to highlight the same tab
    if (path === '/clubs' && (location.pathname === '/clubs' || location.pathname === '/communities')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-3 z-50 flex justify-between items-center"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          size="sm"
          className={cn(
            "flex-col h-16 rounded-xl hover:bg-primary/10",
            isActive(item.path) && "text-primary"
          )}
          onClick={() => navigate(item.path)}
        >
          <item.icon 
            size={isActive(item.path) ? 22 : 20} 
            className={cn(
              "mb-1 transition-all",
              isActive(item.path) ? "stroke-[2.5px]" : "stroke-[1.5px]",
            )} 
          />
          <span className={cn(
            "text-xs",
            isActive(item.path) ? "font-bold" : "font-medium text-muted-foreground"
          )}>
            {item.name}
          </span>
          {isActive(item.path) && (
            <motion.div
              layoutId="bottomNav"
              className="absolute bottom-0 h-1 w-1/2 rounded-t-full bg-primary"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            />
          )}
        </Button>
      ))}
    </motion.div>
  );
};

export default BottomNavbar;
