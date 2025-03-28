
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger, 
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Calendar, PenTool, Award } from 'lucide-react';
import MoreDropdown from './MoreDropdown';

const MainNavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              "text-sm font-medium",
              isActive('/events') && "text-primary"
            )}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li>
                <NavigationMenuLink 
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigate('/events')}
                >
                  <div className="text-sm font-medium">All Events</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Browse all campus events
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink 
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigate('/calendar')}
                >
                  <div className="text-sm font-medium">Calendar View</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    View events in calendar format
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              isActive('/certificates') && "text-primary"
            )}
            onClick={() => navigate('/certificates')}
          >
            <Award className="h-4 w-4 mr-2" />
            Certificates
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              isActive('/create-post') && "text-primary"
            )}
            onClick={() => navigate('/create-post')}
          >
            <PenTool className="h-4 w-4 mr-2" />
            Create
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <MoreDropdown />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigationMenu;
