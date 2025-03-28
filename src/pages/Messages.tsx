
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, MessageSquare, ArrowLeft, Plus, Image, Paperclip, Smile } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import BottomNavbar from '@/components/layout/BottomNavbar';
import TopNavbar from '@/components/layout/TopNavbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useChat } from '@/hooks/useChat';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const Messages = () => {
  const { profile } = useAuthStore();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    chats,
    messages,
    loading,
    searchResults,
    currentChat,
    loadChats,
    loadMessages,
    sendMessage,
    searchUsers,
    startChat,
    setCurrentChat
  } = useChat();
  
  // Load initial data
  useEffect(() => {
    if (profile) {
      loadChats();
      
      // If there's a chatId in the location state, open that chat
      const state = location.state as { chatId?: string };
      if (state?.chatId) {
        loadMessages(state.chatId);
      }
    }
  }, [profile]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(messageText);
    setMessageText("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      searchUsers(query);
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MM/dd/yy');
    }
  };
  
  // Find current chat data
  const currentChatData = chats.find(chat => chat.id === currentChat);

  return (
    <div className="min-h-screen pb-20">
      <TopNavbar />
      
      <div className="container flex h-[calc(100vh-140px)] py-4">
        {/* Conversations List */}
        <div className={`w-full md:w-1/3 border-r pr-4 ${currentChat ? 'hidden md:block' : 'block'}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button variant="ghost" size="icon">
              <Plus size={20} />
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          {searchTerm.length > 2 && searchResults.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">SEARCH RESULTS</h2>
              <div className="rounded-lg border overflow-hidden">
                {searchResults.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => startChat(user.id).then(chatId => {
                      if (chatId) loadMessages(chatId);
                      setSearchTerm('');
                    })}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.display_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{user.display_name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageSquare size={16} className="mr-1" />
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading conversations...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={40} className="mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-medium mb-2">No conversations yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start chatting with other users by searching their names
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <motion.div 
                  key={chat.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${currentChat === chat.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                  onClick={() => loadMessages(chat.id)}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.participant?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {chat.participant?.display_name?.split(' ').map(n => n[0]).join('') || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{chat.participant?.display_name || "Unknown User"}</h3>
                      <span className="text-xs text-muted-foreground">
                        {chat.last_message ? formatTime(chat.last_message.created_at) : ""}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.last_message ? chat.last_message.content : "No messages yet"}
                    </p>
                  </div>
                  {chat.unread_count > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {chat.unread_count}
                    </Badge>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col ${currentChat ? 'block' : 'hidden md:flex'}`}>
          {currentChat && currentChatData ? (
            <>
              <div className="border-b py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCurrentChat(null)}>
                    <ArrowLeft size={20} />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentChatData.participant?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {currentChatData.participant?.display_name?.split(' ').map(n => n[0]).join('') || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{currentChatData.participant?.display_name || "Unknown User"}</h3>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare size={40} className="mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Start the conversation by sending a message below
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender_id !== profile?.id && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={currentChatData.participant?.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {currentChatData.participant?.display_name?.charAt(0) || ''}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-lg max-w-xs ${
                            message.sender_id === profile?.id
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                      {message.sender_id === profile?.id && (
                        <Avatar className="h-8 w-8 ml-2 mt-1">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {profile?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
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
                Select a conversation from the list to start chatting or search for users to start a new conversation.
              </p>
              <Input
                placeholder="Search users to chat with..."
                className="max-w-md mb-4"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm.length > 2 && searchResults.length > 0 && (
                <div className="max-w-md w-full border rounded-lg mt-4 overflow-hidden">
                  {searchResults.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => startChat(user.id).then(chatId => {
                        if (chatId) loadMessages(chatId);
                        setSearchTerm('');
                      })}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.display_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="font-medium">{user.display_name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Button size="sm">
                        Chat
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Messages;
