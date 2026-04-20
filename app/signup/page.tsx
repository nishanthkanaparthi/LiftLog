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
      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-white/10"
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
      className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("liftlogUser");

    if (storedUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const showError = (text: string) => {
    setMessageText(text);
    setMessageType("error");
  };

  const showSuccess = (text: string) => {
    setMessageText(text);
    setMessageType("success");
  };

  const handleSignup = async () => {
    setMessageText("");

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      showError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Signup failed");
        return;
      }

      showSuccess("Account created successfully.");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setMessageText("");
        router.push("/login");
      }, 900);
    } catch (error) {
      console.error(error);
      showError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(to_bottom,_#09090b,_#000000)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 md:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.45)] lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between border-r border-white/10 bg-white/[0.03] p-10">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.22em] text-zinc-500">
                LiftLog
              </p>
              <h1 className="text-5xl font-semibold tracking-tight">
                Start building better habits.
              </h1>
              <p className="mt-5 max-w-md text-zinc-400 leading-relaxed">
                Create your account and start tracking goals, meals, macros, weight,
                and smarter next-food suggestions tailored to you.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-zinc-500">Daily macro tracking</p>
                <p className="mt-1 text-lg font-semibold">Know exactly where you stand</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-zinc-500">Personalized dashboard</p>
                <p className="mt-1 text-lg font-semibold">Your own goals, foods, and progress</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
              <div className="mb-8">
                <p className="mb-3 text-sm uppercase tracking-[0.22em] text-zinc-500 lg:hidden">
                  LiftLog
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Create account
                </h2>
                <p className="mt-3 text-zinc-400">
                  Set up your account and start using LiftLog.
                </p>
              </div>

              {messageText && (
                <div
                  className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
                    messageType === "error"
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {messageText}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

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

                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <PrimaryButton onClick={handleSignup} disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </PrimaryButton>
              </div>

              <p className="mt-6 text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-white hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}