import { describe, expect, it } from "vitest";
import { initialTasks } from "@/lib/mock-data";
import { filterTasks, getTaskTags } from "./task-filters";

describe("filterTasks", () => {
  it("searches across title, description, id and tags", () => {
    expect(filterTasks(initialTasks, "command palette", { priority: "all", tag: "all" })).toHaveLength(1);
    expect(filterTasks(initialTasks, "FS-12", { priority: "all", tag: "all" })[0].id).toBe("FS-12");
    expect(filterTasks(initialTasks, "analytics", { priority: "all", tag: "all" })[0].id).toBe("FS-21");
  });

  it("combines priority and tag filters", () => {
    const result = filterTasks(initialTasks, "", { priority: "high", tag: "Frontend" });
    expect(result.map((task) => task.id)).toEqual(["FS-18", "FS-12"]);
  });

  it("returns unique sorted tags for the filter UI", () => {
    const tags = getTaskTags(initialTasks);
    expect(tags).toEqual([...tags].sort((a, b) => a.localeCompare(b)));
    expect(new Set(tags).size).toBe(tags.length);
  });
});
