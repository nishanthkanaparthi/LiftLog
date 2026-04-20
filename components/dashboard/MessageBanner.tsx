import type { MessageType } from "@/lib/dashboard/types";

export default function MessageBanner({
  messageText,
  messageType,
}: {
  messageText: string;
  messageType: MessageType;
}) {
  if (!messageText) return null;

  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm md:text-base ${
        messageType === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {messageText}
    </div>
  );
}