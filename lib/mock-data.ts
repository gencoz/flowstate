import type { Assignee, Column, Project, Task } from "./types";

const people: Record<string, Assignee> = {
  maya: { name: "Maya Chen", initials: "MC", color: "bg-violet-200 text-violet-800" },
  noah: { name: "Noah Williams", initials: "NW", color: "bg-amber-200 text-amber-900" },
  sofia: { name: "Sofia Rossi", initials: "SR", color: "bg-sky-200 text-sky-900" },
};

export const columns: Column[] = [
  { id: "backlog", title: "Backlog", accent: "bg-slate-400" },
  { id: "in-progress", title: "In progress", accent: "bg-violet-500" },
  { id: "done", title: "Done", accent: "bg-emerald-500" },
];

export const initialProjects: Project[] = [
  { id: "flowstate-launch", name: "Flowstate launch", description: "Build and ship the portfolio-ready product.", color: "violet" },
  { id: "marketing-site", name: "Marketing site", description: "Plan the launch narrative and supporting content.", color: "amber" },
];

export const initialTasks: Task[] = [
  {
    id: "FS-24",
    projectId: "flowstate-launch",
    title: "Map the onboarding journey",
    description: "Turn research notes into a clear first-run experience.",
    status: "backlog",
    priority: "medium",
    tags: ["Research", "UX"],
    dueDate: "Nov 14",
    assignees: [people.maya, people.sofia],
    comments: 3,
  },
  {
    id: "FS-25",
    projectId: "flowstate-launch",
    title: "Draft empty states",
    description: "Create helpful copy and visuals for every empty view.",
    status: "backlog",
    priority: "low",
    tags: ["Design"],
    dueDate: "Nov 16",
    assignees: [people.sofia],
    comments: 1,
  },
  {
    id: "FS-18",
    projectId: "flowstate-launch",
    title: "Build command palette",
    description: "Let users jump between projects without leaving the keyboard.",
    status: "in-progress",
    priority: "high",
    tags: ["Frontend", "Feature"],
    dueDate: "Today",
    assignees: [people.noah, people.maya],
    comments: 8,
  },
  {
    id: "FS-21",
    projectId: "flowstate-launch",
    title: "Instrument product events",
    description: "Track activation steps and the weekly workflow loop.",
    status: "in-progress",
    priority: "medium",
    tags: ["Analytics"],
    dueDate: "Nov 13",
    assignees: [people.maya],
    comments: 4,
  },
  {
    id: "FS-12",
    projectId: "flowstate-launch",
    title: "Responsive board shell",
    description: "Make the workspace feel fast and natural on every screen.",
    status: "done",
    priority: "high",
    tags: ["Frontend"],
    dueDate: "Nov 7",
    assignees: [people.noah],
    comments: 6,
  },
  {
    id: "FS-15",
    projectId: "flowstate-launch",
    title: "Define design tokens",
    description: "Align spacing, color, type and elevation across the product.",
    status: "done",
    priority: "medium",
    tags: ["Design system"],
    dueDate: "Nov 8",
    assignees: [people.sofia, people.noah],
    comments: 2,
  },
];
