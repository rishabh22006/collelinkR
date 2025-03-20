
import React from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Plus } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const Messages = () => {
  // Sample messages data
  const conversations = [
    { id: 1, name: "Alex Johnson", avatar: null, lastMessage: "Hey, did you finish the assignment?", time: "10:30 AM", unread: 2 },
    { id: 2, name: "Sam Parker", avatar: null, lastMessage: "Can we meet for coffee tomorrow?", time: "Yesterday", unread: 0 },
    { id: 3, name: "Jamie Williams", avatar: null, lastMessage: "Thanks for your help with the project!", time: "Monday", unread: 0 },
    { id: 4, name: "Taylor Smith", avatar: null, lastMessage: "Did you see the email from Prof. Lee?", time: "May 10", unread: 1 },
    { id: 5, name: "Morgan Davis", avatar: null, lastMessage: "The club meeting is at 5pm tomorrow.", time: "May 8", unread: 0 },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <button className="p-2 rounded-full bg-muted">
              <Plus size={20} />
            </button>
          </div>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search conversations"
              className="pl-9 w-full bg-muted text-sm"
            />
          </div>
        </div>
      </header>

      <main className="container py-4">
        <div className="divide-y divide-border">
          {conversations.map((conversation) => (
            <motion.div 
              key={conversation.id} 
              className="py-3 flex items-center gap-3 cursor-pointer"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.avatar || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {conversation.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{conversation.name}</h3>
                  <span className="text-xs text-muted-foreground">{conversation.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">{conversation.unread}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {conversations.length === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Messages Yet</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Start connecting with peers and send your first message.
            </p>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              <Plus size={18} />
              <span>Start New Conversation</span>
            </button>
          </motion.div>
        )}
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Messages;
