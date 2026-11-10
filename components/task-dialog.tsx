"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import type { Task, TaskDraft, TaskPriority, TaskStatus } from "@/lib/types";
import { toDateInputValue } from "@/lib/tasks/task-dates";

type Props = {
  task: Task | null;
  onClose: () => void;
  onCreate: (draft: TaskDraft) => Promise<void>;
  onUpdate: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
};

export function TaskDialog({ task, onClose, onCreate, onUpdate, onDelete }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "backlog");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [tags, setTags] = useState(task?.tags.join(", ") ?? "");
  const [dueDate, setDueDate] = useState(toDateInputValue(task?.dueDate ?? ""));
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    const draft: TaskDraft = {
      title: title.trim(),
      description: description.trim() || "No description yet.",
      status,
      priority,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dueDate: dueDate || "No date",
    };

    setSaving(true);
    if (task) await onUpdate({ ...task, ...draft });
    else await onCreate(draft);
    setSaving(false);
    onClose();
  }

  async function remove() {
    if (!task) return;
    setSaving(true);
    await onDelete(task.id);
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/50 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">
              {task ? task.id : "New task"}
            </p>
            <h2 id="task-dialog-title" className="mt-1 font-display text-xl font-extrabold">
              {task ? "Edit task" : "Create a task"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">Keep the task small, specific and easy to verify.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close dialog">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <label className="mt-6 block text-xs font-bold text-slate-700">
            Task name
            <input ref={titleRef} required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Improve mobile navigation" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </label>
          <label className="mt-4 block text-xs font-bold text-slate-700">
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does success look like?" className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SelectField label="Status" value={status} onChange={(value) => setStatus(value as TaskStatus)} options={["backlog", "in-progress", "done"]} />
            <SelectField label="Priority" value={priority} onChange={(value) => setPriority(value as TaskPriority)} options={["low", "medium", "high"]} />
            <label className="text-xs font-bold text-slate-700">
              Tags
              <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Frontend, UX" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </label>
            <label className="text-xs font-bold text-slate-700">
              Due date
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </label>
          </div>

          {confirmingDelete && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              <AlertTriangle className="mt-0.5 shrink-0" size={17} />
              <div><strong>Delete this task?</strong><p className="mt-0.5 text-xs text-rose-700">This action cannot be undone.</p></div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {task && !confirmingDelete && (
              <button type="button" onClick={() => setConfirmingDelete(true)} className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-rose-600 hover:bg-rose-50"><Trash2 size={16} /> Delete</button>
            )}
            {task && confirmingDelete && (
              <button type="button" disabled={saving} onClick={remove} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60">Confirm delete</button>
            )}
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={saving || !title.trim()} className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : task ? "Save changes" : "Create task"}</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-bold text-slate-700">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal capitalize outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100">
        {options.map((option) => <option key={option} value={option}>{option.replace("-", " ")}</option>)}
      </select>
    </label>
  );
}
