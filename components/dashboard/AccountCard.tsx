import Card from "./ui/Card";

export default function AccountCard() {
  return (
    <Card title="Account" subtitle="Manage your session.">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-400">
          You are currently logged in. Logging out will clear your session from this device.
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("liftlogUser");
            window.location.href = "/login";
          }}
          className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Log Out
        </button>
      </div>
    </Card>
  );
}