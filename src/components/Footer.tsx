import { Mail, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-display text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            TaskFlow
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 TaskFlow. Helping students stay organized.
          </p>
          <a href="mailto:contact@taskflow.app" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <Mail className="h-4 w-4" /> contact@taskflow.app
          </a>
        </div>
      </div>
    </footer>
  );
}
