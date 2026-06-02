import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  BarChart3,
  Search,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Task Management",
    desc: "Create, edit, and organize all your academic tasks in one place.",
  },
  {
    icon: Clock,
    title: "Due Date Tracking",
    desc: "Never miss a deadline with color-coded reminders and highlights.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    desc: "Visualize your completion rate and stay motivated.",
  },
  {
    icon: Search,
    title: "Smart Filters",
    desc: "Quickly find tasks by subject, priority, or status.",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center py-20 text-center md:py-32">
        <span className="mb-4 rounded-full border bg-secondary px-4 py-1 text-xs font-medium text-secondary-foreground">
          📚 Built for Students
        </span>

        {/* Added Home Page Heading */}
        <h1 className="mb-4 text-2xl font-bold">
          Home Page
        </h1>

        <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">
          Student Task Management System
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Organize your assignments, track deadlines, and boost your academic
          productivity with a clean, intuitive dashboard.
        </p>

        <div className="mt-8 flex gap-3">
          <Button size="lg" onClick={() => navigate("/register")}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-secondary/50 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl">
            Everything You Need
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <f.icon className="mb-3 h-8 w-8 text-primary" />

                <h3 className="mb-2 font-body text-lg font-semibold">
                  {f.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;