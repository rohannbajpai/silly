export const SILLY_ACRONYMS = {
  PLAYFUL: {
    title: 'Playful & Quirky',
    acronym: 'Spontaneous Imagination Lights Life, Yay!',
  },
  FRIENDLY: {
    title: 'Friendly & Wise',
    acronym: 'Sharing Insights Lifts Lives Yearly',
  },
  MOTIVATIONAL: {
    title: 'Motivational & Energetic',
    acronym: 'Success Is Living Life Youthfully',
  },
  REFLECTIVE: {
    title: 'Reflective & Calm',
    acronym: 'Serenity In Life Leads You',
  },
} as const;

export const FOCUS_AREAS = [
  'habits',
  'mindset',
  'productivity',
  'creativity',
  'wellness',
  'relationships',
  'learning',
  'journaling',
] as const;

export const LEARNING_STYLES = [
  { value: 'daily', label: 'Daily Micro-Learning' },
  { value: 'courses', label: 'Structured Courses' },
  { value: 'articles', label: 'Reading Articles' },
  { value: 'prompts', label: 'Reflection Prompts' },
] as const;

export const CHECK_IN_FREQUENCIES = [
  { value: 'daily', label: 'Daily Check-ins' },
  { value: '3x_week', label: '3 Times a Week' },
  { value: 'on_demand', label: 'On-Demand Only' },
] as const;

export const BLOBBY_STATES = {
  IDLE: 'idle',
  FOCUSED: 'focused',
  SILLY: 'silly',
  SUPPORTIVE: 'supportive',
  CELEBRATING: 'celebrating',
  THINKING: 'thinking',
  SLEEPING: 'sleeping',
} as const;

export const BLOBBY_ACCESSORIES = {
  HATS: [
    { id: 'hat_basic', name: 'Basic Cap', unlockCondition: 'default' },
    { id: 'hat_graduation', name: 'Graduation Cap', unlockCondition: '5_tasks_completed' },
    { id: 'hat_party', name: 'Party Hat', unlockCondition: '7_day_streak' },
  ],
  GLASSES: [
    { id: 'glasses_nerd', name: 'Nerd Glasses', unlockCondition: 'default' },
    { id: 'glasses_sun', name: 'Sunglasses', unlockCondition: '3_day_streak' },
    { id: 'glasses_3d', name: '3D Glasses', unlockCondition: '10_tasks_completed' },
  ],
} as const; 