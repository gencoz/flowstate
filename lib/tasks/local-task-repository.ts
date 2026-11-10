import type { Task } from "@/lib/types";
import type { TaskRepository } from "./task-repository";

const STORAGE_KEY = "flowstate.tasks.v2";

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
      }));
    } catch {
      this.write(this.seed);
      return this.seed;
    }
  }

  async create(task: Task): Promise<Task> {
    const tasks = await this.list();
    this.write([task, ...tasks]);
    return task;
  }

  async update(task: Task): Promise<Task> {
    const tasks = await this.list();
    this.write(tasks.map((current) => (current.id === task.id ? task : current)));
    return task;
  }

  async remove(taskId: string): Promise<void> {
    const tasks = await this.list();
    this.write(tasks.filter((task) => task.id !== taskId));
  }

  async reset(): Promise<Task[]> {
    this.write(this.seed);
    return this.seed;
  }

  private write(tasks: Task[]) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
