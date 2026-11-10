import type { ActivityAction, ActivityEvent, Task } from "@/lib/types";

export type RepositoryMode = "demo" | "supabase";

export interface TaskRepository {
  readonly mode: RepositoryMode;
  list(): Promise<Task[]>;
  listActivity(): Promise<ActivityEvent[]>;
  create(task: Task): Promise<Task>;
  update(task: Task, activityAction?: Extract<ActivityAction, "updated" | "moved">): Promise<Task>;
  remove(taskId: string): Promise<void>;
  reset?(): Promise<Task[]>;
}
