'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ErrorAlert } from '@/components/ui/error-alert';
import { PageTransition } from '@/components/ui/page-transition';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { BackButton } from '@/components/ui/back-button';
import { useOnboardingStore } from '@/lib/store';

const LEARNING_STYLES = [
  {
    value: 'visual',
    label: 'Visual Learner',
    description: 'I learn best through images, diagrams, and visual aids.',
  },
  {
    value: 'auditory',
    label: 'Auditory Learner',
    description: 'I learn best through listening and verbal explanations.',
  },
  {
    value: 'reading',
    label: 'Reading/Writing Learner',
    description: 'I learn best through reading and writing activities.',
  },
  {
    value: 'kinesthetic',
    label: 'Kinesthetic Learner',
    description: 'I learn best through hands-on activities and movement.',
  },
];

export default function LearningPage() {
  const router = useRouter();
  const {
    learningStyle,
    setLearningStyle,
    error,
    currentStep,
    goToNextStep,
    goToPreviousStep,
  } = useOnboardingStore();

  // Redirect to next step if learning style is already selected
  useEffect(() => {
    if (learningStyle) {
      router.push('/onboarding/time');
    }
  }, [learningStyle, router]);

  const handleNext = () => {
    if (learningStyle) {
      goToNextStep();
      router.push('/onboarding/time');
    }
  };

  const handleBack = () => {
    goToPreviousStep();
    router.push('/onboarding/focus');
  };

  // Add a loading state to prevent premature rendering
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">How Do You Learn Best?</h1>
          <p className="text-gray-600">
            Select your preferred learning style to help us personalize your experience.
          </p>
        </div>

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          className="mb-8"
        />

        {error && (
          <ErrorAlert message={error} className="mb-6" data-testid="error-alert" />
        )}

        <RadioGroup
          value={learningStyle || ''}
          onValueChange={(value) => {
            setLearningStyle(value);
          }}
          className="grid grid-cols-1 gap-4"
        >
          {LEARNING_STYLES.map((style) => (
            <Card
              key={style.value}
              className={`cursor-pointer transition-all ${
                learningStyle === style.value
                  ? 'border-primary shadow-lg'
                  : 'hover:border-gray-300'
              }`}
              data-testid="learning-card"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={style.value}
                    id={style.value}
                    className="mt-1"
                  />
                  <div>
                    <label
                      htmlFor={style.value}
                      className="block text-lg font-medium mb-2 cursor-pointer"
                    >
                      {style.label}
                    </label>
                    <p className="text-gray-600">{style.description}</p>
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
            disabled={!learningStyle}
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