import type { Project } from "@/lib/types";
import type { ProjectRepository } from "./project-repository";

const STORAGE_KEY = "flowstate.projects.v1";

export class LocalProjectRepository implements ProjectRepository {
  readonly mode = "demo" as const;

  constructor(private readonly storage: Storage, private readonly seed: Project[]) {}

  async list(): Promise<Project[]> {
    const saved = this.storage.getItem(STORAGE_KEY);
    if (!saved) {
      this.write(this.seed);
      return this.seed;
    }
    try {
      return JSON.parse(saved) as Project[];
    } catch {
      this.write(this.seed);
      return this.seed;
    }
  }

  async create(project: Project): Promise<Project> {
    const projects = await this.list();
    this.write([...projects, project]);
    return project;
  }

  private write(projects: Project[]) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}
