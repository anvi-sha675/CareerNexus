import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import EmptyState from "../common/EmptyState";
import TextField from "../forms/TextField";
import TextareaField from "../forms/TextareaField";
import SelectField from "../forms/SelectField";

export default function SectionEditor({
  title,
  description,
  emptyLabel,
  addLabel = "Add",
  fields,
  entries,
  onChange,
  renderItem,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(
      Object.fromEntries(fields.map((f) => [f.name, f.defaultValue || ""])),
    );
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditingId(entry.id);
    setForm(entry);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      onChange(
        entries.map((e) =>
          e.id === editingId ? { ...form, id: editingId } : e,
        ),
      );
    } else {
      onChange([{ ...form, id: `${Date.now()}` }, ...entries]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    onChange(entries.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <Button size="sm" icon={Plus} onClick={openAdd}>
          {addLabel}
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title={emptyLabel || "Nothing added yet"}
          description="Click the button above to add your first entry."
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
            >
              <div className="min-w-0 flex-1">{renderItem(entry)}</div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Pencil}
                  aria-label={`Edit ${entry.title || entry.name || "entry"}`}
                  onClick={() => openEdit(entry)}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  className="text-error!"
                  aria-label={`Delete ${entry.title || entry.name || "entry"}`}
                  onClick={() => setDeleteTarget(entry)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingId
            ? `Edit ${title.replace(/s$/, "")}`
            : `Add ${title.replace(/s$/, "")}`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          {fields.map((field) => {
            const commonProps = {
              label: field.label,
              required: field.required,
              value: form[field.name] ?? "",
              onChange: (e) =>
                setForm((f) => ({ ...f, [field.name]: e.target.value })),
            };
            if (field.type === "textarea")
              return (
                <TextareaField key={field.name} {...commonProps} rows={3} />
              );
            if (field.type === "select")
              return (
                <SelectField
                  key={field.name}
                  {...commonProps}
                  options={field.options}
                  placeholder={field.placeholder}
                />
              );
            return (
              <TextField
                key={field.name}
                {...commonProps}
                type={field.inputType || "text"}
                placeholder={field.placeholder}
              />
            );
          })}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove this entry?"
        description="This will remove it from your profile. You can always add it back later."
        confirmLabel="Remove"
      />
    </Card>
  );
}
