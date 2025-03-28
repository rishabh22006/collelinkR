
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useChat, Chat, Message, UserSearchResult } from '@/hooks/useChat';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ChatDrawer = () => {
  const { isAuthenticated, profile } = useAuth();
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
  
  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && isAuthenticated) {
      loadChats();
    }
  }, [open, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(messageText);
    setMessageText('');
  };

  const handleChatSelect = (chatId: string) => {
    loadMessages(chatId);
    setActiveTab('messages');
  };

  const handleStartChat = async (userId: string) => {
    const chatId = await startChat(userId);
    if (chatId) {
      loadMessages(chatId);
      setActiveTab('messages');
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchUsers(query);
    }
  };

  const handleBackToChats = () => {
    setCurrentChat(null);
    setActiveTab('chats');
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

  // Calculate total unread messages for the badge
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread_count, 0);

  if (!isAuthenticated) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="fixed bottom-24 right-4 z-50 rounded-full h-14 w-14 shadow-lg">
            <MessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center h-full">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Messaging</h3>
            <p className="text-center text-muted-foreground mb-6">
              You need to sign in to use the messaging feature.
            </p>
            <Button onClick={() => {
              setOpen(false);
              window.location.href = '/auth';
            }}>
              Sign In
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            variant="outline" 
            className="fixed bottom-24 right-4 z-50 rounded-full h-14 w-14 shadow-lg"
          >
            <MessageSquare className="h-6 w-6" />
            {totalUnread > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 min-w-5">
                {totalUnread}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            {activeTab === 'messages' && currentChat ? (
              <>
                <SheetHeader className="border-b p-4">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={handleBackToChats} className="mr-2">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={currentChatData?.participant?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {currentChatData?.participant?.display_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <SheetTitle className="text-left">
                      {currentChatData?.participant?.display_name || "Chat"}
                    </SheetTitle>
                  </div>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex mb-4", 
                        message.sender_id === profile?.id ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender_id !== profile?.id && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={currentChatData?.participant?.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {currentChatData?.participant?.display_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className={cn(
                          "p-3 rounded-lg max-w-[80%]",
                          message.sender_id === profile?.id
                            ? "bg-primary text-primary-foreground rounded-tr-none ml-auto"
                            : "bg-muted rounded-tl-none"
                        )}>
                          <p className="text-sm break-words">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                      {message.sender_id === profile?.id && (
                        <Avatar className="h-8 w-8 ml-2 mt-1">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {profile?.display_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                <SheetFooter className="border-t p-4">
                  <div className="flex w-full gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send size={16} />
                    </Button>
                  </div>
                </SheetFooter>
              </>
            ) : (
              <>
                <SheetHeader className="border-b p-4">
                  <SheetTitle>Messages</SheetTitle>
                </SheetHeader>
                
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="chats">Conversations</TabsTrigger>
                  <TabsTrigger value="search">Search Users</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chats" className="flex-1 flex flex-col">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading conversations...</p>
                    </div>
                  ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Search for users to start chatting
                      </p>
                      <Button onClick={() => setActiveTab('search')} variant="outline">
                        Find People
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1">
                      {chats.map((chat) => (
                        <div 
                          key={chat.id}
                          onClick={() => handleChatSelect(chat.id)}
                          className="flex items-center p-4 hover:bg-muted cursor-pointer"
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={chat.participant?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {chat.participant?.display_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <h3 className="font-medium truncate">
                                {chat.participant?.display_name || "Unknown User"}
                              </h3>
                              {chat.last_message && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(chat.last_message.created_at)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.last_message ? chat.last_message.content : "No messages yet"}
                            </p>
                          </div>
                          {chat.unread_count > 0 && (
                            <Badge variant="destructive" className="ml-2 min-w-5 h-5 flex items-center justify-center">
                              {chat.unread_count}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </TabsContent>
                
                <TabsContent value="search" className="flex-1 flex flex-col p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-9"
                    />
                  </div>
                  
                  <ScrollArea className="flex-1">
                    {searchQuery.length > 0 ? (
                      searchResults.length > 0 ? (
                        searchResults.map((user: UserSearchResult) => (
                          <div key={user.id} className="mb-2">
                            <div className="flex items-center p-3 rounded-lg hover:bg-muted">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {user.display_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium">{user.display_name}</h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleStartChat(user.id)}
                              >
                                Message
                              </Button>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                          <User className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No users found</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <Search className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Search for users to start a conversation
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </>
            )}
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatDrawer;
