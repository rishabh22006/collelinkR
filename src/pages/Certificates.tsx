
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Award, Search, Medal } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CertificateCard from '@/components/certificates/CertificateCard';
import CertificateForm from '@/components/certificates/CertificateForm';
import { useCertificates } from '@/hooks/useCertificates';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { LeaderboardEntry } from '@/types/certificates';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const Certificates = () => {
  const { isAuthenticated } = useAuth();
  const { certificates, isLoading } = useCertificates();
  const { userRank } = useLeaderboard();
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCertificates = certificates.filter(cert => 
    cert.title.toLowerCase().includes(search.toLowerCase()) || 
    cert.issuer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-16">
      <TopNavbar />
      
      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Certificates</h1>
              <p className="text-muted-foreground">
                Manage your achievements and track your progress
              </p>
            </div>
            
            {userRank && (
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <span className="font-semibold">{userRank.total_points} Points</span>
                  {userRank.overall_rank && (
                    <span className="ml-1 text-muted-foreground">
                      (Rank #{userRank.overall_rank})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="certificates" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="certificates">My Certificates</TabsTrigger>
              <TabsTrigger value="add">Add Certificate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="certificates">
              <div className="mb-6 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search certificates..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} className="mr-2" />
                      Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Certificate</DialogTitle>
                    </DialogHeader>
                    <CertificateForm />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : filteredCertificates.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredCertificates.map(certificate => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Medal className="mx-auto h-12 w-12 text-muted-foreground opacity-40 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No certificates found</h3>
                  {search ? (
                    <p className="text-muted-foreground">
                      No certificates match your search criteria.
                    </p>
                  ) : (
                    <p className="text-muted-foreground mb-4">
                      Start adding your achievements to build your portfolio.
                    </p>
                  )}
                  
                  {!search && (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="mt-2"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Your First Certificate
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="add">
              <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Certificate</h2>
                <CertificateForm />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default Certificates;
