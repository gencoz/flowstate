import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import { LocalTaskRepository } from "./local-task-repository";
import { SupabaseTaskRepository } from "./supabase-task-repository";
import type { TaskRepository } from "./task-repository";

export function createTaskRepository(storage: Storage, seed: Task[]): TaskRepository {
  const wantsSupabase = process.env.NEXT_PUBLIC_DATA_MODE === "supabase";
  const hasCredentials = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (wantsSupabase && hasCredentials) {
    return new SupabaseTaskRepository(createClient());
  }

  return new LocalTaskRepository(storage, seed);
}
