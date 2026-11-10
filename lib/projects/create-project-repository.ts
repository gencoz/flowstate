import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { LocalProjectRepository } from "./local-project-repository";
import type { ProjectRepository } from "./project-repository";
import { SupabaseProjectRepository } from "./supabase-project-repository";

export function createProjectRepository(storage: Storage, seed: Project[]): ProjectRepository {
  const wantsSupabase = process.env.NEXT_PUBLIC_DATA_MODE === "supabase";
  const hasCredentials = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return wantsSupabase && hasCredentials
    ? new SupabaseProjectRepository(createClient(), seed)
    : new LocalProjectRepository(storage, seed);
}
