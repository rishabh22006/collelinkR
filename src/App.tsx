
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import PageTransition from "./components/shared/PageTransition";
import AuthProvider from "./components/providers/AuthProvider";
import ChatDrawer from "./components/messaging/ChatDrawer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Clubs from "./pages/Clubs";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Partners from "./pages/Partners";
import RegisterClub from "./pages/RegisterClub";
import UserCalendar from "./pages/UserCalendar";
import GoogleCalendar from "./pages/GoogleCalendar";
import CreatePost from "./pages/CreatePost";
import Certificates from "./pages/Certificates";
import Leaderboard from "./pages/Leaderboard";
import Events from "./pages/Events";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ChatDrawer />
            <Routes>
              <Route path="/" element={
                <PageTransition>
                  <Index />
                </PageTransition>
              } />
              <Route path="/search" element={
                <PageTransition>
                  <Search />
                </PageTransition>
              } />
              <Route path="/clubs" element={
                <PageTransition>
                  <Clubs />
                </PageTransition>
              } />
              <Route path="/communities" element={
                <Navigate to="/clubs" replace />
              } />
              <Route path="/messages" element={
                <PageTransition>
                  <Messages />
                </PageTransition>
              } />
              <Route path="/notifications" element={
                <PageTransition>
                  <Notifications />
                </PageTransition>
              } />
              <Route path="/profile" element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              } />
              <Route path="/about" element={
                <PageTransition>
                  <About />
                </PageTransition>
              } />
              <Route path="/partners" element={
                <PageTransition>
                  <Partners />
                </PageTransition>
              } />
              <Route path="/auth" element={
                <PageTransition>
                  <Auth />
                </PageTransition>
              } />
              <Route path="/register-club" element={
                <PageTransition>
                  <RegisterClub />
                </PageTransition>
              } />
              <Route path="/calendar" element={
                <PageTransition>
                  <GoogleCalendar />
                </PageTransition>
              } />
              <Route path="/user-calendar" element={
                <PageTransition>
                  <UserCalendar />
                </PageTransition>
              } />
              <Route path="/create-post" element={
                <PageTransition>
                  <CreatePost />
                </PageTransition>
              } />
              <Route path="/certificates" element={
                <PageTransition>
                  <Certificates />
                </PageTransition>
              } />
              <Route path="/leaderboard" element={
                <PageTransition>
                  <Leaderboard />
                </PageTransition>
              } />
              <Route path="/events" element={
                <PageTransition>
                  <Events />
                </PageTransition>
              } />
              <Route path="/settings" element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
