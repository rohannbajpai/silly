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

const TIME_COMMITMENTS = [
  {
    value: 'light',
    label: 'Light (1-2 hours/week)',
    description: 'Perfect for those with busy schedules who want to learn at their own pace.',
  },
  {
    value: 'moderate',
    label: 'Moderate (3-5 hours/week)',
    description: 'A balanced approach for steady progress.',
  },
  {
    value: 'intensive',
    label: 'Intensive (6+ hours/week)',
    description: 'For those who want to make rapid progress and can dedicate more time.',
  },
];

export default function TimePage() {
  const router = useRouter();
  const {
    timeCommitment,
    setTimeCommitment,
    error,
    currentStep,
    goToNextStep,
    goToPreviousStep,
  } = useOnboardingStore();

  // Redirect to next step if time commitment is already selected
  useEffect(() => {
    if (timeCommitment) {
      router.push('/onboarding/complete');
    }
  }, [timeCommitment, router]);

  const handleNext = () => {
    goToNextStep();
    router.push('/onboarding/complete');
  };

  const handleBack = () => {
    goToPreviousStep();
    router.push('/onboarding/learning');
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">How Much Time Can You Commit?</h1>
          <p className="text-gray-600">
            Select your preferred time commitment to help us create a personalized learning plan.
          </p>
        </div>

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          className="mb-8"
        />

        <ErrorAlert message={error || ''} className="mb-6" />

        <RadioGroup
          value={timeCommitment || ''}
          onValueChange={setTimeCommitment}
          className="grid grid-cols-1 gap-4"
        >
          {TIME_COMMITMENTS.map((commitment) => (
            <Card
              key={commitment.value}
              className={`cursor-pointer transition-all ${
                timeCommitment === commitment.value
                  ? 'border-primary shadow-lg'
                  : 'hover:border-gray-300'
              }`}
              data-testid="time-card"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={commitment.value}
                    id={commitment.value}
                    className="mt-1"
                  />
                  <div>
                    <label
                      htmlFor={commitment.value}
                      className="block text-lg font-medium mb-2 cursor-pointer"
                    >
                      {commitment.label}
                    </label>
                    <p className="text-gray-600">{commitment.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>

        <div className="mt-8 flex justify-between">
          <BackButton onClick={handleBack} />
          <Button
            onClick={handleNext}
            disabled={!timeCommitment}
            className="w-full md:w-auto"
            data-testid="next-button"
          >
            Complete Onboarding
          </Button>
        </div>
      </div>
    </PageTransition>
  );
} 