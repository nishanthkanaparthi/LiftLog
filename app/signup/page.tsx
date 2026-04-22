"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    setMessage("");

    if (name.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed.");
        return;
      }

      localStorage.setItem(
        "liftlogUser",
        JSON.stringify({
          id: data.userId,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_30%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/70 to-black/90" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />

        <div className="absolute -left-24 top-20 h-[320px] w-[320px] rounded-full bg-[#2563EB]/16 blur-[140px]" />
        <div className="absolute bottom-0 right-[-40px] h-[320px] w-[320px] rounded-full bg-[#1D4ED8]/14 blur-[150px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:grid-cols-2">
            <div className="border-b border-white/10 p-10 md:border-b-0 md:border-r">
              <p className="text-sm uppercase tracking-[0.28em] text-white/35">
                LiftLog
              </p>

              <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                Build disciplined progress.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                Create your account and start tracking calories, macros, weight,
                and smarter food suggestions from one clean dashboard.
              </p>

              <div className="mt-10 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm text-white/35">Track daily calories</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    Stay consistent every day
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm text-white/35">
                    Personalized food suggestions
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    Eat based on your actual habits
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm text-white/35">Clean onboarding flow</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    Set goals and start immediately
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10">
              <h2 className="text-4xl font-semibold tracking-tight text-white">
                Create your account
              </h2>

              <p className="mt-4 text-lg leading-7 text-white/60">
                Sign up to start tracking your goals, food, and progress.
              </p>

              {message && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {message}
                </div>
              )}

              <div className="mt-8 space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-[#3B82F6]/50 focus:bg-white/[0.06]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-[#3B82F6]/50 focus:bg-white/[0.06]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-[#3B82F6]/50 focus:bg-white/[0.06]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-[#3B82F6]/50 focus:bg-white/[0.06]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleSignup}
                disabled={isSubmitting}
                className="mt-6 w-full rounded-2xl bg-white px-4 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="mt-6 text-base text-white/55">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-white underline underline-offset-4 transition hover:text-[#60A5FA]"
                >
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