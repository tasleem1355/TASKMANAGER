import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { toast } from "sonner";
import { Achievement, AchievementHistoryEntry, Task, Student } from "@/types";

interface AppContextType {
  user: Student | null;
  tasks: Task[];
  achievements: Achievement[];
  achievementHistory: AchievementHistoryEntry[];
  latestUnlockedBadge: Achievement | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  loginWithOAuth: (user: { id: string; name: string; email: string }) => void;
  logout: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAMPLE_TASKS: Task[] = [
  { id: "1", title: "Complete Math Assignment", description: "Solve chapter 5 exercises", subject: "Mathematics", priority: "high", dueDate: new Date().toISOString().split("T")[0], status: "pending", createdAt: new Date().toISOString() },
  { id: "2", title: "Read History Chapter", description: "Read and summarize chapter 8", subject: "History", priority: "medium", dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], status: "completed", createdAt: new Date().toISOString() },
  { id: "3", title: "Science Lab Report", description: "Write up the lab experiment results", subject: "Science", priority: "high", dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0], status: "pending", createdAt: new Date().toISOString() },
  { id: "4", title: "English Essay Draft", description: "First draft of persuasive essay", subject: "English", priority: "low", dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], status: "pending", createdAt: new Date().toISOString() },
  { id: "5", title: "Programming Project", description: "Build the calculator app", subject: "Computer Science", priority: "medium", dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0], status: "completed", createdAt: new Date().toISOString() },
];

const ACHIEVEMENT_TEMPLATES: Omit<Achievement, "unlockedAt">[] = [
  {
    id: "first-complete",
    title: "First Completed Task",
    description: "Complete your first task to unlock this badge.",
    icon: "🏅",
  },
  {
    id: "task-master",
    title: "Task Master",
    description: "Complete 5 tasks and keep the momentum going.",
    icon: "💪",
  },
  {
    id: "all-clear",
    title: "All Clear",
    description: "Finish every task in your list with no pending items.",
    icon: "✅",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Complete a task due today before the day ends.",
    icon: "🌅",
  },
  {
    id: "diverse-learner",
    title: "Diverse Learner",
    description: "Complete tasks across 3 different subjects.",
    icon: "🎓",
  },
];

function computeAchievementHistory(tasks: Task[], existingHistory: AchievementHistoryEntry[]) {
  const completedTasks = tasks.filter(task => task.status === "completed");
  const completedCount = completedTasks.length;
  const completedSubjects = new Set(completedTasks.map(task => task.subject)).size;
  const today = new Date().toISOString().split("T")[0];
  const hasTodayComplete = completedTasks.some(task => task.dueDate === today);
  const allClear = tasks.length > 0 && tasks.every(task => task.status === "completed");

  const earnedIds = new Set(existingHistory.map(entry => entry.id));
  const newHistory = [...existingHistory];
  const now = new Date().toISOString();

  const unlock = (id: string, condition: boolean) => {
    if (condition && !earnedIds.has(id)) {
      earnedIds.add(id);
      newHistory.push({ id, unlockedAt: now });
      const badge = ACHIEVEMENT_TEMPLATES.find(item => item.id === id);
      if (badge) {
        toast.success(`Achievement unlocked: ${badge.title}`);
      }
    }
  };

  unlock("first-complete", completedCount >= 1);
  unlock("task-master", completedCount >= 5);
  unlock("all-clear", allClear);
  unlock("early-bird", hasTodayComplete);
  unlock("diverse-learner", completedSubjects >= 3);

  return newHistory;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : SAMPLE_TASKS;
  });

  const [achievementHistory, setAchievementHistory] = useState<AchievementHistoryEntry[]>(() => {
    const saved = localStorage.getItem("achievementHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [latestUnlockedBadge, setLatestUnlockedBadge] = useState<Achievement | null>(null);
  const previousHistoryLength = useRef(achievementHistory.length);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    const updatedHistory = computeAchievementHistory(tasks, achievementHistory);
    if (updatedHistory.length !== achievementHistory.length) {
      setAchievementHistory(updatedHistory);
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("achievementHistory", JSON.stringify(achievementHistory));
  }, [achievementHistory]);

  useEffect(() => {
    if (achievementHistory.length > previousHistoryLength.current) {
      const lastEntry = achievementHistory[achievementHistory.length - 1];
      const unlockedBadge = ACHIEVEMENT_TEMPLATES.find(item => item.id === lastEntry.id);
      if (unlockedBadge) {
        setLatestUnlockedBadge({ ...unlockedBadge, unlockedAt: lastEntry.unlockedAt });
      }
      previousHistoryLength.current = achievementHistory.length;
    }
  }, [achievementHistory]);

  useEffect(() => {
    if (!latestUnlockedBadge) return;
    const timer = window.setTimeout(() => setLatestUnlockedBadge(null), 6000);
    return () => window.clearTimeout(timer);
  }, [latestUnlockedBadge]);

  const achievements: Achievement[] = ACHIEVEMENT_TEMPLATES.map(template => {
    const historyEntry = achievementHistory.find(entry => entry.id === template.id);
    return { ...template, unlockedAt: historyEntry?.unlockedAt };
  });

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      setUser({ id: found.id, name: found.name, email: found.email });
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser({ id: newUser.id, name, email });
    return true;
  };

  const logout = () => setUser(null);

  const loginWithOAuth = (userObj: { id: string; name: string; email: string }) => {
    setUser({ id: userObj.id, name: userObj.name, email: userObj.email });
  };

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    setTasks(prev => [...prev, { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t));
  };

  return (
    <AppContext.Provider value={{ user, tasks, achievements, achievementHistory, latestUnlockedBadge, login, register, loginWithOAuth, logout, addTask, updateTask, deleteTask, toggleTaskStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
