import { useMemo, useState } from "react";
import { MessageSquare, Archive, Trash2, Reply } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import SearchInput from "../../components/common/SearchInput";
import SelectField from "../../components/forms/SelectField";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import TextareaField from "../../components/forms/TextareaField";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../context/ToastContext";
import { timeAgo } from "../../utils/formatters";

const INITIAL_FEEDBACK = [
  {
    id: "f1",
    from: "ishaan.v@example.com",
    category: "Bug",
    message: "The resume upload button doesn't respond on Safari.",
    createdAt: "2026-07-08T09:00:00",
    status: "Open",
  },
  {
    id: "f2",
    from: "karan@nimbuscloud.io",
    category: "Feature request",
    message: "Would love bulk candidate messaging.",
    createdAt: "2026-07-07T14:00:00",
    status: "Open",
  },
  {
    id: "f3",
    from: "meera.k@example.com",
    category: "Praise",
    message: "Match scores are genuinely accurate — great work!",
    createdAt: "2026-07-05T11:00:00",
    status: "Archived",
  },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "Bug", label: "Bug" },
  { value: "Feature request", label: "Feature request" },
  { value: "Praise", label: "Praise" },
];

export default function FeedbackManagement() {
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    let result = feedback.filter((f) => f.status !== "Archived");
    if (query)
      result = result.filter(
        (f) =>
          f.message.toLowerCase().includes(query.toLowerCase()) ||
          f.from.toLowerCase().includes(query.toLowerCase()),
      );
    if (category) result = result.filter((f) => f.category === category);
    return result;
  }, [feedback, query, category]);

  const archive = (id) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "Archived" } : f)),
    );
    showToast("Feedback archived.", { type: "success" });
  };
  const remove = (id) => {
    setFeedback((prev) => prev.filter((f) => f.id !== id));
    showToast("Feedback deleted.", { type: "success" });
  };
  const sendReply = () => {
    showToast(`Reply sent to ${replyTarget.from}.`, { type: "success" });
    setReplyTarget(null);
    setReplyText("");
  };

  return (
    <div>
      <PageHeader
        title="Feedback Management"
        description="Review and respond to feedback submitted by users."
        breadcrumbs={[{ label: "Feedback Management" }]}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search feedback..."
          className="flex-1"
        />
        <SelectField
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-56"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={MessageSquare} title="No feedback found" />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((f) => (
            <Card key={f.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="Pending">{f.category}</Badge>
                    <span className="text-xs text-slate-400">
                      {timeAgo(f.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                    {f.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">from {f.from}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Reply}
                    aria-label="Reply"
                    onClick={() => setReplyTarget(f)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Archive}
                    aria-label="Archive"
                    onClick={() => archive(f.id)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    className="text-error!"
                    aria-label="Delete"
                    onClick={() => remove(f.id)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        title={`Reply to ${replyTarget?.from}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReplyTarget(null)}>
              Cancel
            </Button>
            <Button onClick={sendReply}>Send reply</Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            {replyTarget?.message}
          </p>
          <TextareaField
            label="Your reply"
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
