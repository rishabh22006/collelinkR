
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Calendar, UsersRound, Search, Medal, PenTool } from 'lucide-react';

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
          <NavigationMenuTrigger
            className={cn(
              "text-sm font-medium",
              (isActive('/clubs') || isActive('/communities')) && "text-primary"
            )}
          >
            <UsersRound className="h-4 w-4 mr-2" />
            Communities
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[200px]">
              <li>
                <NavigationMenuLink 
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigate('/clubs')}
                >
                  <div className="text-sm font-medium">Clubs</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Browse and join campus clubs
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink 
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => navigate('/communities')}
                >
                  <div className="text-sm font-medium">Communities</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Join interest-based communities
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
              isActive('/search') && "text-primary"
            )}
            onClick={() => navigate('/search')}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium",
              isActive('/leaderboard') && "text-primary"
            )}
            onClick={() => navigate('/leaderboard')}
          >
            <Medal className="h-4 w-4 mr-2" />
            Leaderboard
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigationMenu;
