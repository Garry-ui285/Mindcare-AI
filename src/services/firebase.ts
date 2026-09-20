import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  UserProfile,
  MoodEntry,
  JournalEntry,
  ChatMessage,
  ChatSession,
  ActivityProgress,
} from "../types";

// Check if Firebase environment variables are provided
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey.length > 5
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firebase initialization skipped or failed; using local wellness storage:", err);
  }
}

export { auth, db };

// Local storage keys for resilient local store
const LOCAL_STORAGE_KEYS = {
  USERS: "mindcare_users",
  CURRENT_USER: "mindcare_current_user",
  MOODS: "mindcare_moods_",
  JOURNALS: "mindcare_journals_",
  CHATS: "mindcare_chats_",
  ACTIVITIES: "mindcare_activities_",
  SETTINGS: "mindcare_settings_",
};

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  ageRange?: string;
  wellnessGoals?: string[];
  notifications?: boolean;
  dailyReminderTime?: string;
  dailyGoal?: string;
  createdAt?: string;
}

// Simulated delay helper for realistic SaaS feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- AUTH SERVICES ---

export async function registerUser(name: string, email: string, pass: string): Promise<AppUser> {
  if (isFirebaseConfigured && auth && db) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateFirebaseProfile(cred.user, { displayName: name });
    const profile: AppUser = {
      uid: cred.user.uid,
      name: name || cred.user.displayName || "Friend",
      email: cred.user.email || email,
      ageRange: "18-24",
      wellnessGoals: ["Manage Daily Stress", "Better Sleep Habits"],
      notifications: true,
      dailyReminderTime: "09:00",
      dailyGoal: "Take 5 mindful minutes for myself",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", cred.user.uid), profile);
    return profile;
  }

  // Local Storage Mock implementation
  await delay(250);
  const usersJson = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  const users: AppUser[] = usersJson ? JSON.parse(usersJson) : [];
  
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: AppUser = {
    uid: "user_" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    ageRange: "18-24",
    wellnessGoals: ["Manage Daily Stress", "Better Sleep Habits"],
    notifications: true,
    dailyReminderTime: "09:00",
    dailyGoal: "Take 5 mindful minutes for myself",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

  // Seed with initial welcoming demo mood & journal entry if empty
  seedInitialUserData(newUser.uid);
  return newUser;
}

export async function loginUser(email: string, pass: string): Promise<AppUser> {
  if (isFirebaseConfigured && auth && db) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      return snap.data() as AppUser;
    }
    const profile: AppUser = {
      uid: cred.user.uid,
      name: cred.user.displayName || "Friend",
      email: cred.user.email || email,
      createdAt: new Date().toISOString(),
    };
    return profile;
  }

  // Local Storage Mock
  await delay(250);
  const usersJson = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  const users: AppUser[] = usersJson ? JSON.parse(usersJson) : [];
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    // If not found, allow quick demo onboarding for the user
    const newUser: AppUser = {
      uid: "user_" + Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0],
      email,
      ageRange: "18-24",
      wellnessGoals: ["Mindful Breathing", "Stress Reduction"],
      notifications: true,
      dailyReminderTime: "09:00",
      dailyGoal: "Practice 5 minutes of mindful reflection",
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    seedInitialUserData(newUser.uid);
    return newUser;
  }

  localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
  return found;
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUserSync(): AppUser | null {
  const current = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  return current ? JSON.parse(current) : null;
}

export async function updateUserProfile(userId: string, updates: Partial<AppUser>): Promise<AppUser> {
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, "users", userId), updates);
  }

  const current = getCurrentUserSync();
  const updated = { ...(current || { uid: userId, email: "", name: "" }), ...updates };
  localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));

  // Update in users collection
  const usersJson = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  if (usersJson) {
    const users: AppUser[] = JSON.parse(usersJson);
    const idx = users.findIndex((u) => u.uid === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  return updated;
}

export async function deleteUserData(userId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, "users", userId));
  }
  // Clear local storage entries for this user
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.MOODS + userId);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.JOURNALS + userId);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CHATS + userId);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVITIES + userId);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.SETTINGS + userId);

  const usersJson = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  if (usersJson) {
    const users: AppUser[] = JSON.parse(usersJson);
    const filtered = users.filter((u) => u.uid !== userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(filtered));
  }
}

