"use client";

import { CalendarClock, GripVertical, MessageCircle, MoreHorizontal, Plus } from "lucide-react";
import { columns } from "@/lib/mock-data";
import { getDueDateMeta } from "@/lib/tasks/task-dates";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";

type BoardProps = {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onAddTask: () => void;
  onOpenTask: (task: Task) => void;
};

export function Board({ tasks, onMoveTask, onAddTask, onOpenTask }: BoardProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        return (
          <section
            key={column.id}
            className="min-w-0 rounded-2xl border border-slate-200/90 bg-slate-100/70 p-3.5"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const id = event.dataTransfer.getData("text/plain");
              if (id) onMoveTask(id, column.id);
            }}
          >
            <div className="mb-3 flex items-center gap-2 px-1 py-1">
              <span className={`size-2 rounded-full ${column.accent}`} />
              <h2 className="text-sm font-extrabold text-slate-800">{column.title}</h2>
              <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-slate-500 shadow-sm">{columnTasks.length}</span>
              <button className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700" aria-label={`More ${column.title} options`}><MoreHorizontal size={17} /></button>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => <TaskCard key={task.id} task={task} onMove={onMoveTask} onOpen={onOpenTask} />)}
              {columnTasks.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-400">No matching tasks</div>}
              <button onClick={onAddTask} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-violet-300 hover:bg-white hover:text-violet-600"><Plus size={16} /> Add task</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskCard({ task, onMove, onOpen }: { task: Task; onMove: (id: string, status: TaskStatus) => void; onOpen: (task: Task) => void }) {
  const dueDate = getDueDateMeta(task.dueDate);
  const dueClass = dueDate.state === "overdue" && task.status !== "done" ? "bg-rose-50 text-rose-700" : dueDate.state === "today" && task.status !== "done" ? "bg-amber-50 text-amber-700" : "text-slate-400";
  return (
    <article draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)} className="group cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/60 active:cursor-grabbing">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><PriorityDot priority={task.priority} /><span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{task.id}</span></div>
        <div className="flex items-center gap-1 text-slate-300"><GripVertical size={14} aria-hidden="true" /><select value={task.status} onChange={(event) => onMove(task.id, event.target.value as TaskStatus)} aria-label={`Move ${task.title}`} className="max-w-6 cursor-pointer appearance-none rounded-md bg-transparent text-transparent outline-none transition group-hover:bg-slate-50 focus:max-w-none focus:px-2 focus:text-xs focus:text-slate-600">
          {columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
        </select></div>
      </div>
      <h3 className="mt-3"><button onClick={() => onOpen(task)} className="text-left font-display text-[15px] font-extrabold leading-5 tracking-[-0.01em] text-slate-900 outline-none hover:text-violet-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-violet-400">{task.title}</button></h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{task.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">{task.tags.map((tag) => <span key={tag} className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">{tag}</span>)}</div>
      <div className="mt-5 flex items-center border-t border-slate-100 pt-3.5">
        <div className="flex -space-x-1.5">{task.assignees.map((person) => <span key={person.name} title={person.name} className={`grid size-7 place-items-center rounded-full border-2 border-white text-[8px] font-extrabold ${person.color}`}>{person.initials}</span>)}</div>
        <span className={`ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold ${dueClass}`}><CalendarClock size={12} />{dueDate.label}</span>
        <span className="ml-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400"><MessageCircle size={13} />{task.comments}</span>
      </div>
    </article>
  );
}

function PriorityDot({ priority }: { priority: TaskPriority }) {
  const color = priority === "high" ? "bg-rose-500" : priority === "medium" ? "bg-amber-400" : "bg-sky-400";
  return <span className={`size-1.5 rounded-full ${color}`} title={`${priority} priority`} />;
}
