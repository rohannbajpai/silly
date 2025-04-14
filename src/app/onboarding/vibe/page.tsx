'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ErrorAlert } from '@/components/ui/error-alert';
import { PageTransition } from '@/components/ui/page-transition';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { BackButton } from '@/components/ui/back-button';
import { useOnboardingStore } from '@/lib/store';

const VIBES = [
  {
    value: 'casual',
    label: 'Casual',
    description: 'Take it easy and enjoy the journey at your own pace.',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Find a healthy balance between growth and relaxation.',
  },
  {
    value: 'intense',
    label: 'Intense',
    description: 'Push yourself to achieve rapid growth and transformation.',
  },
];

export default function VibePage() {
  const router = useRouter();
  const { vibe, setVibe, error, currentStep, goToNextStep } = useOnboardingStore();

  // Redirect to next step if vibe is already selected
  useEffect(() => {
    if (vibe) {
      router.push('/onboarding/focus');
    }
  }, [vibe, router]);

  const handleNext = () => {
    goToNextStep();
    router.push('/onboarding/focus');
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Choose Your Vibe</h1>
          <p className="text-gray-600">
            Select the energy level that best matches your self-improvement journey.
          </p>
        </div>

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          className="mb-8"
        />

        <ErrorAlert message={error || ''} className="mb-6" />

        <RadioGroup
          value={vibe || ''}
          onValueChange={setVibe}
          className="grid grid-cols-1 gap-4"
        >
          {VIBES.map((vibeOption) => (
            <Card
              key={vibeOption.value}
              className={`cursor-pointer transition-all ${
                vibe === vibeOption.value
                  ? 'border-primary shadow-lg'
                  : 'hover:border-gray-300'
              }`}
              data-testid="vibe-card"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={vibeOption.value}
                    id={vibeOption.value}
                    className="mt-1"
                  />
                  <div>
                    <label
                      htmlFor={vibeOption.value}
                      className="block text-lg font-medium mb-2 cursor-pointer"
                    >
                      {vibeOption.label}
                    </label>
                    <p className="text-gray-600">{vibeOption.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>

        <div className="mt-8 flex justify-between">
          <BackButton onClick={() => router.push('/onboarding')} />
          <Button
            onClick={handleNext}
            disabled={!vibe}
            className="w-full md:w-auto"
            data-testid="next-button"
          >
            Next Step
          </Button>
        </div>
      </div>
    </PageTransition>
  );
} 