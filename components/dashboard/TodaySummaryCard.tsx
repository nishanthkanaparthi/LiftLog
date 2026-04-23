"use client";

import { useState } from "react";
import Card from "./ui/Card";

type MoodOption = "Great" | "Good" | "Okay" | "Low";

export default function TodaySummaryCard() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const moodOptions: MoodOption[] = ["Great", "Good", "Okay", "Low"];
  const tagOptions = ["Energetic", "Tired", "Hungry", "Focused"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const getMoodNote = () => {
    if (selectedMood === "Great") {
      return "You felt strong today. Keep building on what worked.";
    }

    if (selectedMood === "Good") {
      return "A solid day overall. Consistency like this adds up.";
    }

    if (selectedMood === "Okay") {
      return "Not every day needs to feel perfect. Progress still counts.";
    }

    if (selectedMood === "Low") {
      return "Low-energy days happen. Recovery, hydration, and food quality matter.";
    }

    return "No check-in yet for today.";
  };

  return (
    <Card
      title="How Did Today Feel?"
      subtitle="Track your daily check-in alongside your nutrition progress."
    >
      <div className="space-y-5">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Mood
          </p>

          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((mood) => {
              const isSelected = selectedMood === mood;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    isSelected
                      ? "border-[#61BEFF]/40 bg-[#4CB4FF] text-[#03111d] shadow-[0_0_22px_rgba(76,180,255,0.24)]"
                      : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Quick Tags
          </p>

          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                    isSelected
                      ? "border-[#61BEFF]/35 bg-[#0b1830] text-[#8fd3ff]"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.05]"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Today’s Note
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-300">{getMoodNote()}</p>

          {selectedTags.length > 0 && (
            <p className="mt-3 text-xs text-zinc-500">
              Tags: {selectedTags.join(" • ")}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <p className="text-sm text-zinc-400">
            Patterns over time matter more than one day.
          </p>
        </div>
      </div>
    </Card>
  );
}