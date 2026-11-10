"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { AccountDialog } from "./account-dialog";
import { Board } from "./board";
import { ProjectDialog } from "./project-dialog";
import { TaskDialog } from "./task-dialog";
import { useAuthAccount } from "@/hooks/use-auth-account";
import { useProjects } from "@/hooks/use-projects";
import { initialTasks } from "@/lib/mock-data";
import { getAccountInitials, getAccountLabel } from "@/lib/auth/account";
import { filterTasks, getTaskTags } from "@/lib/tasks/task-filters";
import type { Task, TaskFilters } from "@/lib/types";
import { useTaskBoard } from "@/hooks/use-task-board";

type DialogState = { kind: "create" } | { kind: "edit"; task: Task } | null;

const defaultFilters: TaskFilters = { priority: "all", tag: "all" };

export function FlowstateApp() {
  const { tasks, loadState, error, mode, addTask, updateTask, moveTask, removeTask, resetDemo, clearError } = useTaskBoard();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogVersion, setDialogVersion] = useState(0);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const auth = useAuthAccount(mode === "supabase" && loadState !== "loading");
  const projectState = useProjects(loadState === "ready");

  const closeDialog = useCallback(() => setDialog(null), []);
  const projectTasks = useMemo(() => tasks.filter((task) => task.projectId === projectState.activeProjectId), [projectState.activeProjectId, tasks]);
  const visibleTasks = useMemo(() => filterTasks(projectTasks, query, filters), [filters, projectTasks, query]);
  const tags = useMemo(() => getTaskTags(projectTasks), [projectTasks]);
  const completed = projectTasks.filter((task) => task.status === "done").length;
  const inProgress = projectTasks.filter((task) => task.status === "in-progress").length;
  const completionRate = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
  const filtersActive = query.trim() || filters.priority !== "all" || filters.tag !== "all";

  function openCreateDialog() {
    setDialogVersion((version) => version + 1);
    setDialog({ kind: "create" });
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-[#11121a] px-4 py-5 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 text-white"><span className="grid size-9 place-items-center rounded-xl bg-violet-500 shadow-lg shadow-violet-500/20"><Sparkles size={18} /></span><span className="font-display text-lg font-extrabold tracking-tight">flowstate</span></div>
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="mt-9 space-y-1 text-sm font-medium" aria-label="Primary navigation">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" />
          <SidebarLink icon={<FolderKanban size={18} />} label="Projects" active />
          <SidebarLink icon={<Users size={18} />} label="Team" />
        </nav>
        <div className="mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">Workspace</div>
        <div className="mt-3 space-y-1">
          {projectState.projects.map((project) => <button key={project.id} onClick={() => projectState.setActiveProjectId(project.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${project.id === projectState.activeProjectId ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}><span className={`size-2 rounded-full ${projectColor(project.color)}`} /><span className="truncate">{project.name}</span></button>)}
          <button onClick={() => setProjectDialogOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Plus size={15} /> New project</button>
        </div>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white"><Sparkles size={14} className="text-violet-400" /> Portfolio demo</div>
          <p className="text-xs leading-5 text-slate-400">A complete product slice with typed state, persistence and tests.</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${completionRate}%` }} /></div>
        </div>
        <button className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/5 hover:text-white"><Settings size={18} /> Settings</button>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-7">
          <button className="rounded-xl border border-slate-200 p-2.5 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100" />
          </div>
          <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] sm:inline-flex ${mode === "supabase" ? "bg-emerald-100 text-emerald-700" : "bg-violet-100 text-violet-700"}`}>{mode === "supabase" ? "Live sync" : "Demo mode"}</span>
          <button className="relative ml-auto grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Notifications"><Bell size={18} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-500" /></button>
          {mode === "supabase" ? (
            <button onClick={() => setAccountDialogOpen(true)} className="flex items-center gap-2 rounded-xl p-1.5 text-sm font-semibold hover:bg-slate-50 sm:pr-2" aria-label="Open account settings">
              <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-xs text-white">{auth.state === "loading" ? "…" : getAccountInitials(auth.account)}</span>
              <span className="hidden max-w-28 truncate sm:block">{auth.state === "loading" ? "Loading" : getAccountLabel(auth.account)}</span>
              <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
            </button>
          ) : (
            <span className="hidden items-center gap-2 rounded-xl p-1.5 pr-2 text-sm font-semibold text-slate-500 sm:flex"><span className="grid size-8 place-items-center rounded-lg bg-slate-200"><UserRound size={15} /></span>Local demo</span>
          )}
        </header>

        <div className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500"><span>Projects</span><span>/</span><span className="text-slate-800">{projectState.activeProject?.name}</span></div>
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">{projectState.activeProject?.name ?? "Product roadmap"}</h1>
              <p className="mt-2 text-sm text-slate-500">{projectState.activeProject?.description ?? "Plan, prioritize and ship the next version together."}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden -space-x-2 sm:flex">{initialTasks.slice(0, 3).map((task) => <span key={task.id} title={task.assignees[0].name} className={`grid size-9 place-items-center rounded-full border-2 border-[#f6f7fb] text-[10px] font-bold ${task.assignees[0].color}`}>{task.assignees[0].initials}</span>)}<span className="grid size-9 place-items-center rounded-full border-2 border-[#f6f7fb] bg-white text-[10px] font-bold text-slate-500">+3</span></div>
              <button onClick={openCreateDialog} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:flex-none"><Plus size={17} /> Add task</button>
            </div>
          </section>

          <section className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Board summary">
            <MetricCard icon={<FolderKanban size={17} />} label="Total tasks" value={String(projectTasks.length)} detail="Across this project" />
            <MetricCard icon={<Clock3 size={17} />} label="In progress" value={String(inProgress)} detail="Currently active" accent="amber" />
            <MetricCard icon={<CheckCircle2 size={17} />} label="Completion" value={`${completionRate}%`} detail={`${completed} tasks shipped`} accent="emerald" />
          </section>

          <section className="my-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center" aria-label="Board filters">
            <span className="px-1 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">Filter</span>
            <FilterSelect label="Priority" value={filters.priority} onChange={(priority) => setFilters((current) => ({ ...current, priority: priority as TaskFilters["priority"] }))} options={["all", "high", "medium", "low"]} />
            <FilterSelect label="Tag" value={filters.tag} onChange={(tag) => setFilters((current) => ({ ...current, tag }))} options={["all", ...tags]} />
            <p className="text-xs text-slate-400 sm:ml-auto">Showing <strong className="text-slate-700">{visibleTasks.length}</strong> of {projectTasks.length}</p>
            {filtersActive && <button onClick={() => { setQuery(""); setFilters(defaultFilters); }} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-50"><X size={13} /> Clear</button>}
            {mode === "demo" && <button onClick={() => void resetDemo()} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100" title="Restore the original demo tasks"><RotateCcw size={13} /> Reset demo</button>}
          </section>

          {loadState === "loading" && <div className="mb-4 h-1 overflow-hidden rounded-full bg-violet-100"><div className="h-full w-1/3 animate-pulse rounded-full bg-violet-500" /></div>}
          <Board tasks={visibleTasks} onMoveTask={(id, status) => void moveTask(id, status)} onAddTask={openCreateDialog} onOpenTask={(task) => setDialog({ kind: "edit", task })} />
        </div>
      </main>

      {dialog && <TaskDialog key={dialog.kind === "edit" ? dialog.task.id : `new-${dialogVersion}`} task={dialog.kind === "edit" ? dialog.task : null} onClose={closeDialog} onCreate={(draft) => addTask(draft, projectState.activeProjectId)} onUpdate={updateTask} onDelete={removeTask} />}

      {accountDialogOpen && <AccountDialog account={auth.account} authError={auth.error} onClose={() => { auth.clearError(); setAccountDialogOpen(false); }} onLinkGuestEmail={auth.linkGuestEmail} onSendSignInLink={auth.sendSignInLink} onSignOut={auth.signOut} />}

      {projectDialogOpen && <ProjectDialog onClose={() => setProjectDialogOpen(false)} onCreate={projectState.addProject} />}

      {(error || projectState.error) && <div role="alert" className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border border-rose-200 bg-white p-4 text-sm text-slate-700 shadow-2xl"><AlertCircle className="mt-0.5 shrink-0 text-rose-500" size={18} /><div><strong className="text-slate-900">We couldn’t save that change.</strong><p className="mt-0.5 text-xs text-slate-500">{error || projectState.error}</p></div><button onClick={() => { clearError(); projectState.clearError(); }} aria-label="Dismiss error" className="ml-2 text-slate-400"><X size={16} /></button></div>}
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-violet-500/15 text-violet-300" : "hover:bg-white/5 hover:text-white"}`}>{icon}{label}{active && <span className="ml-auto size-1.5 rounded-full bg-violet-400" />}</button>;
}

function MetricCard({ icon, label, value, detail, accent = "violet" }: { icon: React.ReactNode; label: string; value: string; detail: string; accent?: "violet" | "amber" | "emerald" }) {
  const colors = { violet: "bg-violet-50 text-violet-600", amber: "bg-amber-50 text-amber-600", emerald: "bg-emerald-50 text-emerald-600" };
  return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className={`grid size-10 place-items-center rounded-xl ${colors[accent]}`}>{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p><div className="mt-0.5 flex items-baseline gap-2"><strong className="font-display text-xl font-extrabold">{value}</strong><span className="text-[11px] text-slate-400">{detail}</span></div></div></div>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold capitalize text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function projectColor(color: string): string {
  return { violet: "bg-violet-400", amber: "bg-amber-400", sky: "bg-sky-400", emerald: "bg-emerald-400" }[color] ?? "bg-slate-400";
}
