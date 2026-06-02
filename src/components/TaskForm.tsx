import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Computer Science", "Art", "Other"];

export default function TaskForm({ task, onClose, trigger }: TaskFormProps) {
  const { addTask, updateTask } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [subject, setSubject] = useState(task?.subject || "");
  const [priority, setPriority] = useState<Task["priority"]>(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [status, setStatus] = useState<Task["status"]>(task?.status || "pending");

  const reset = () => {
    if (!task) {
      setTitle(""); setDescription(""); setSubject(""); setPriority("medium"); setDueDate(""); setStatus("pending");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject || !dueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (task) {
      updateTask(task.id, { title, description, subject, priority, dueDate, status });
      toast.success("Task updated!");
    } else {
      addTask({ title, description, subject, priority, dueDate, status });
      toast.success("Task added!");
    }
    reset();
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Task</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required maxLength={100} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={500} rows={3} />
          </div>
          <div>
            <Label>Subject *</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date *</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
          </div>
          {task && (
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Task["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full">{task ? "Save Changes" : "Add Task"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
