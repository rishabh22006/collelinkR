
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Calendar, MessageSquare } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <header className="container py-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold ml-2">About</h1>
        </div>
      </header>

      <main className="container py-4 space-y-12 max-w-3xl mx-auto">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-4">ColleLink</h2>
          <p className="text-muted-foreground mb-4">
            Connecting students across campuses
          </p>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="prose prose-sm max-w-none">
          <p>
            ColleLink is a comprehensive platform designed to enhance the college experience by connecting students, 
            clubs, and events in one centralized hub. Our mission is to foster a sense of community and engagement 
            among students, making campus life more accessible and enriching.
          </p>
          
          <p>
            Whether you're looking to join clubs that align with your interests, discover exciting campus events, 
            or connect with peers across different departments, ColleLink provides all the tools you need to make 
            the most of your college journey.
          </p>
          
          <h3>Our Vision</h3>
          <p>
            We envision a campus environment where every student feels connected, engaged, and empowered to pursue 
            their passions. ColleLink aims to break down the barriers between different campus communities, promoting 
            collaboration, innovation, and a sense of belonging among all students.
          </p>
          
          <h3>Our Values</h3>
          <ul>
            <li>
              <strong>Community:</strong> Fostering meaningful connections between students, clubs, and the broader 
              campus community.
            </li>
            <li>
              <strong>Accessibility:</strong> Making campus resources and opportunities easily accessible to all students.
            </li>
            <li>
              <strong>Innovation:</strong> Continuously evolving to meet the changing needs of college students and communities.
            </li>
            <li>
              <strong>Inclusivity:</strong> Creating a platform where all students feel welcomed and represented.
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border rounded-xl">
            <BookOpen className="mx-auto mb-2 text-primary" size={28} />
            <h3 className="font-medium mb-1">100+</h3>
            <p className="text-sm text-muted-foreground">Clubs & Communities</p>
          </div>
          
          <div className="p-4 border rounded-xl">
            <Users className="mx-auto mb-2 text-primary" size={28} />
            <h3 className="font-medium mb-1">5,000+</h3>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </div>
          
          <div className="p-4 border rounded-xl">
            <Calendar className="mx-auto mb-2 text-primary" size={28} />
            <h3 className="font-medium mb-1">250+</h3>
            <p className="text-sm text-muted-foreground">Events Hosted</p>
          </div>
          
          <div className="p-4 border rounded-xl">
            <MessageSquare className="mx-auto mb-2 text-primary" size={28} />
            <h3 className="font-medium mb-1">10,000+</h3>
            <p className="text-sm text-muted-foreground">Messages Exchanged</p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Join ColleLink Today</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discover new opportunities, connect with like-minded peers, and make the most of your college experience 
            with ColleLink. Our platform is designed by students, for students, to enhance campus life and create 
            a more connected college community.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/auth?tab=signup">Sign Up</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth">Login</Link>
            </Button>
          </div>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default About;
