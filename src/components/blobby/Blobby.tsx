'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BLOBBY_STATES } from '@/lib/constants';
import { useBlobbyStore } from '@/lib/store/blobby';

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => (
    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
      <span className="text-gray-500">Loading Lottie...</span>
    </div>
  ),
});

type BlobbyProps = {
  initialState?: keyof typeof BLOBBY_STATES;
  accessories?: {
    hat: string | null;
    glasses: string | null;
  };
  onInteract?: () => void;
};

export default function Blobby({
  initialState = 'IDLE',
  accessories = { hat: null, glasses: null },
  onInteract,
}: BlobbyProps) {
  const [currentState, setCurrentState] = useState<keyof typeof BLOBBY_STATES>(initialState);
  const [animationData, setAnimationData] = useState(null);
  const { status, duration } = useBlobbyStore();

  useEffect(() => {
    if (status) {
      console.log('Blobby state changed:', { currentState, status });
      setCurrentState(status as keyof typeof BLOBBY_STATES);
    }
  }, [status]);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Map the state to the correct animation file
        const stateToAnimation = {
          IDLE: 'blobby_idle.json',
          CELEBRATING: 'blobby_excited.json',
          THINKING: 'blobby_idle.json',
          SUPPORTIVE: 'blobby_happy.json',
          SLEEPING: 'blobby_sleeping.json',
          FOCUSED: 'blobby_idle.json',
          SILLY: 'blobby_excited.json',
        };

        const animationFile = stateToAnimation[currentState] || 'blobby_idle.json';
        console.log('Loading animation for state:', currentState, 'file:', animationFile);

        const response = await fetch(`/lottie/${animationFile}`);
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${animationFile}`);
        }
        const data = await response.json();
        
        // Add fill color to the animation data
        if (data.layers?.[0]?.shapes?.[0]?.it) {
          data.layers[0].shapes[0].it.push({
            ty: "fl",
            c: { a: 0, k: [0.8, 0.6, 1, 1] }, // Purple color
            o: { a: 0, k: 100 },
            r: 1,
            nm: "Fill"
          });
        }
        
        console.log('Animation data loaded:', data);
        setAnimationData(data);
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    loadAnimation();
  }, [currentState]);

  const handleClick = () => {
    if (onInteract) {
      onInteract();
    }
  };

  if (!animationData) {
    return (
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-gray-500">Loading animation...</span>
      </div>
    );
  }

  return (
    <div
      className="relative cursor-pointer w-32 h-32 flex items-center justify-center"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ width: '100%', height: '100%' }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
          }}
        />
      </div>
      {/* Debug overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
        State: {currentState}
      </div>
    </div>
  );
} 