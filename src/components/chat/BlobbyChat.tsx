'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBlobbyStore } from '@/lib/store/blobby';
import { BLOBBY_STATES } from '@/lib/constants';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'blobby';
  timestamp: Date;
};

type BlobbyChatProps = {
  onGoalCreated?: (goal: string) => void;
  onTipShared?: () => void;
};

export default function BlobbyChat({ onGoalCreated, onTipShared }: BlobbyChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Blobby, your personal goal buddy. How can I help you today?",
      sender: 'blobby',
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { setStatus } = useBlobbyStore();

  useEffect(() => {
    // Scroll to bottom whenever messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    setStatus('THINKING');

    // Simulate API call with setTimeout
    setTimeout(() => {
      generateBlobbyResponse(userMessage.content);
    }, 1500);
  };

  const generateBlobbyResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    let response = '';
    let newStatus: keyof typeof BLOBBY_STATES = 'SUPPORTIVE';

    // Simple response logic based on keywords
    if (lowercaseMessage.includes('goal') || lowercaseMessage.includes('want to')) {
      if (lowercaseMessage.includes('help') || lowercaseMessage.includes('how')) {
        response = "I'd be happy to help you with your goals! What specific goal are you working on? Remember, the most effective goals are specific, measurable, achievable, relevant, and time-bound.";
        newStatus = 'SUPPORTIVE';
      } else {
        response = "That sounds like a great goal! Would you like to add this to your goals list? I can help you break it down into manageable steps.";
        newStatus = 'CELEBRATING';
        if (onGoalCreated && lowercaseMessage.length > 10) {
          // Extract potential goal from message
          const goalText = userMessage.replace(/my goal is|i want to|i'd like to|i would like to/gi, '').trim();
          if (goalText) {
            onGoalCreated(goalText);
          }
        }
      }
    } else if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('difficult') || lowercaseMessage.includes('hard')) {
      response = "I'm sorry to hear you're feeling that way. It's normal to face challenges. What's one small step you could take today to move forward?";
      newStatus = 'SUPPORTIVE';
    } else if (lowercaseMessage.includes('thank') || lowercaseMessage.includes('thanks')) {
      response = "You're welcome! I'm here to support you on your journey. Keep up the great work!";
      newStatus = 'CELEBRATING';
    } else if (lowercaseMessage.includes('tip') || lowercaseMessage.includes('advice')) {
      response = "Here's a tip: Try breaking down big goals into smaller, actionable tasks. This makes progress more manageable and gives you more frequent wins to celebrate!";
      newStatus = 'THINKING';
      if (onTipShared) {
        onTipShared();
      }
    } else {
      response = "I'm here to help you with your goals! Would you like to discuss a specific goal, get some motivation, or receive productivity tips?";
      newStatus = 'IDLE';
    }

    // Add Blobby's response
    const blobbyMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: 'blobby',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, blobbyMessage]);
    setIsTyping(false);
    setStatus(newStatus);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] p-3 rounded-lg 
                ${message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted text-foreground rounded-tl-none'
                }
              `}
            >
              <p>{message.content}</p>
              <div className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground p-3 rounded-lg rounded-tl-none">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Blobby is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="p-3 border-t border-border bg-background">
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isTyping}
            className="flex-1 bg-muted border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentMessage.trim() || isTyping}
            size="icon"
            className="bg-primary text-primary-foreground rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 