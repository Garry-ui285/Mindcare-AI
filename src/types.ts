export type MoodType =
  | "Very Happy"
  | "Happy"
  | "Neutral"
  | "Sad"
  | "Stressed"
  | "Anxious"
  | "Angry"
  | "Tired";

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  ageRange?: string;
  wellnessGoals?: string[];
  notifications?: boolean;
  dailyReminderTime?: string;
  dailyGoal?: string;
  createdAt?: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time?: string;
  mood: MoodType;
  energyLevel: number; // 1 - 5
  sleepHours: number; // 0 - 24
  notes?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: MoodType;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  sender: "user" | "assistant";
  text: string;
  createdAt: string;
  isEmergency?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export type ActivityCategory =
  | "Stress Relief"
  | "Better Sleep"
  | "Focus"
  | "Relaxation"
  | "Physical Activity"
  | "Social Connection"
  | "Mindfulness"
  | "Journaling";

export interface SelfCareActivity {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "5 min"
  difficulty: "Easy" | "Moderate" | "Deep";
  category: ActivityCategory;
  instructions: string[];
}

export interface ActivityProgress {
  activityId: string;
  userId: string;
  completed: boolean;
  completedAt?: string;
}

export interface ResourceArticle {
  id: string;
  topic: string;
  title: string;
  summary: string;
  commonSigns: string[];
  copingStrategies: string[];
  whenToSeekHelp: string;
  reliableResources: { title: string; url: string }[];
}

export interface EmergencyContact {
  country: string;
  emergencyNumber: string;
  crisisLine: string;
  crisisWebsite: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
