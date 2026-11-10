import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityAction, ActivityEvent, Assignee, Task, TaskPriority, TaskStatus } from "@/lib/types";
import type { TaskRepository } from "./task-repository";
import { normalizeStoredDueDate } from "./task-dates";

type TaskRow = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  due_date: string;
  assignees: Assignee[];
  comments: number;
  created_at: string;
  updated_at: string;
};

export class SupabaseTaskRepository implements TaskRepository {
  readonly mode = "supabase" as const;

  constructor(private readonly client: SupabaseClient) {}

  async list(): Promise<Task[]> {
    await this.ensureUser();
    const { data, error } = await this.client.from("tasks").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as TaskRow[]).map(fromRow);
  }

  async listActivity(): Promise<ActivityEvent[]> {
    await this.ensureUser();
    const { data, error } = await this.client.from("activity_events").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, projectId: row.project_id, taskId: row.task_id, taskTitle: row.task_title, action: row.action, createdAt: row.created_at })) as ActivityEvent[];
  }

  async create(task: Task): Promise<Task> {
    const userId = await this.ensureUser();
    const { data, error } = await this.client.from("tasks").insert(toRow(task, userId)).select("*").single();
    if (error) throw error;
    await this.addActivity(task, "created", userId);
    return fromRow(data as TaskRow);
  }

  async update(task: Task, activityAction: Extract<ActivityAction, "updated" | "moved"> = "updated"): Promise<Task> {
    const userId = await this.ensureUser();
    const { data, error } = await this.client
      .from("tasks")
      .update(toRow(task, userId))
      .eq("id", task.id)
      .select("*")
      .single();
    if (error) throw error;
    await this.addActivity(task, activityAction, userId);
    return fromRow(data as TaskRow);
  }

  async remove(taskId: string): Promise<void> {
    const userId = await this.ensureUser();
    const { data: taskData } = await this.client.from("tasks").select("id,title,project_id").eq("id", taskId).single();
    const { error } = await this.client.from("tasks").delete().eq("id", taskId);
    if (error) throw error;
    if (taskData) await this.addActivity({ id: taskData.id, title: taskData.title, projectId: taskData.project_id } as Task, "deleted", userId);
  }

  private async addActivity(task: Pick<Task, "id" | "title" | "projectId">, action: ActivityAction, userId: string) {
    const { error } = await this.client.from("activity_events").insert({ user_id: userId, project_id: task.projectId, task_id: task.id, task_title: task.title, action });
    if (error) throw error;
  }

  private async ensureUser(): Promise<string> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    if (data.session?.user) return data.session.user.id;

    const { data: signInData, error: signInError } = await this.client.auth.signInAnonymously();
    if (signInError || !signInData.user) throw signInError ?? new Error("Unable to create an anonymous session.");
    return signInData.user.id;
  }
}

function fromRow(row: TaskRow): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    tags: row.tags,
    dueDate: normalizeStoredDueDate(row.due_date),
    assignees: row.assignees,
    comments: row.comments,
  };
}

function toRow(task: Task, userId: string): Omit<TaskRow, "created_at" | "updated_at"> {
  return {
    id: task.id,
    project_id: task.projectId,
    user_id: userId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    tags: task.tags,
    due_date: task.dueDate,
    assignees: task.assignees,
    comments: task.comments,
  };
}
