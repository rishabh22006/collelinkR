
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Plus, ArrowLeft, MoreVertical, Image, Paperclip, Smile } from 'lucide-react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

// Sample conversations data
const conversations = [
  { id: 1, name: "Alex Johnson", avatar: null, lastMessage: "Hey, did you finish the assignment?", time: "10:30 AM", unread: 2 },
  { id: 2, name: "Sam Parker", avatar: null, lastMessage: "Can we meet for coffee tomorrow?", time: "Yesterday", unread: 0 },
  { id: 3, name: "Jamie Williams", avatar: null, lastMessage: "Thanks for your help with the project!", time: "Monday", unread: 0 },
  { id: 4, name: "Taylor Smith", avatar: null, lastMessage: "Did you see the email from Prof. Lee?", time: "May 10", unread: 1 },
  { id: 5, name: "Morgan Davis", avatar: null, lastMessage: "The club meeting is at 5pm tomorrow.", time: "May 8", unread: 0 },
];

// Sample messages for selected conversation
const messagesByConversation = {
  1: [
    { id: 1, text: "Hey, did you finish the assignment?", sent: false, timestamp: "10:30 AM" },
    { id: 2, text: "Not yet, still working on the last problem. How about you?", sent: true, timestamp: "10:32 AM" },
    { id: 3, text: "I'm done with most of it, but stuck on question 5.", sent: false, timestamp: "10:35 AM" },
    { id: 4, text: "I can help you with that after I finish mine!", sent: true, timestamp: "10:36 AM" },
    { id: 5, text: "That would be great! When do you think you'll be done?", sent: false, timestamp: "10:40 AM" },
  ],
  2: [
    { id: 1, text: "Can we meet for coffee tomorrow?", sent: false, timestamp: "Yesterday" },
    { id: 2, text: "Sure, what time works for you?", sent: true, timestamp: "Yesterday" },
    { id: 3, text: "How about 3pm at the campus cafe?", sent: false, timestamp: "Yesterday" },
    { id: 4, text: "Perfect, see you then!", sent: true, timestamp: "Yesterday" },
  ]
};

const Messages = () => {
  const { profile } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedConversation && messagesByConversation[selectedConversation as keyof typeof messagesByConversation]) {
      setMessages(messagesByConversation[selectedConversation as keyof typeof messagesByConversation]);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    if (!selectedConversation) {
      toast.error("Please select a conversation");
      return;
    }
    
    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sent: true,
      timestamp: "Just now"
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        text: "Thanks for your message! I'll get back to you soon.",
        sent: false,
        timestamp: "Just now"
      };
      setMessages(prevMessages => [...prevMessages, autoReply]);
    }, 1000);
  };
  
  const getSelectedConversation = () => {
    return conversations.find(c => c.id === selectedConversation);
  };

  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <div className="container flex h-[calc(100vh-140px)] py-4">
        {/* Conversations List */}
        <div className={`w-full md:w-1/3 border-r pr-4 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button variant="ghost" size="icon">
              <Plus size={20} />
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search conversations"
              className="pl-9"
            />
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
            {conversations.map((conversation) => (
              <motion.div 
                key={conversation.id} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${selectedConversation === conversation.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                onClick={() => handleSelectConversation(conversation.id)}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
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
        </div>
        
        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col ${selectedConversation ? 'block' : 'hidden md:flex'}`}>
          {selectedConversation ? (
            <>
              <div className="border-b py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                    <ArrowLeft size={20} />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getSelectedConversation()?.avatar || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getSelectedConversation()?.name.split(' ').map(n => n[0]).join('') || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{getSelectedConversation()?.name}</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${message.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.sent && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={getSelectedConversation()?.avatar || ""} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getSelectedConversation()?.name.split(' ').map(n => n[0]).join('') || ''}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`p-3 rounded-lg max-w-xs ${
                          message.sent
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-muted rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp}
                      </p>
                    </div>
                    {message.sent && (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {profile?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-3 border-t flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Plus size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Image size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Paperclip size={20} />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Smile size={20} />
                </Button>
                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send size={16} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Conversation Selected</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Select a conversation from the list to start chatting or start a new conversation.
              </p>
              <Button>
                <Plus size={16} className="mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Messages;
