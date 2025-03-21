
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "./components/shared/PageTransition";
import AuthProvider from "./components/providers/AuthProvider";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Clubs from "./pages/Clubs";
import Communities from "./pages/Communities";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Partners from "./pages/Partners";
import RegisterClub from "./pages/RegisterClub";
import UserCalendar from "./pages/UserCalendar";
import CreatePost from "./pages/CreatePost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
              <PageTransition>
                <Communities />
              </PageTransition>
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
                <UserCalendar />
              </PageTransition>
            } />
            <Route path="/create-post" element={
              <PageTransition>
                <CreatePost />
              </PageTransition>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
