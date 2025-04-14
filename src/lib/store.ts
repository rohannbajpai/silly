import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  vibe: string | null;
  focusAreas: string[];
  learningStyle: string | null;
  timeCommitment: string | null;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  setVibe: (vibe: string) => void;
  setFocusAreas: (areas: string[]) => void;
  setLearningStyle: (style: string) => void;
  setTimeCommitment: (commitment: string) => void;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  completeOnboarding: () => Promise<void>;
  reset: () => void;
}

const TOTAL_STEPS = 4;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      vibe: null,
      focusAreas: [],
      learningStyle: null,
      timeCommitment: null,
      isCompleted: false,
      isLoading: false,
      error: null,
      currentStep: 1,
      setVibe: (vibe) => set({ vibe, error: null }),
      setFocusAreas: (areas) => {
        // Validate focus areas
        const validAreas = ['habits', 'mindset', 'productivity', 'relationships', 'health', 'career'];
        const invalidAreas = areas.filter((area) => !validAreas.includes(area));
        if (invalidAreas.length > 0) {
          set({ error: `Invalid focus areas: ${invalidAreas.join(', ')}` });
          return;
        }
        set({ focusAreas: areas, error: null });
      },
      setLearningStyle: (style) => {
        const validStyles = ['visual', 'auditory', 'reading', 'kinesthetic'];
        if (!validStyles.includes(style)) {
          set({ error: 'Invalid learning style' });
          return;
        }
        set({ learningStyle: style, error: null });
      },
      setTimeCommitment: (commitment) => {
        const validCommitments = ['casual', 'moderate', 'intensive'];
        if (!validCommitments.includes(commitment)) {
          set({ error: 'Invalid time commitment' });
          return;
        }
        set({ timeCommitment: commitment, error: null });
      },
      setCurrentStep: (step) => {
        if (step >= 1 && step <= TOTAL_STEPS) {
          set({ currentStep: step });
        }
      },
      goToNextStep: () => {
        const { currentStep } = get();
        if (currentStep < TOTAL_STEPS) {
          set({ currentStep: currentStep + 1 });
        }
      },
      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      completeOnboarding: async () => {
        const { vibe, focusAreas, learningStyle, timeCommitment } = get();
        set({ isLoading: true, error: null });

        try {
          // Update onboarding data in the backend
          const response = await fetch('/api/user/onboarding', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              vibe,
              focusAreas,
              learningStyle,
              timeCommitment,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to complete onboarding');
          }

          set({ isCompleted: true, isLoading: false });
        } catch (error) {
          console.error('Error completing onboarding:', error);
          set({
            error: 'Failed to complete onboarding. Please try again.',
            isLoading: false,
          });
        }
      },
      reset: () => {
        set({
          vibe: null,
          focusAreas: [],
          learningStyle: null,
          timeCommitment: null,
          isCompleted: false,
          error: null,
          currentStep: 1,
        });
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
); 