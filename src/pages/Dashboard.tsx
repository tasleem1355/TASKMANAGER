import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Clock, AlertTriangle, ListTodo } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, tasks, achievements, achievementHistory, latestUnlockedBadge } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const today = new Date().toISOString().split("T")[0];
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const dueToday = tasks.filter(t => t.dueDate === today && t.status === "pending").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: total, icon: ListTodo, color: "text-primary" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-accent" },
    { label: "Pending", value: pending, icon: Clock, color: "text-warning" },
    { label: "Due Today", value: dueToday, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl">Welcome, {user.name}</h1>
        <p className="mt-1 text-muted-foreground">Here's your task overview</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-body text-lg font-semibold">Overall Progress</h2>
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="mt-2 text-sm text-muted-foreground">
          {completed} of {total} tasks completed
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-body text-lg font-semibold">Achievements</h2>
              <p className="text-sm text-muted-foreground">Earned badges are stored automatically.</p>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {achievements.filter((badge) => badge.unlockedAt).length} earned
            </span>
          </div>

          {latestUnlockedBadge && (
            <div className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-lg shadow-emerald-200/50 transition duration-300 ease-out animate-pulse">
              <p className="text-sm uppercase tracking-[0.16em] text-emerald-700">New badge unlocked!</p>
              <div className="mt-2 flex items-center gap-3 text-lg font-semibold">
                <span>{latestUnlockedBadge.icon}</span>
                <span>{latestUnlockedBadge.title}</span>
              </div>
              <p className="text-sm text-emerald-800">{latestUnlockedBadge.description}</p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl border p-4 transition duration-300 ${badge.unlockedAt ? "border-emerald-200 bg-emerald-50 shadow-sm" : "border-slate-200 bg-slate-950/5"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={badge.unlockedAt ? "text-emerald-700" : "text-muted-foreground"}>
                    {badge.unlockedAt ? `Unlocked ${new Date(badge.unlockedAt).toLocaleDateString()}` : "Locked"}
                  </span>
                  {badge.unlockedAt && <Badge variant="secondary" className="text-[10px]">Earned</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-body text-lg font-semibold">Achievement History</h2>
          <p className="mb-4 text-sm text-muted-foreground">All unlocked badges are saved and shown here.</p>
          {achievementHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No achievements yet. Complete tasks to unlock badges.</p>
          ) : (
            <ul className="space-y-3">
              {achievementHistory.slice().reverse().map((entry) => {
                const badge = achievements.find((item) => item.id === entry.id);
                return (
                  <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-950/5 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span>{badge?.icon} {badge?.title}</span>
                      <span className="text-xs text-muted-foreground">{new Date(entry.unlockedAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">{badge?.description}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => navigate("/tasks")}>View All Tasks</Button>
      </div>
    </div>
  );
}
