import { useState } from "react";
import { cn } from "../../utils/cn";

export default function Tabs({ tabs, defaultTab, onChange, className }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);

  const select = (key) => {
    setActive(key);
    onChange?.(key);
  };

  const activeTab = tabs.find((t) => t.key === active);

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700 scrollbar-thin"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => select(tab.key)}
            className={cn(
              "relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors",
              active === tab.key
                ? "text-primary-600 dark:text-primary-500"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
            )}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>
      {activeTab?.content && <div className="pt-4">{activeTab.content}</div>}
    </div>
  );
}
