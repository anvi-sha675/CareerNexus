import { useState } from "react";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import SearchInput from "../../components/common/SearchInput";
import EmptyState from "../../components/common/EmptyState";
import { cn } from "../../utils/cn";
import { timeAgo } from "../../utils/formatters";

const CONVERSATIONS = [
  {
    id: "c1",
    name: "Rohan Mehta",
    company: "TechFlow Systems",
    online: true,
    lastMessage: "Great — see you at the interview!",
    updatedAt: "2026-07-08T14:00:00",
    unread: 2,
  },
  {
    id: "c2",
    name: "Divya Rao",
    company: "AgriSense Labs",
    online: false,
    lastMessage: "Thanks for applying, we'll review shortly.",
    updatedAt: "2026-07-07T09:30:00",
    unread: 0,
  },
  {
    id: "c3",
    name: "Karan Singh",
    company: "NimbusCloud",
    online: true,
    lastMessage: "Can you share your GitHub profile?",
    updatedAt: "2026-07-06T18:10:00",
    unread: 0,
  },
];

const MESSAGES = {
  c1: [
    {
      id: 1,
      from: "them",
      text: "Hi! Thanks for applying to the Frontend Engineer role.",
      time: "10:02 AM",
    },
    {
      id: 2,
      from: "me",
      text: "Thank you for reaching out — excited about the opportunity!",
      time: "10:05 AM",
    },
    {
      id: 3,
      from: "them",
      text: "We'd like to schedule an interview for Friday, 11 AM. Does that work?",
      time: "10:07 AM",
    },
    { id: 4, from: "me", text: "That works great for me.", time: "10:10 AM" },
    {
      id: 5,
      from: "them",
      text: "Great — see you at the interview!",
      time: "10:11 AM",
    },
  ],
};

export default function Messages() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [typing, setTyping] = useState(false);

  const active = CONVERSATIONS.find((c) => c.id === activeId);
  const thread = messages[activeId] || [];
  const filtered = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        { id: Date.now(), from: "me", text: draft, time: "Just now" },
      ],
    }));
    setDraft("");
    setTyping(true);
    setTimeout(() => setTyping(false), 1800);
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Conversations with recruiters and candidates."
        breadcrumbs={[{ label: "Messages" }]}
      />

      <Card padding="p-0" className="overflow-hidden">
        <div className="grid h-150 grid-cols-1 md:grid-cols-[280px_1fr]">
          <div className="hidden flex-col border-r border-slate-100 md:flex dark:border-slate-700">
            <div className="border-b border-slate-100 p-3 dark:border-slate-700">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search conversations..."
              />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-slate-50 p-3.5 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60",
                    activeId === c.id &&
                      "bg-primary-50/60 dark:bg-primary-500/5",
                  )}
                >
                  <div className="relative">
                    <Avatar name={c.name} size="sm" />
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-success dark:border-slate-800" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {c.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-slate-400">
                        {timeAgo(c.updatedAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-400">
                      {c.company}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {active ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 p-3.5 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Avatar name={active.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {active.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {active.online ? "Online" : "Offline"} ·{" "}
                        {active.company}
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label="More options"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
                  {thread.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex",
                        m.from === "me" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs rounded-2xl px-4 py-2.5 text-sm",
                          m.from === "me"
                            ? "bg-primary-500 text-white"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                        )}
                      >
                        {m.text}
                        <p
                          className={cn(
                            "mt-1 text-[10px]",
                            m.from === "me"
                              ? "text-primary-100"
                              : "text-slate-400",
                          )}
                        >
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <p className="text-xs italic text-slate-400">
                      {active.name} is typing…
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-slate-700">
                  <button
                    aria-label="Attach file"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    aria-label="Type a message"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <button
                    onClick={sendMessage}
                    aria-label="Send message"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <EmptyState
                title="Select a conversation"
                description="Choose a conversation from the list to start messaging."
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
