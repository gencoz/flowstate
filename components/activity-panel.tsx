"use client";

import { Activity, CheckCircle2, Edit3, MoveRight, PlusCircle, Trash2, X } from "lucide-react";
import type { ActivityAction, ActivityEvent } from "@/lib/types";

type Props = { events: ActivityEvent[]; projectId: string; onClose: () => void };

const actionDetails: Record<ActivityAction, { label: string; icon: typeof Activity; color: string }> = {
  created: { label: "created", icon: PlusCircle, color: "bg-emerald-50 text-emerald-600" },
  updated: { label: "updated", icon: Edit3, color: "bg-sky-50 text-sky-600" },
  moved: { label: "moved", icon: MoveRight, color: "bg-violet-50 text-violet-600" },
  deleted: { label: "deleted", icon: Trash2, color: "bg-rose-50 text-rose-600" },
};

export function ActivityPanel({ events, projectId, onClose }: Props) {
  const visibleEvents = events.filter((event) => event.projectId === projectId);
  return <aside role="dialog" aria-modal="true" aria-labelledby="activity-title" className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-slate-200 bg-white p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">Project history</p><h2 id="activity-title" className="mt-1 font-display text-xl font-extrabold">Recent activity</h2></div><button onClick={onClose} aria-label="Close activity" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button></div><div className="mt-6 space-y-3">{visibleEvents.map((event) => { const detail = actionDetails[event.action]; const Icon = detail.icon; return <article key={event.id} className="flex gap-3 rounded-xl border border-slate-100 p-3"><span className={`grid size-9 shrink-0 place-items-center rounded-xl ${detail.color}`}><Icon size={16} /></span><div className="min-w-0"><p className="text-sm text-slate-700"><strong className="text-slate-950">{event.taskTitle}</strong> was {detail.label}</p><p className="mt-1 text-[11px] text-slate-400">{formatActivityTime(event.createdAt)}</p></div></article>; })}{visibleEvents.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center"><CheckCircle2 className="mx-auto text-slate-300" size={26} /><p className="mt-3 text-sm font-bold text-slate-600">No activity yet</p><p className="mt-1 text-xs leading-5 text-slate-400">Create or update a task to start the project history.</p></div>}</div></aside>;
}

function formatActivityTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}
