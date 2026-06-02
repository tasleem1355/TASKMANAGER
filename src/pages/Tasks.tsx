import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import TaskForm from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trash2, Edit, Search } from "lucide-react";
import { toast } from "sonner";

const priorityLabel: Record<Task["priority"], string> = { high: "🔴 High", medium: "🟡 Medium", low: "🟢 Low" };
const priorityClass: Record<Task["priority"], string> = { high: "priority-high", medium: "priority-medium", low: "priority-low" };

export default function TasksPage() {
  const { user, tasks, deleteTask, toggleTaskStatus, achievements } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const subjects = useMemo(() => [...new Set(tasks.map(t => t.subject))], [tasks]);
  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterSubject !== "all" && t.subject !== filterSubject) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      return true;
    });
  }, [tasks, search, filterSubject, filterPriority, filterStatus]);

  const getRowClass = (task: Task) => {
    if (task.status === "completed") return "";
    if (task.dueDate < today) return "task-overdue";
    if (task.dueDate === today) return "task-due-today";
    return "";
  };

  if (!user) return null;

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl">My Tasks</h1>
        <TaskForm />
      </div>

      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger><SelectValue placeholder="All Subjects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger><SelectValue placeholder="All Priorities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(task => (
            <div key={task.id} className={`rounded-lg border bg-card p-5 transition-shadow hover:shadow-md ${getRowClass(task)}`}>
              <div className="mb-3 flex items-start justify-between">
                <h3 className={`font-semibold ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                <Badge variant="outline" className={`text-xs ${priorityClass[task.priority]}`}>
                  {priorityLabel[task.priority]}
                </Badge>
              </div>
              {task.description && (
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              )}
              <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-secondary px-2 py-0.5">{task.subject}</span>
                <span>Due: {task.dueDate}</span>
                <Badge variant={task.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {task.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { toggleTaskStatus(task.id); toast.success(task.status === "completed" ? "Marked pending" : "Marked completed"); }}
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {task.status === "completed" ? "Undo" : "Complete"}
                </Button>
                <TaskForm
                  task={task}
                  trigger={<Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button>}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { deleteTask(task.id); toast.success("Task deleted"); }}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
