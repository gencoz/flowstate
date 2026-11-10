import type { Project } from "@/lib/types";
import type { RepositoryMode } from "@/lib/tasks/task-repository";

export interface ProjectRepository {
  readonly mode: RepositoryMode;
  list(): Promise<Project[]>;
  create(project: Project): Promise<Project>;
}
