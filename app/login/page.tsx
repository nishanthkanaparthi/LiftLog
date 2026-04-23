"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MessageType = "success" | "error" | "";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full rounded-2xl
        border border-[#3B82F6]/20
        bg-[#0b0f1a]
        px-4 py-3.5
        text-white
        placeholder:text-[#94A3B8]
        outline-none
        transition
        focus:border-[#60A5FA]
        focus:ring-2 focus:ring-[#3B82F6]/20
      "
    />
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        w-full rounded-2xl
        bg-gradient-to-r from-[#2563EB] to-[#60A5FA]
        px-5 py-3
        font-semibold text-white
        shadow-[0_0_25px_rgba(59,130,246,0.45)]
        transition
        hover:brightness-110
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("liftlogUser");
    if (storedUser) router.push("/dashboard");
  }, [router]);

  const showError = (text: string) => {
    setMessageText(text);
    setMessageType("error");
  };

  const showSuccess = (text: string) => {
    setMessageText(text);
    setMessageType("success");
  };

  const handleLogin = async () => {
    setMessageText("");

    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("liftlogUser", JSON.stringify(data.user));
      showSuccess("Login successful.");
      router.push("/dashboard");
    } catch {
      showError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04070d] text-white overflow-hidden">
      {/* BACKGROUND GLOW (MATCH DASHBOARD) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.25),transparent_30%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#03060d]/70 to-black/90" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-[#3B82F6]/20 bg-[#060b18] shadow-[0_40px_120px_rgba(0,0,0,0.7)] lg:grid-cols-2">

          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-between border-r border-[#3B82F6]/20 p-10">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[#60A5FA]">
                LiftLog
              </p>

              <h1 className="text-5xl font-semibold leading-tight">
                Built for disciplined progress.
              </h1>

              <p className="mt-5 max-w-md text-[#94A3B8] leading-relaxed">
                Log meals, track macros, monitor weight, and get smarter food suggestions
                from a dashboard designed around consistency.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-[#3B82F6]/20 bg-[#0b0f1a] p-4">
                <p className="text-sm text-[#94A3B8]">Track daily calories</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Stay consistent every day
                </p>
              </div>

              <div className="rounded-2xl border border-[#3B82F6]/20 bg-[#0b0f1a] p-4">
                <p className="text-sm text-[#94A3B8]">
                  Personalized food suggestions
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Eat based on your actual habits
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 md:p-10">
            <div className="mx-auto flex min-h-full max-w-md flex-col justify-center">

              <div className="mb-8">
                <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[#60A5FA] lg:hidden">
                  LiftLog
                </p>

                <h2 className="text-4xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-3 text-[#94A3B8]">
                  Log in to continue tracking your goals, food, and progress.
                </p>
              </div>

              {messageText && (
                <div
                  className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
                    messageType === "error"
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : "border-[#3B82F6]/30 bg-[#2563EB]/10 text-[#BFDBFE]"
                  }`}
                >
                  {messageText}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <PrimaryButton onClick={handleLogin} disabled={isLoading}>
                  {isLoading ? "Logging In..." : "Log In"}
                </PrimaryButton>
              </div>

              <p className="mt-6 text-sm text-[#94A3B8]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-[#60A5FA] hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}