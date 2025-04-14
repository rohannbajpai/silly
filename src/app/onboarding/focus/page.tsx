'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorAlert } from '@/components/ui/error-alert';
import { PageTransition } from '@/components/ui/page-transition';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { BackButton } from '@/components/ui/back-button';
import { FOCUS_AREAS } from '@/lib/constants';
import { useOnboardingStore } from '@/lib/store';

export default function FocusPage() {
  const router = useRouter();
  const {
    focusAreas,
    setFocusAreas,
    error,
    currentStep,
    goToNextStep,
    goToPreviousStep,
  } = useOnboardingStore();

  // Redirect to next step if focus areas are already selected
  useEffect(() => {
    if (focusAreas.length > 0) {
      router.push('/onboarding/learning');
    }
  }, [focusAreas, router]);

  const handleNext = () => {
    goToNextStep();
    router.push('/onboarding/learning');
  };

  const handleBack = () => {
    goToPreviousStep();
    router.push('/onboarding/vibe');
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas(
      focusAreas.includes(area)
        ? focusAreas.filter((a) => a !== area)
        : [...focusAreas, area]
    );
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Choose Your Focus Areas</h1>
          <p className="text-gray-600">
            Select the areas you want to focus on in your self-improvement journey. You can choose multiple areas.
          </p>
        </div>

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          className="mb-8"
        />

        <ErrorAlert message={error || ''} className="mb-6" data-testid="error-alert" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOCUS_AREAS.map((area) => (
            <Card
              key={area}
              className={`cursor-pointer transition-all ${
                focusAreas.includes(area)
                  ? 'border-primary shadow-lg'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => toggleFocusArea(area)}
              data-testid="focus-card"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={area}
                    checked={focusAreas.includes(area)}
                    onCheckedChange={() => toggleFocusArea(area)}
                    className="mt-1"
                  />
                  <div>
                    <label
                      htmlFor={area}
                      className="block text-lg font-medium mb-2 cursor-pointer capitalize"
                    >
                      {area}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <BackButton onClick={handleBack} />
          <Button
            onClick={handleNext}
            disabled={focusAreas.length === 0}
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