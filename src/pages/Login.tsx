import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Stethoscope, User } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";

const loginOptions = [
  {
    role: "admin" as const,
    title: "Administrator",
    description: "Manage clinic records, staff, and operations",
    icon: Shield,
    color: "bg-vivavive-red",
  },
  {
    role: "doctor" as const,
    title: "Doctor",
    description: "Access patient records and manage treatments",
    icon: Stethoscope,
    color: "bg-vivavive-teal",
  },
  {
    role: "patient" as const,
    title: "Patient",
    description: "View your medical records and appointments",
    icon: User,
    color: "bg-vivavive-gray",
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      if (!name.trim()) {
        setError("Name is required");
        return;
      }
      registerMutation.mutate({
        name,
        email,
        password,
        role: selectedRole as "user" | "admin" | "doctor" | "patient" | undefined,
      });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-vivavive-offwhite flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <img
          src="/assets/dr-ishika.jpg"
          alt="Dr. Ishika Patidar"
          className="mx-auto h-24 w-24 rounded-full object-cover shadow-lg mb-4"
        />
        <h1 className="font-serif text-3xl text-vivavive-dark tracking-tight">VivaVive Health</h1>
        <p className="font-sans text-sm text-vivavive-muted mt-1">Physiotherapy & Wellness Clinic</p>
      </div>

      {!selectedRole ? (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-center font-sans text-lg text-vivavive-dark mb-6">Select your role to sign in</h2>
          {loginOptions.map((option) => (
            <button
              key={option.role}
              onClick={() => setSelectedRole(option.role)}
              className="w-full flex items-center gap-4 rounded-[10px] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${option.color}`}>
                <option.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-sans text-base font-semibold text-vivavive-dark">{option.title}</p>
                <p className="font-sans text-sm text-vivavive-muted">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <Card className="w-full max-w-sm border-none shadow-md rounded-[10px]">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-vivavive-offwhite">
              {(() => {
                const option = loginOptions.find((o) => o.role === selectedRole);
                if (!option) return null;
                const Icon = option.icon;
                return <Icon className="h-6 w-6 text-vivavive-teal" />;
              })()}
            </div>
            <CardTitle className="font-serif text-xl">
              {isRegister ? "Create Account" : "Sign In"} as {loginOptions.find((o) => o.role === selectedRole)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="rounded-full"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full rounded-full bg-black text-white hover:bg-[#222]"
                size="lg"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {loginMutation.isPending || registerMutation.isPending
                  ? "Loading..."
                  : isRegister
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-sm text-vivavive-muted hover:text-vivavive-dark underline"
              >
                {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
              </button>
            </div>
            <Button
              variant="ghost"
              className="w-full text-vivavive-muted hover:text-vivavive-dark mt-2"
              onClick={() => {
                setSelectedRole(null);
                setError("");
                setIsRegister(false);
              }}
            >
              Back to role selection
            </Button>
          </CardContent>
        </Card>
      )}

      <p className="mt-8 text-center font-sans text-xs text-vivavive-muted">
        Dr. Ishika Patidar, BPT, MPT (Ortho)
        <br />
        Physiotherapist & Clinic Director
      </p>
    </div>
  );
}