"use client";

export type TabId = "latest" | "trending" | "popular";

type Tab = { id: TabId; label: string };

const TABS: Tab[] = [
  { id: "latest", label: "Latest" },
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Popular" },
];

type TabsProps = {
  active: TabId;
  onChange: (id: TabId) => void;
};

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="flex gap-1 rounded-lg bg-secondary p-1" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            active === tab.id
              ? "bg-bg-page text-text-body shadow-sm"
              : "text-text-muted hover:text-text-body"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
