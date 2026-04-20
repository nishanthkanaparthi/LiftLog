import { getProgress } from "@/lib/dashboard/helpers";

export default function ProgressRow({
  label,
  current,
  goal,
  unit = "",
}: {
  label: string;
  current: number;
  goal: number;
  unit?: string;
}) {
  const progress = getProgress(current, goal);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="text-zinc-400">
          {current}
          {unit} / {goal}
          {unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}