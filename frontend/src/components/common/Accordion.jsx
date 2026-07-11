import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
}) {
  const [openKeys, setOpenKeys] = useState(new Set(defaultOpen));

  const toggle = (key) => {
    setOpenKeys((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set();
      if (prev.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
      {items.map((item) => {
        const open = openKeys.has(item.key);
        return (
          <div key={item.key}>
            <button
              onClick={() => toggle(item.key)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/60"
            >
              {item.question || item.title}
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.answer || item.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