// Seed initial pleasant demo data so college demo or initial evaluation looks great
function seedInitialUserData(userId: string) {
  const moodKey = LOCAL_STORAGE_KEYS.MOODS + userId;
  if (!localStorage.getItem(moodKey)) {
    const today = new Date();
    const mockMoods: MoodEntry[] = [
      {
        id: "m-1",
        userId,
        date: new Date(today.getTime() - 86400000 * 4).toISOString().split("T")[0],
        mood: "Happy",
        energyLevel: 4,
        sleepHours: 7.5,
        notes: "Enjoyed morning sunshine and completed study sprint.",
        createdAt: new Date(today.getTime() - 86400000 * 4).toISOString(),
      },
      {
        id: "m-2",
        userId,
        date: new Date(today.getTime() - 86400000 * 3).toISOString().split("T")[0],
        mood: "Neutral",
        energyLevel: 3,
        sleepHours: 6.5,
        notes: "Busy lecture day, felt a little tired in afternoon.",
        createdAt: new Date(today.getTime() - 86400000 * 3).toISOString(),
      },
      {
        id: "m-3",
        userId,
        date: new Date(today.getTime() - 86400000 * 2).toISOString().split("T")[0],
        mood: "Stressed",
        energyLevel: 3,
        sleepHours: 6,
        notes: "Project deadline approaching, practiced box breathing.",
        createdAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
      },
      {
        id: "m-4",
        userId,
        date: new Date(today.getTime() - 86400000 * 1).toISOString().split("T")[0],
        mood: "Happy",
        energyLevel: 4,
        sleepHours: 8,
        notes: "Took a walk with a classmate and felt much lighter.",
        createdAt: new Date(today.getTime() - 86400000 * 1).toISOString(),
      },
      {
        id: "m-5",
        userId,
        date: today.toISOString().split("T")[0],
        mood: "Very Happy",
        energyLevel: 5,
        sleepHours: 8,
        notes: "Starting the day with clarity and positive intention.",
        createdAt: today.toISOString(),
      },
    ];
    localStorage.setItem(moodKey, JSON.stringify(mockMoods));
  }

  const journalKey = LOCAL_STORAGE_KEYS.JOURNALS + userId;
  if (!localStorage.getItem(journalKey)) {
    const mockJournals: JournalEntry[] = [
      {
        id: "j-1",
        userId,
        title: "Finding Calm in Busy Weeks",
        content:
          "Today was quite full with coursework and deliverables. I noticed that when I stepped outside for just 10 minutes without my phone, my racing thoughts slowed right down. Reminding myself that doing my best each day is more than enough.",
        mood: "Happy",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "j-2",
        userId,
        title: "Gratitude for Quiet Mornings",
        content:
          "Woke up before my alarm today and made a hot cup of peppermint tea. Savoring the quiet stillness before opening emails. When I give myself an unhurried morning, the entire rest of the day feels significantly more manageable.",
        mood: "Very Happy",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(journalKey, JSON.stringify(mockJournals));
  }

  const actKey = LOCAL_STORAGE_KEYS.ACTIVITIES + userId;
  if (!localStorage.getItem(actKey)) {
    const mockActivities: ActivityProgress[] = [
      { activityId: "act-1", userId, completed: true, completedAt: new Date().toISOString() },
      { activityId: "act-6", userId, completed: true, completedAt: new Date().toISOString() },
    ];
    localStorage.setItem(actKey, JSON.stringify(mockActivities));
  }
}

// --- MOOD TRACKER SERVICES ---

export async function getMoodEntries(userId: string): Promise<MoodEntry[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "users", userId, "moodEntries"));
      const list: MoodEntry[] = [];
      snap.forEach((d) => list.push({ ...(d.data() as MoodEntry), id: d.id }));
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.warn("Firestore mood fetch error, reading local cache:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.MOODS + userId;
  const data = localStorage.getItem(key);
  const list: MoodEntry[] = data ? JSON.parse(data) : [];
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveMoodEntry(userId: string, entry: Omit<MoodEntry, "id">): Promise<MoodEntry> {
  const newEntry: MoodEntry = {
    ...entry,
    id: "mood_" + Date.now(),
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "users", userId, "moodEntries", newEntry.id), newEntry);
    } catch (e) {
      console.warn("Firestore mood save error, saving locally:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.MOODS + userId;
  const current = await getMoodEntries(userId);
  // Replace if same date or prepend
  const filtered = current.filter((m) => m.date !== entry.date);
  const updated = [newEntry, ...filtered];
  localStorage.setItem(key, JSON.stringify(updated));
  return newEntry;
}

export async function deleteMoodEntry(userId: string, entryId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "users", userId, "moodEntries", entryId));
    } catch (e) {
      console.warn("Firestore mood delete error:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.MOODS + userId;
  const current = await getMoodEntries(userId);
  const updated = current.filter((m) => m.id !== entryId);
  localStorage.setItem(key, JSON.stringify(updated));
}

// --- JOURNAL SERVICES ---

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "users", userId, "journalEntries"));
      const list: JournalEntry[] = [];
      snap.forEach((d) => list.push({ ...(d.data() as JournalEntry), id: d.id }));
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.warn("Firestore journal fetch error, reading local cache:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.JOURNALS + userId;
  const data = localStorage.getItem(key);
  const list: JournalEntry[] = data ? JSON.parse(data) : [];
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveJournalEntry(
  userId: string,
  entry: Omit<JournalEntry, "id" | "createdAt"> & { id?: string }
): Promise<JournalEntry> {
  const isUpdate = Boolean(entry.id);
  const finalId = entry.id || "journal_" + Date.now();
  const now = new Date().toISOString();

  const journalItem: JournalEntry = {
    id: finalId,
    userId,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    createdAt: isUpdate ? (entry as any).createdAt || now : now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "users", userId, "journalEntries", finalId), journalItem);
    } catch (e) {
      console.warn("Firestore journal save error:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.JOURNALS + userId;
  const current = await getJournalEntries(userId);
  const filtered = current.filter((j) => j.id !== finalId);
  const updated = [journalItem, ...filtered];
  localStorage.setItem(key, JSON.stringify(updated));
  return journalItem;
}

export async function deleteJournalEntry(userId: string, entryId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "users", userId, "journalEntries", entryId));
    } catch (e) {
      console.warn("Firestore journal delete error:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.JOURNALS + userId;
  const current = await getJournalEntries(userId);
  const updated = current.filter((j) => j.id !== entryId);
  localStorage.setItem(key, JSON.stringify(updated));
}

// --- ACTIVITY PROGRESS SERVICES ---

export async function getActivityProgress(userId: string): Promise<Record<string, boolean>> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "users", userId, "activityProgress"));
      const map: Record<string, boolean> = {};
      snap.forEach((d) => {
        map[d.id] = d.data().completed === true;
      });
      return map;
    } catch (e) {
      console.warn("Firestore activity fetch error:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.ACTIVITIES + userId;
  const data = localStorage.getItem(key);
  const list: ActivityProgress[] = data ? JSON.parse(data) : [];
  const map: Record<string, boolean> = {};
  list.forEach((item) => {
    map[item.activityId] = item.completed;
  });
  return map;
}

export async function toggleActivityProgress(
  userId: string,
  activityId: string,
  completed: boolean
): Promise<void> {
  const item: ActivityProgress = {
    activityId,
    userId,
    completed,
    completedAt: completed ? new Date().toISOString() : undefined,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "users", userId, "activityProgress", activityId), item);
    } catch (e) {
      console.warn("Firestore activity toggle error:", e);
    }
  }

  const key = LOCAL_STORAGE_KEYS.ACTIVITIES + userId;
  const data = localStorage.getItem(key);
  let list: ActivityProgress[] = data ? JSON.parse(data) : [];
  list = list.filter((a) => a.activityId !== activityId);
  list.push(item);
  localStorage.setItem(key, JSON.stringify(list));
}

