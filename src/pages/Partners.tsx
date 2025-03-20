
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, Trophy, Briefcase, Users2 } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Partners = () => {
  // Sample partners data
  const partners = [
    { id: 1, name: "TechCorp", logo: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", description: "Leading technology solutions provider" },
    { id: 2, name: "EduLearn", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", description: "Educational resources and learning tools" },
    { id: 3, name: "Innovate Inc", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", description: "Cutting-edge innovation lab" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

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
          <h1 className="text-xl font-semibold ml-2">Our Partners</h1>
        </div>
      </header>

      <main className="container py-4 space-y-12">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-4">Partner with ScrollConnect</h2>
          <p className="text-muted-foreground mb-8">
            ScrollConnect is India's premier platform connecting companies with exceptional student talent. We
            bridge the gap between industry leaders and tomorrow's workforce, fostering meaningful partnerships
            that drive innovation and growth.
          </p>
          <Button className="mx-auto">
            Become a Partner
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="p-6 text-center border rounded-xl"
            variants={itemVariants}
          >
            <Users className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium mb-2">Access to Student Talent</h3>
            <p className="text-sm text-muted-foreground">Connect directly with motivated students from top institutions.</p>
          </motion.div>
          
          <motion.div 
            className="p-6 text-center border rounded-xl"
            variants={itemVariants}
          >
            <Trophy className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium mb-2">Brand Visibility</h3>
            <p className="text-sm text-muted-foreground">Showcase your brand to a targeted audience of young professionals.</p>
          </motion.div>
          
          <motion.div 
            className="p-6 text-center border rounded-xl"
            variants={itemVariants}
          >
            <Briefcase className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium mb-2">Event Participation</h3>
            <p className="text-sm text-muted-foreground">Participate in career fairs, workshops, and networking events.</p>
          </motion.div>
          
          <motion.div 
            className="p-6 text-center border rounded-xl"
            variants={itemVariants}
          >
            <Users2 className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-medium mb-2">Community Engagement</h3>
            <p className="text-sm text-muted-foreground">Engage with a vibrant community of students and professionals.</p>
          </motion.div>
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Why Partner with Us?</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-muted-foreground mb-8">
              ScrollConnect offers a unique opportunity to engage with India's brightest young talents. Our platform
              serves as a bridge between industry leaders and ambitious students, facilitating meaningful connections
              that benefit both parties.
            </p>
            
            <p className="text-center text-muted-foreground mb-8">
              As a partner, you'll gain exclusive access to our network of students from premier institutions, participate
              in curated events, and showcase your brand to a highly engaged audience of future professionals.
            </p>
            
            <p className="text-center text-muted-foreground mb-8">
              Whether you're looking to recruit top talent, build your brand presence, or contribute to the development
              of tomorrow's workforce, ScrollConnect provides the perfect platform to achieve your goals.
            </p>
          </div>
        </div>

        {partners.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Our Current Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {partners.map(partner => (
                <motion.div 
                  key={partner.id}
                  className="border rounded-xl overflow-hidden shadow-sm"
                  whileHover={{ y: -5 }}
                >
                  <div className="h-40 bg-muted">
                    {partner.logo ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Briefcase size={48} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Partners;
