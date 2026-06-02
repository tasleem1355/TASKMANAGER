import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (register(name, email, password)) {
      toast.success("Account created!");
      navigate("/dashboard");
    } else {
      toast.error("Email already in use.");
    }
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-card p-8">

        {/* Added Register Page Heading */}
        <h1 className="mb-2 text-center text-3xl font-bold">
          Register Page
        </h1>

        <p className="mb-2 text-center text-2xl">
          Create Account
        </p>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          Start organizing your tasks
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label htmlFor="name">Full Name</Label>

            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;