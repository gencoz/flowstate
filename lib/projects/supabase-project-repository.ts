import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/types";
import type { ProjectRepository } from "./project-repository";

type ProjectRow = Project & { user_id: string; created_at: string; updated_at: string };

export class SupabaseProjectRepository implements ProjectRepository {
  readonly mode = "supabase" as const;

  constructor(private readonly client: SupabaseClient, private readonly seed: Project[]) {}

  async list(): Promise<Project[]> {
    const userId = await this.ensureUser();
    const { data, error } = await this.client.from("projects").select("*").order("created_at");
    if (error) throw error;
    if (data?.length) return (data as ProjectRow[]).map(fromRow);

    const { data: seeded, error: seedError } = await this.client
      .from("projects")
      .upsert(this.seed.map((project) => ({ ...project, user_id: userId })))
      .select("*");
    if (seedError) throw seedError;
    return ((seeded ?? []) as ProjectRow[]).map(fromRow);
  }

  async create(project: Project): Promise<Project> {
    const userId = await this.ensureUser();
    const { data, error } = await this.client.from("projects").insert({ ...project, user_id: userId }).select("*").single();
    if (error) throw error;
    return fromRow(data as ProjectRow);
  }

  private async ensureUser(): Promise<string> {
    const { data, error } = await this.client.auth.getSession();
    if (error || !data.session?.user) throw error ?? new Error("No active user session.");
    return data.session.user.id;
  }
}

function fromRow(row: ProjectRow): Project {
  return { id: row.id, name: row.name, description: row.description, color: row.color };
}
