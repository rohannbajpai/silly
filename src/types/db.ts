import { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  vibe: 'quirky' | 'friendly' | 'motivational' | 'reflective';
  focusAreas: string[];
  learningStyle: string;
  checkInFrequency: 'daily' | '3x_week' | 'on_demand';
  surpriseChallenges: boolean;
  derivedPersona: string;
  sillyAcronym: string;
};

export type BlobbyState = {
  unlockedAccessories: string[];
  currentOutfit: {
    hat: string | null;
    glasses: string | null;
  };
};

export type UserStats = {
  streakDays: number;
  xpTotal: number;
  goalsCompleted: number;
};

export type UserDocument = {
  email: string;
  createdAt: Timestamp;
  onboardingCompleted: boolean;
  profile: UserProfile;
  blobby: BlobbyState;
  stats: UserStats;
};

export type Goal = {
  id: string;
  userId: string;
  text: string;
  createdAt: Timestamp;
  isCompleted: boolean;
  completedAt: Timestamp | null;
  dueDate: Timestamp | null;
  source: 'user_created' | 'suggested_daily';
  completionFeeling?: 'amazing' | 'good' | 'figuring-it-out';
}; 