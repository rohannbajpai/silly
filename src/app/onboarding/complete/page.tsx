'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ErrorAlert } from '@/components/ui/error-alert';
import { PageTransition } from '@/components/ui/page-transition';
import { useOnboardingStore } from '@/lib/store';
import { FOCUS_AREAS } from '@/lib/constants';

const LEARNING_STYLE_LABELS: Record<string, string> = {
  visual: 'Visual Learner',
  auditory: 'Auditory Learner',
  reading: 'Reading/Writing Learner',
  kinesthetic: 'Kinesthetic Learner',
};

const TIME_COMMITMENT_LABELS: Record<string, string> = {
  casual: 'Casual (1-2 hours/week)',
  moderate: 'Moderate (3-5 hours/week)',
  intensive: 'Intensive (6+ hours/week)',
};

export default function CompletePage() {
  const router = useRouter();
  const {
    vibe,
    focusAreas,
    learningStyle,
    timeCommitment,
    isLoading,
    error,
    completeOnboarding,
  } = useOnboardingStore();

  useEffect(() => {
    // Redirect to dashboard if onboarding is already completed
    if (!vibe || !focusAreas.length || !learningStyle || !timeCommitment) {
      router.push('/onboarding');
    }
  }, [vibe, focusAreas, learningStyle, timeCommitment, router]);

  const handleComplete = async () => {
    await completeOnboarding();
    router.push('/dashboard');
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">You're All Set!</h1>
          <p className="text-gray-600">
            Here's a summary of your preferences. We'll use these to personalize your experience.
          </p>
        </div>

        <ErrorAlert message={error || ''} className="mb-6" />

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-2">Your Vibe</h2>
              <p className="text-gray-600 capitalize">{vibe}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-2">Focus Areas</h2>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-2">Learning Style</h2>
              <p className="text-gray-600">
                {learningStyle ? LEARNING_STYLE_LABELS[learningStyle] : 'Not selected'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-2">Time Commitment</h2>
              <p className="text-gray-600">
                {timeCommitment ? TIME_COMMITMENT_LABELS[timeCommitment] : 'Not selected'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? <Loading /> : 'Get Started'}
          </Button>
        </div>
      </div>
    </PageTransition>
  );
} 