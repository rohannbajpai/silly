'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BlobbyChat from '@/components/chat/BlobbyChat';
import Blobby from '@/components/blobby/Blobby';
import { useToast } from '@/components/ui/use-toast';
import { useBlobbyStore } from '@/lib/store/blobby';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header with simple text */}
      <div className="py-2 px-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">Blobby</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Goal Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTips(!showTips)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          Show Tips
        </Button>
      </div>
      
      {/* Main Chat Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area takes full width when tips are hidden */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full p-0">
            <div className="h-full bg-background">
              {/* Chat title */}
              <div className="p-3 bg-primary/10 text-primary font-medium mb-2">
                Chat with Blobby
              </div>
              
              {/* State indicator */}
              <div className="px-4 py-1 mb-2">
                <div className="inline-block bg-muted px-2 py-0.5 text-xs text-muted-foreground rounded">
                  State: IDLE
                </div>
              </div>
              
              {/* Blobby chat component */}
              <BlobbyChat 
                onGoalCreated={(goalText) => {
                  toast({
                    title: "Goal Suggestion",
                    description: `Goal added: "${goalText}"`,
                  });
                }}
                onTipShared={() => {
                  toast({
                    title: "Blobby shared a tip!",
                    description: "+5 XP awarded for learning something new.",
                  });
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Tips sidebar - conditionally shown */}
        {showTips && (
          <div className="w-72 border-l border-border bg-card overflow-y-auto">
            <div className="p-3 border-b border-border">
              <h2 className="font-medium">Conversation Tips</h2>
            </div>
            
            <div className="p-3 space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-medium text-sm mb-1">Goal Setting</h3>
                <p className="text-xs text-muted-foreground">
                  Try phrases like "I want to start exercising more" or "Help me set a goal for learning piano"
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-medium text-sm mb-1">Get Motivated</h3>
                <p className="text-xs text-muted-foreground">
                  Ask "I'm feeling unmotivated today" or "How can I stay consistent with my goals?"
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <h3 className="font-medium text-sm mb-1">Get Productivity Tips</h3>
                <p className="text-xs text-muted-foreground">
                  Try "Give me a productivity tip" or "How can I manage my time better?"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 