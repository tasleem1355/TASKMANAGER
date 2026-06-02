export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  status: "pending" | "completed";
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface AchievementHistoryEntry {
  id: string;
  unlockedAt: string;
}
