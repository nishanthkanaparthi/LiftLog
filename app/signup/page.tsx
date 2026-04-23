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
    <main className="min-h-screen bg-[#020409] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020409_0%,#04070d_35%,#020409_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(58,132,255,0.24),transparent_22%),radial-gradient(circle_at_84%_15%,rgba(44,110,255,0.20),transparent_18%),radial-gradient(circle_at_82%_62%,rgba(46,120,255,0.17),transparent_22%),radial-gradient(circle_at_18%_78%,rgba(53,103,255,0.17),transparent_24%)]" />
        <div className="absolute inset-y-0 left-[5%] w-[320px] bg-[#216dff]/[0.12] blur-[150px]" />
        <div className="absolute inset-y-0 right-[5%] w-[320px] bg-[#1d5fff]/[0.12] blur-[150px]" />
        <div className="absolute top-[150px] left-[9%] h-[320px] w-[320px] rounded-full bg-[#2b7dff]/[0.14] blur-[165px]" />
        <div className="absolute top-[220px] right-[8%] h-[320px] w-[320px] rounded-full bg-[#2a5fff]/[0.14] blur-[165px]" />
        <div className="absolute bottom-[100px] left-[25%] h-[260px] w-[260px] rounded-full bg-[#3a7fff]/[0.11] blur-[155px]" />
        <div className="absolute bottom-[110px] right-[20%] h-[260px] w-[260px] rounded-full bg-[#355dff]/[0.11] blur-[155px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-[#0B65B8] bg-[#04070d] shadow-[0_30px_100px_rgba(0,0,0,0.55)] md:grid-cols-2">
            <div className="border-b border-[#0B65B8] p-8 md:border-b-0 md:border-r md:p-10">
              <p className="text-sm uppercase tracking-[0.28em] text-[#73CCFF]/80">
                LiftLog
              </p>

              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                Build disciplined progress.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-8 text-[#9DB7D8]">
                Create your account and start tracking calories, macros, weight,
                and smarter food suggestions from one clean dashboard.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-[#0B65B8] bg-[#080c14] p-5">
                  <p className="text-sm text-[#6F8FAF]">Track daily calories</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Stay consistent every day
                  </p>
                </div>

                <div className="rounded-3xl border border-[#0B65B8] bg-[#080c14] p-5">
                  <p className="text-sm text-[#6F8FAF]">
                    Personalized food suggestions
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Eat based on your actual habits
                  </p>
                </div>

                <div className="rounded-3xl border border-[#0B65B8] bg-[#080c14] p-5">
                  <p className="text-sm text-[#6F8FAF]">Clean onboarding flow</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Set goals and start immediately
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-base leading-7 text-[#9DB7D8]">
                Sign up to start tracking your goals, food, and progress.
              </p>

              {message && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {message}
                </div>
              )}

              <div className="mt-7 space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-[#0B65B8] bg-[#080c14] px-5 py-4 text-lg text-white outline-none transition placeholder:text-[#6F8FAF] focus:border-[#61BEFF]/50 focus:bg-[#0b1320]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-[#0B65B8] bg-[#080c14] px-5 py-4 text-lg text-white outline-none transition placeholder:text-[#6F8FAF] focus:border-[#61BEFF]/50 focus:bg-[#0b1320]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl border border-[#0B65B8] bg-[#080c14] px-5 py-4 text-lg text-white outline-none transition placeholder:text-[#6F8FAF] focus:border-[#61BEFF]/50 focus:bg-[#0b1320]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-[#0B65B8] bg-[#080c14] px-5 py-4 text-lg text-white outline-none transition placeholder:text-[#6F8FAF] focus:border-[#61BEFF]/50 focus:bg-[#0b1320]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleSignup}
                disabled={isSubmitting}
                className="mt-6 w-full rounded-2xl border border-[#61BEFF]/40 bg-[#4CB4FF] px-4 py-4 text-lg font-semibold text-[#03111d] shadow-[0_0_26px_rgba(76,180,255,0.28)] transition hover:bg-[#76CAFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="mt-6 text-base text-[#9DB7D8]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#73CCFF] underline underline-offset-4 transition hover:text-[#9BD8FF]"
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