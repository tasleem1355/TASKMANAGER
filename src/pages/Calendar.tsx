import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMonths, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, parseISO, startOfDay, startOfWeek, subMonths } from "date-fns";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as DayCalendar } from "@/components/ui/calendar";
import { CalendarDays, ChevronLeft, ChevronRight, Sparkles, Clock4, CheckCircle } from "lucide-react";

const views = [
  { key: "month", label: "Monthly" },
  { key: "week", label: "Weekly" },
  { key: "day", label: "Daily" },
] as const;

type ViewType = (typeof views)[number]["key"];

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPage() {
  const { user, tasks } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewType>("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const today = startOfDay(new Date());
  const normalizedSelectedDate = startOfDay(selectedDate);

  const taskGroups = useMemo(() => {
    return tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
      const key = task.dueDate;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const selectedTasks = useMemo(() => {
    const key = format(normalizedSelectedDate, "yyyy-MM-dd");
    return taskGroups[key] || [];
  }, [normalizedSelectedDate, taskGroups]);

  const overdueTasks = useMemo(
    () => tasks.filter((task) => isBefore(parseISO(task.dueDate), today) && task.status === "pending"),
    [tasks, today]
  );

  const upcomingTasks = useMemo(
    () => tasks.filter((task) => !isBefore(parseISO(task.dueDate), today) && task.status === "pending"),
    [tasks, today]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "completed"),
    [tasks]
  );

  const weekRange = useMemo(() => {
    const start = startOfWeek(normalizedSelectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(normalizedSelectedDate, { weekStartsOn: 1 });
    const days: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      days.push(cursor);
      cursor = new Date(cursor.getTime());
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [normalizedSelectedDate]);

  const weeklyTasks = useMemo(
    () =>
      weekRange.map((date) => ({
        date,
        tasks: taskGroups[format(date, "yyyy-MM-dd")] || [],
      })),
    [taskGroups, weekRange]
  );

  const monthSelection = (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto] items-center">
      <div className="flex flex-wrap gap-2">
        {views.map((option) => (
          <Button
            key={option.key}
            variant={view === option.key ? "secondary" : "outline"}
            size="sm"
            onClick={() => setView(option.key)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth((month) => subMonths(month, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth((month) => addMonths(month, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => {
          setCurrentMonth(new Date());
          setSelectedDate(new Date());
        }}>
          Today
        </Button>
      </div>
    </div>
  );

  const monthYearSelector = (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
      <select
        value={currentMonth.getMonth()}
        onChange={(event) => {
          const monthIndex = Number(event.target.value);
          setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
        }}
        className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        {MONTH_LABELS.map((label, index) => (
          <option key={label} value={index}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={currentMonth.getFullYear()}
        onChange={(event) => {
          const year = Number(event.target.value);
          setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        }}
        className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        {Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - 2 + index).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );

  const renderTaskCard = (task: (typeof tasks)[number]) => (
    <div key={task.id} className="rounded-2xl border border-slate-200 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{task.title}</p>
          <p className="text-xs text-muted-foreground">{task.subject} • {task.priority}</p>
        </div>
        <Badge variant={task.status === "completed" ? "default" : "secondary"} className="text-xs">
          {task.status}
        </Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
    </div>
  );

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Calendar View</p>
          <h1 className="text-3xl">Organize Tasks by Date</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Browse your tasks in a monthly, weekly, or daily calendar layout. Quickly spot deadlines, overdue work, and completed progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {view === "month" ? "Monthly" : view === "week" ? "Weekly" : "Daily"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {format(normalizedSelectedDate, "PPP")}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="space-y-4 rounded-3xl border bg-card p-6">
          <div className="grid gap-4">
            {monthSelection}
            {monthYearSelector}
          </div>

          {view === "month" && (
            <div className="rounded-3xl border border-slate-200 bg-background p-4">
              <DayCalendar
                month={currentMonth}
                selected={normalizedSelectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                onMonthChange={(date) => date && setCurrentMonth(date)}
              />
            </div>
          )}

          {view === "week" && (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Week of</p>
                  <p className="font-semibold">{format(weekRange[0], "MMM d")} — {format(weekRange[6], "MMM d, yyyy")}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                  Today
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {weeklyTasks.map((day) => (
                  <div key={day.date.toISOString()} className="rounded-3xl border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{format(day.date, "EEE")}</p>
                        <p className="text-sm text-muted-foreground">{format(day.date, "MMM d")}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {day.tasks.length} task{day.tasks.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    {day.tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No tasks scheduled.</p>
                    ) : (
                      <div className="space-y-2">
                        {day.tasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="rounded-2xl bg-slate-950/5 p-3">
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.status === "completed" ? "Completed" : "Pending"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "day" && (
            <div className="rounded-3xl border border-slate-200 bg-background p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Selected day</p>
                  <p className="text-xl font-semibold">{format(normalizedSelectedDate, "EEEE, MMMM d")}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                  Today
                </Button>
              </div>
              <div className="space-y-3">
                {selectedTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
                ) : (
                  selectedTasks.map(renderTaskCard)
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-3 text-primary">
              <CalendarDays className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Date Overview</h2>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-background p-4">
                <p className="text-sm text-muted-foreground">Tasks this month</p>
                <p className="mt-2 text-3xl font-semibold">{tasks.filter((task) => isSameMonth(parseISO(task.dueDate), currentMonth)).length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-background p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Upcoming tasks</p>
                  <Badge variant="secondary" className="text-xs">{upcomingTasks.length}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Tasks with future deadlines still pending.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-background p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Overdue tasks</p>
                  <Badge variant={overdueTasks.length > 0 ? "destructive" : "secondary"} className="text-xs">
                    {overdueTasks.length}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Pending tasks with missed deadlines.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-background p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Completed tasks</p>
                  <Badge variant="default" className="text-xs">
                    {completedTasks.length}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Total tasks you have finished.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Selected Date Tasks</h2>
            </div>
            <div className="mt-4 space-y-3">
              {selectedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Select a day to view tasks on the calendar.</p>
              ) : (
                selectedTasks.map(renderTaskCard)
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
