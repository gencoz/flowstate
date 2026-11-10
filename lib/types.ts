export const taskStatuses = ["backlog", "in-progress", "done"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = "low" | "medium" | "high";

export type Assignee = {
  name: string;
  initials: string;
  color: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  dueDate: string;
  assignees: Assignee[];
  comments: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type ProjectDraft = Pick<Project, "name" | "description" | "color">;

export type TaskDraft = Pick<
  Task,
  "title" | "description" | "status" | "priority" | "tags" | "dueDate"
>;

export type TaskFilters = {
  priority: TaskPriority | "all";
  tag: string | "all";
  due?: "all" | "overdue" | "today" | "upcoming" | "none";
};

export type Column = {
  id: TaskStatus;
  title: string;
  accent: string;
};
