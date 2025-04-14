'use client';

import { usePathname } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

const ONBOARDING_STEPS = [
  { path: '/onboarding/vibe', label: 'Your Vibe' },
  { path: '/onboarding/focus', label: 'Focus Areas' },
  { path: '/onboarding/learning', label: 'Learning Style' },
  { path: '/onboarding/checkin', label: 'Check-in Preferences' },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = ONBOARDING_STEPS.findIndex(step => pathname === step.path);
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-2xl font-bold">SILLY.com</h1>
        </div>
        <div className="container mx-auto px-4 py-2">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {ONBOARDING_STEPS.map((step, index) => (
              <div
                key={step.path}
                className={`${
                  index <= currentStepIndex ? 'text-primary' : ''
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 