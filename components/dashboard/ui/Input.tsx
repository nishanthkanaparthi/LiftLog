export default function Input({
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
        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-white/10"
      />
    );
  }