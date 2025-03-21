
import React from 'react';
import { Home, Search, Users, MessageSquare, Bell, User, PenTool } from 'lucide-react';
import MoreDropdown from '@/components/layout/MoreDropdown';

export const useNavigation = () => {
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      activeIcon: <Home className="h-5 w-5 fill-current" />,
    },
    {
      name: "Search",
      href: "/search",
      icon: <Search className="h-5 w-5" />,
      activeIcon: <Search className="h-5 w-5 fill-current" />,
    },
    {
      name: "Communities",
      href: "/communities",
      icon: <Users className="h-5 w-5" />,
      activeIcon: <Users className="h-5 w-5 fill-current" />,
    },
    {
      name: "Create",
      href: "/create-post",
      icon: <PenTool className="h-5 w-5" />,
      activeIcon: <PenTool className="h-5 w-5 fill-current" />,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      activeIcon: <MessageSquare className="h-5 w-5 fill-current" />,
      hasBadge: true,
    },
    {
      name: "More",
      component: <MoreDropdown />,
      mobileOnly: false,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      activeIcon: <Bell className="h-5 w-5 fill-current" />,
      hasBadge: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      activeIcon: <User className="h-5 w-5 fill-current" />,
    },
  ];

  return { navItems };
};
