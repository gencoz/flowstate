import type { Task, TaskFilters } from "@/lib/types";

export function filterTasks(tasks: Task[], query: string, filters: TaskFilters): Task[] {
  const normalizedQuery = query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesQuery =
      !normalizedQuery ||
      [task.title, task.description, task.id, ...task.tags].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
    const matchesTag = filters.tag === "all" || task.tags.includes(filters.tag);

    return matchesQuery && matchesPriority && matchesTag;
  });
}

export function getTaskTags(tasks: Task[]): string[] {
  return [...new Set(tasks.flatMap((task) => task.tags))].sort((a, b) => a.localeCompare(b));
}
