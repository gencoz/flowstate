import type { Task } from "@/lib/types";

export type RepositoryMode = "demo" | "supabase";

export interface TaskRepository {
  readonly mode: RepositoryMode;
  list(): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  remove(taskId: string): Promise<void>;
  reset?(): Promise<Task[]>;
}
