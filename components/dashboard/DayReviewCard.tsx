import Card from "./ui/Card";
import type { DayReview } from "@/lib/dashboard/types";

export default function DayReviewCard({ dayReview }: { dayReview: DayReview }) {
  return (
    <Card
      title="Auto-Generated Day Review"
      subtitle="A live read on how your day is unfolding."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-lg font-semibold text-white">{dayReview.headline}</p>
          <p className="mt-2 text-sm text-zinc-400">{dayReview.status}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">Today’s Story</p>
          <div className="mt-3 space-y-3">
            {dayReview.bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                <p className="text-sm leading-6 text-zinc-400">{bullet}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Focus Right Now</p>
          <p className="mt-2 text-sm leading-6 text-white">{dayReview.focus}</p>
        </div>
      </div>
    </Card>
  );
}