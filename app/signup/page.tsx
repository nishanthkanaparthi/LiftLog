"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    setMessage("");

    if (!email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <p className="mb-3 text-sm uppercase tracking-[0.28em] text-[#60A5FA]/70">
              LiftLog
            </p>

            <h1 className="text-5xl font-semibold tracking-tight text-white">
              Sign Up
            </h1>

            <p className="mt-3 text-lg leading-7 text-white/65">
              Create your account and start tracking your nutrition.
            </p>

            {message && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {message}
              </div>
            )}

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-[#3B82F6]/50 focus:bg-white/[0.06]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-[#3B82F6]/50 focus:bg-white/[0.06]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSignup}
              disabled={isSubmitting}
              className="mt-7 w-full rounded-2xl bg-[#1D4ED8] px-4 py-4 text-lg font-semibold text-white shadow-[0_0_18px_rgba(37,99,235,0.24)] transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
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
    </main>
  );
}