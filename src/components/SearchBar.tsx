"use client";

type SearchBarProps = {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "搜尋 prompt…",
}: SearchBarProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border px-4 py-2 text-text-body placeholder-text-muted focus:border-[var(--primary-color)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
      aria-label="搜尋"
    />
  );
}
