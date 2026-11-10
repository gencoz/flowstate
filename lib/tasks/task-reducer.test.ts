import { describe, expect, it } from "vitest";
import { initialTasks } from "@/lib/mock-data";
import { taskReducer } from "./task-reducer";

describe("taskReducer", () => {
  it("adds a task at the beginning of the board", () => {
    const task = { ...initialTasks[0], id: "FS-99", title: "New task" };
    const result = taskReducer(initialTasks, { type: "add", task });
    expect(result[0]).toEqual(task);
    expect(result).toHaveLength(initialTasks.length + 1);
  });

  it("updates only the selected task", () => {
    const task = { ...initialTasks[0], status: "done" as const };
    const result = taskReducer(initialTasks, { type: "update", task });
    expect(result.find((item) => item.id === task.id)?.status).toBe("done");
    expect(result.find((item) => item.id !== task.id)).toEqual(initialTasks.find((item) => item.id !== task.id));
  });

  it("removes a task without mutating the original array", () => {
    const result = taskReducer(initialTasks, { type: "remove", taskId: initialTasks[0].id });
    expect(result.some((task) => task.id === initialTasks[0].id)).toBe(false);
    expect(initialTasks).toHaveLength(6);
  });
});
