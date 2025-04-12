import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Events from '@/pages/Events';
import UserCalendar from '@/pages/UserCalendar';
import GoogleCalendar from '@/pages/GoogleCalendar';
import CreatePost from '@/pages/CreatePost';
import Clubs from '@/pages/Clubs';
import Communities from '@/pages/Communities';
import Certificates from '@/pages/Certificates';
import Leaderboard from '@/pages/Leaderboard';
import Connections from '@/pages/Connections';
import Search from '@/pages/Search';
import Messages from '@/pages/Messages';
import Partners from '@/pages/Partners';
import About from '@/pages/About';
import Notifications from '@/pages/Notifications';
import RegisterClub from '@/pages/RegisterClub';
import RegisterCommunity from '@/pages/RegisterCommunity';
import NotFound from '@/pages/NotFound';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="collelink-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/events" element={<Events />} />
            <Route path="/calendar" element={<UserCalendar />} />
            <Route path="/google-calendar" element={<GoogleCalendar />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/search" element={<Search />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/about" element={<About />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/register-club" element={<RegisterClub />} />
            <Route path="/register-community" element={<RegisterCommunity />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
