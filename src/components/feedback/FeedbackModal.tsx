'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LightBulbIcon } from '@heroicons/react/24/outline';

type Feeling = 'amazing' | 'good' | 'figuring-it-out';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
}

const TIPS = [
  "Breaking down big goals into smaller tasks can make them more manageable!",
  "Celebrate your progress, no matter how small!",
  "Take regular breaks to stay fresh and focused.",
  "Remember why you started - it's a great motivator!",
  "Share your goals with others for accountability and support.",
];

export default function FeedbackModal({ isOpen, onClose, goalId }: FeedbackModalProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTip, setCurrentTip] = useState(() => 
    TIPS[Math.floor(Math.random() * TIPS.length)]
  );
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedFeeling || !goalId) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'goals', goalId), {
        completionFeeling: selectedFeeling,
        completedAt: new Date().toISOString(),
      });

      toast({
        title: 'Thanks for your feedback!',
        description: 'Your response helps us improve your experience.',
      });
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNewTip = () => {
    let newTip = currentTip;
    while (newTip === currentTip) {
      newTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    setCurrentTip(newTip);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            How did completing that feel?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col gap-3">
            <Button
              variant={selectedFeeling === 'amazing' ? 'default' : 'outline'}
              onClick={() => setSelectedFeeling('amazing')}
              disabled={isSubmitting}
              className="h-12 text-lg"
            >
              Amazing! 🎉
            </Button>
            <Button
              variant={selectedFeeling === 'good' ? 'default' : 'outline'}
              onClick={() => setSelectedFeeling('good')}
              disabled={isSubmitting}
              className="h-12 text-lg"
            >
              Pretty Good 👍
            </Button>
            <Button
              variant={selectedFeeling === 'figuring-it-out' ? 'default' : 'outline'}
              onClick={() => setSelectedFeeling('figuring-it-out')}
              disabled={isSubmitting}
              className="h-12 text-lg"
            >
              Figuring it out 🤔
            </Button>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 bg-yellow-100 rounded-full">
                <LightBulbIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-900">Daily Insight</h3>
                <p className="mt-1 text-sm text-yellow-700">{currentTip}</p>
                <button
                  onClick={getNewTip}
                  className="mt-2 text-sm font-medium text-yellow-900 hover:text-yellow-800 transition-colors"
                >
                  Get Another Tip
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFeeling || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Theme configuration
const theme = {
  colors: {
    primary: {
      50: '#f5f3ff',
      // ... purple palette
      600: '#7c3aed',
    },
    accent: {
      // ... complementary colors
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  spacing: {
    // Consistent spacing scale
  },
  borderRadius: {
    card: '1rem',
    button: '0.5rem',
  },
  animation: {
    transition: 'all 0.2s ease-in-out',
  },
};

// Add proper ARIA labels and roles
const GoalCard = ({ goal }: { goal: { title: string } }) => {
  const handleComplete = () => {
    // This is just a stub function
    console.log('Complete goal:', goal.title);
  };
  
  return (
    <div 
      role="article"
      aria-label={`Goal: ${goal.title}`}
      className="goal-card"
    >
      <button
        aria-label={`Complete goal: ${goal.title}`}
        onClick={handleComplete}
      >
        {/* ... */}
      </button>
    </div>
  );
}; 