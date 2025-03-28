
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export interface Chat {
  id: string;
  created_at: string;
  updated_at: string;
  participant?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
    read: boolean;
  };
  unread_count: number;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read: boolean;
}

export interface UserSearchResult {
  id: string;
  display_name: string;
  avatar_url: string | null;
  email: string;
}

export const useChat = () => {
  const { profile } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to chat messages
  useEffect(() => {
    if (!currentChat) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${currentChat}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChat]);

  // Load chats for the current user
  const loadChats = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data: participations, error: participationsError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', profile.id);

      if (participationsError) throw participationsError;
      
      if (!participations.length) {
        setChats([]);
        setLoading(false);
        return;
      }

      const chatIds = participations.map(p => p.chat_id);

      // For each chat, we need to get:
      // 1. The other participant's profile
      // 2. The last message
      // 3. Count of unread messages
      const results = await Promise.all(
        chatIds.map(async (chatId) => {
          // Get chat details
          const { data: chatData } = await supabase
            .from('user_chats')
            .select('*')
            .eq('id', chatId)
            .single();

          // Get other participant
          const { data: participants } = await supabase
            .from('chat_participants')
            .select('user_id')
            .eq('chat_id', chatId)
            .neq('user_id', profile.id);

          let participant = null;
          if (participants && participants.length > 0) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('id, display_name, avatar_url')
              .eq('id', participants[0].user_id)
              .single();
            participant = userData;
          }

          // Get last message
          const { data: lastMessageData } = await supabase
            .from('chat_messages')
            .select('content, created_at, sender_id, read')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chatId)
            .eq('read', false)
            .neq('sender_id', profile.id);

          return {
            ...chatData,
            participant,
            last_message: lastMessageData,
            unread_count: count || 0
          };
        })
      );

      setChats(results as Chat[]);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load your conversations');
    } finally {
      setLoading(false);
    }
  };

  // Load messages for the selected chat
  const loadMessages = async (chatId: string) => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data as Message[]);
      setCurrentChat(chatId);
      
      // Mark messages as read
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', profile.id);
        
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!profile || !currentChat || !content.trim()) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: currentChat,
          sender_id: profile.id,
          content,
          read: false
        });

      if (error) throw error;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Search for users to start a chat with
  const searchUsers = async (query: string) => {
    if (!profile || !query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearchQuery(query);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, email')
        .neq('id', profile.id)
        .ilike('display_name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      
      setSearchResults(data as UserSearchResult[]);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  // Start or get an existing chat with a user
  const startChat = async (userId: string) => {
    if (!profile) return null;
    
    try {
      const { data, error } = await supabase
        .rpc('get_or_create_direct_chat', {
          user1_id: profile.id,
          user2_id: userId
        });

      if (error) throw error;
      
      await loadChats();
      return data;
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start conversation');
      return null;
    }
  };

  return {
    chats,
    currentChat,
    messages,
    loading,
    searchResults,
    searchQuery,
    loadChats,
    loadMessages,
    sendMessage,
    searchUsers,
    startChat,
    setCurrentChat
  };
};