// --- CHAT SESSION SERVICES ---

export async function getChatMessages(userId: string, sessionId: string): Promise<ChatMessage[]> {
  const key = LOCAL_STORAGE_KEYS.CHATS + `${userId}_${sessionId}`;
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  // Default welcoming assistant message
  const initialMessages: ChatMessage[] = [
    {
      id: "msg-welcome",
      sessionId,
      userId,
      sender: "assistant",
      text: "Hello, and welcome to your safe space. I'm MindCare AI, here to listen, offer gentle wellness suggestions, or simply walk through breathing exercises with you. How are you feeling in this moment?",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(key, JSON.stringify(initialMessages));
  return initialMessages;
}

export async function saveChatMessage(userId: string, sessionId: string, message: ChatMessage): Promise<void> {
  const key = LOCAL_STORAGE_KEYS.CHATS + `${userId}_${sessionId}`;
  const current = await getChatMessages(userId, sessionId);
  const updated = [...current, message];
  localStorage.setItem(key, JSON.stringify(updated));

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(
        doc(db, "users", userId, "chatSessions", sessionId, "messages", message.id),
        message
      );
    } catch (e) {
      console.warn("Firestore chat save error:", e);
    }
  }
}

export async function clearChatMessages(userId: string, sessionId: string): Promise<void> {
  const key = LOCAL_STORAGE_KEYS.CHATS + `${userId}_${sessionId}`;
  const initialMessages: ChatMessage[] = [
    {
      id: "msg-welcome-" + Date.now(),
      sessionId,
      userId,
      sender: "assistant",
      text: "I've cleared our chat history. We can start fresh whenever you're ready. What's on your mind today?",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(key, JSON.stringify(initialMessages));
}
