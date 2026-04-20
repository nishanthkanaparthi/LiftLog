import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_80%_28%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_30%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/70 to-black/90" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />

        <div className="absolute -left-24 top-20 h-[360px] w-[360px] rounded-full bg-[#2563EB]/20 blur-[150px]" />
        <div className="absolute bottom-0 right-[-40px] h-[340px] w-[340px] rounded-full bg-[#1D4ED8]/16 blur-[160px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-6 md:px-10">
          <header className="flex items-center justify-between rounded-[32px] border border-white/10 bg-black/40 px-6 py-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1D4ED8] text-white shadow-[0_0_24px_rgba(37,99,235,0.42)]">
                <span className="text-xl font-black">L</span>
              </div>
              <span className="text-xl font-bold tracking-wide">LiftLog</span>
            </div>

            <div className="hidden items-center gap-10 md:flex">
              <a
                href="#features"
                className="text-lg text-white/80 transition hover:text-[#60A5FA]"
              >
                Features
              </a>
              <a
                href="#preview"
                className="text-lg text-white/80 transition hover:text-[#60A5FA]"
              >
                Dashboard Preview
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full border border-[#2563EB] px-5 py-2.5 text-base font-medium text-[#60A5FA] transition hover:bg-[#1D4ED8] hover:text-white"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-[#1D4ED8] px-5 py-2.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition hover:scale-[1.02] hover:bg-[#2563EB]"
              >
                Sign Up
              </Link>
            </div>
          </header>

          <section className="flex flex-col items-center justify-center px-4 pt-24 text-center">
            <div className="max-w-4xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#60A5FA]/75">
                Precision nutrition tracking
              </p>

              <h1 className="mx-auto max-w-4xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] bg-clip-text text-6xl font-semibold leading-[1.05] tracking-tight text-transparent md:text-7xl">
                Build Your Physique
                <br />
                With Precision
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Track your calories, log your meals, and stay aligned with your
                fitness goals through one clean, powerful dashboard.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-full bg-[#1D4ED8] px-8 py-4 text-lg font-semibold text-white shadow-[0_0_22px_rgba(37,99,235,0.32)] transition hover:scale-[1.02] hover:bg-[#2563EB]"
                >
                  Get Started
                </Link>

                <a
                  href="#features"
                  className="rounded-full border border-white/15 px-8 py-4 text-lg font-medium text-white transition hover:border-[#3B82F6] hover:text-[#60A5FA]"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </section>

          <section
            id="preview"
            className="scroll-mt-28 mx-auto mt-20 w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="rounded-[26px] border border-white/10 bg-[#0D1320] p-5 md:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    LiftLog Dashboard
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    A system built for clean tracking
                  </h2>
                </div>

                <div className="hidden gap-3 md:flex">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-white/45">Calories</p>
                    <p className="mt-1 text-lg font-semibold text-white">1820</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-white/45">Protein</p>
                    <p className="mt-1 text-lg font-semibold text-white">146g</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-xs text-white/45">Weight</p>
                    <p className="mt-1 text-lg font-semibold text-white">156 lbs</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/45">
                    Daily Progress
                  </p>
                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Calories</span>
                        <span>1820 / 3000</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div className="h-3 w-[61%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Protein</span>
                        <span>146g / 200g</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div className="h-3 w-[73%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Carbs</span>
                        <span>188g / 250g</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10">
                        <div className="h-3 w-[75%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/45">
                    Recent Entry
                  </p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xl font-semibold text-white">
                      Chicken Rice Bowl
                    </p>
                    <p className="mt-2 text-sm text-white/55">
                      48g protein • 52g carbs • 9g fats
                    </p>
                    <p className="mt-4 text-3xl font-semibold text-[#60A5FA]">
                      520
                    </p>
                    <p className="text-sm text-white/45">calories</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/45">
                    Smart Combo
                  </p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xl font-semibold text-white">
                      Greek Yogurt Bowl
                    </p>
                    <p className="mt-2 text-sm text-white/55">
                      Light and easy snack meal
                    </p>
                    <p className="mt-4 text-sm text-white/65">
                      24g protein • 42g carbs • 3g fats
                    </p>
                    <button className="mt-5 rounded-full bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(37,99,235,0.24)] transition hover:bg-[#2563EB]">
                      Add to Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="mt-28">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-semibold">Core Features</h2>
              <p className="text-white/60 mt-3">
                Built for real daily use — fast, simple, and effective
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#1D4ED8]/16 to-black p-6 transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)]">
                <h3 className="text-xl font-semibold mb-2">Track Macros</h3>
                <p className="text-white/60 text-sm mb-6">
                  Monitor calories, protein, carbs, and fats with real-time
                  progress.
                </p>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Today
                    </span>
                    <span className="text-xs text-[#60A5FA]">Live totals</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Calories</span>
                        <span>1820 / 3000</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[61%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Protein</span>
                        <span>146g / 200g</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[73%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Carbs</span>
                        <span>188g / 250g</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[75%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm text-white/70">
                        <span>Fats</span>
                        <span>58g / 100g</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[58%] rounded-full bg-[#2563EB]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
              </div>

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#2563EB]/16 to-black p-6 transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)]">
                <h3 className="text-xl font-semibold mb-2">Log Meals Fast</h3>
                <p className="text-white/60 text-sm mb-6">
                  Smart search and suggestions let you log meals in seconds.
                </p>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Quick Entry
                    </span>
                    <span className="rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#60A5FA]">
                      Fast
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/45">
                    Search food name
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-sm font-semibold text-white">
                        Chicken Rice Bowl
                      </p>
                      <p className="mt-1 text-xs text-white/55">
                        48g protein • 52g carbs • 9g fats
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-sm font-semibold text-white">
                        Bananas, raw
                      </p>
                      <p className="mt-1 text-xs text-white/55">
                        89 cal • 1.1g protein • 22.8g carbs
                      </p>
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-full bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(37,99,235,0.24)] transition hover:bg-[#2563EB]">
                    Find Food
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA]/40 to-transparent" />
              </div>

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#3B82F6]/14 to-black p-6 transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)]">
                <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
                <p className="text-white/60 text-sm mb-6">
                  Get meal ideas based on your remaining macros for the day.
                </p>

                <div className="space-y-3">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Greek Yogurt Bowl
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          Light and easy snack meal
                        </p>
                        <p className="mt-3 text-xs text-white/60">
                          24g protein • 42g carbs • 3g fats
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#60A5FA]">
                        320
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Rice and Dahi Plate
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          Simple bulk-friendly plate
                        </p>
                        <p className="mt-3 text-xs text-white/60">
                          39g protein • 50g carbs • 10g fats
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#60A5FA]">
                        500
                      </span>
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full rounded-full bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(37,99,235,0.24)] transition hover:bg-[#2563EB]">
                  Add Best Fit
                </button>

                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#93C5FD]/35 to-transparent" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}