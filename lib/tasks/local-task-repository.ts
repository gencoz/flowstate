import type { ActivityAction, ActivityEvent, Task } from "@/lib/types";
import { normalizeStoredDueDate } from "./task-dates";
import type { TaskRepository } from "./task-repository";

const STORAGE_KEY = "flowstate.tasks.v2";
const ACTIVITY_KEY = "flowstate.activity.v1";

export class LocalTaskRepository implements TaskRepository {
  readonly mode = "demo" as const;

  constructor(
    private readonly storage: Storage,
    private readonly seed: Task[],
  ) {}

  async list(): Promise<Task[]> {
    const saved = this.storage.getItem(STORAGE_KEY);
    if (!saved) {
      this.write(this.seed);
      return this.seed;
    }

    try {
      return (JSON.parse(saved) as Task[]).map((task) => ({
        ...task,
        projectId: task.projectId || "flowstate-launch",
        dueDate: normalizeStoredDueDate(task.dueDate),
      }));
    } catch {
      this.write(this.seed);
      return this.seed;
    }
  }

  async create(task: Task): Promise<Task> {
    const tasks = await this.list();
    this.write([task, ...tasks]);
    this.addActivity(task, "created");
    return task;
  }

  async update(task: Task, activityAction: Extract<ActivityAction, "updated" | "moved"> = "updated"): Promise<Task> {
    const tasks = await this.list();
    this.write(tasks.map((current) => (current.id === task.id ? task : current)));
    this.addActivity(task, activityAction);
    return task;
  }

  async remove(taskId: string): Promise<void> {
    const tasks = await this.list();
    const task = tasks.find((item) => item.id === taskId);
    this.write(tasks.filter((task) => task.id !== taskId));
    if (task) this.addActivity(task, "deleted");
  }

  async listActivity(): Promise<ActivityEvent[]> {
    try {
      return JSON.parse(this.storage.getItem(ACTIVITY_KEY) ?? "[]") as ActivityEvent[];
    } catch {
      return [];
    }
  }

  async reset(): Promise<Task[]> {
    this.write(this.seed);
    return this.seed;
  }

  private write(tasks: Task[]) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  private addActivity(task: Task, action: ActivityAction) {
    const events = (() => { try { return JSON.parse(this.storage.getItem(ACTIVITY_KEY) ?? "[]") as ActivityEvent[]; } catch { return []; } })();
    events.unshift({ id: crypto.randomUUID(), projectId: task.projectId, taskId: task.id, taskTitle: task.title, action, createdAt: new Date().toISOString() });
    this.storage.setItem(ACTIVITY_KEY, JSON.stringify(events.slice(0, 50)));
  }
}
