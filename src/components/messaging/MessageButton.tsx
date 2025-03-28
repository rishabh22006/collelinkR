
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MessageButtonProps {
  userId: string;
  userName: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const MessageButton = ({ userId, userName, className, variant = 'default' }: MessageButtonProps) => {
  const { startChat } = useChat();
  const navigate = useNavigate();

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const chatId = await startChat(userId);
      if (chatId) {
        toast.success(`Started conversation with ${userName}`);
        navigate('/messages', { state: { chatId } });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Could not start conversation');
    }
  };

  return (
    <Button 
      variant={variant} 
      size="sm" 
      className={className} 
      onClick={handleMessageClick}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      Message
    </Button>
  );
};

export default MessageButton;
