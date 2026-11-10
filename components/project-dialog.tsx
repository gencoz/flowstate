"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FolderPlus, X } from "lucide-react";
import type { ProjectDraft } from "@/lib/types";

type Props = { onClose: () => void; onCreate: (draft: ProjectDraft) => Promise<void> };
const colors = ["violet", "amber", "sky", "emerald"];
const colorClasses: Record<string, string> = { violet: "bg-violet-400", amber: "bg-amber-400", sky: "bg-sky-400", emerald: "bg-emerald-400" };

export function ProjectDialog({ onClose, onCreate }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("violet");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate({ name: name.trim(), description: description.trim() || "A focused space for related work.", color });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create the project.");
      setSaving(false);
    }
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">Workspace</p><h2 id="project-dialog-title" className="mt-1 font-display text-xl font-extrabold">Create a project</h2><p className="mt-1 text-xs text-slate-500">Group related tasks into a focused board.</p></div><button type="button" onClick={onClose} aria-label="Close project dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button></div><form onSubmit={submit}><label className="mt-6 block text-xs font-bold text-slate-700">Project name<input ref={nameRef} required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Mobile launch" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /></label><label className="mt-4 block text-xs font-bold text-slate-700">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this project trying to achieve?" className="mt-2 min-h-20 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /></label><fieldset className="mt-4"><legend className="text-xs font-bold text-slate-700">Color</legend><div className="mt-2 flex gap-2">{colors.map((option) => <label key={option} aria-label={option} className={`grid size-9 cursor-pointer place-items-center rounded-xl border-2 ${color === option ? "border-slate-900" : "border-transparent"}`}><input className="sr-only" type="radio" name="color" value={option} checked={color === option} onChange={() => setColor(option)} /><span className={`size-5 rounded-full ${colorClasses[option]}`} /></label>)}</div></fieldset>{error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" disabled={saving || !name.trim()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-50"><FolderPlus size={16} />{saving ? "Creating…" : "Create project"}</button></div></form></section></div>;
}
