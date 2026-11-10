"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { initialTasks } from "@/lib/mock-data";
import type { Task, TaskDraft, TaskStatus } from "@/lib/types";
import { createTaskRepository } from "@/lib/tasks/create-task-repository";
import { taskReducer } from "@/lib/tasks/task-reducer";
import type { RepositoryMode, TaskRepository } from "@/lib/tasks/task-repository";

type LoadState = "loading" | "ready" | "error";

export function useTaskBoard() {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<RepositoryMode>("demo");
  const repositoryRef = useRef<TaskRepository | null>(null);

  useEffect(() => {
    let cancelled = false;
    const repository = createTaskRepository(window.localStorage, initialTasks);
    repositoryRef.current = repository;

    repository
      .list()
      .then((savedTasks) => {
        if (cancelled) return;
        dispatch({ type: "replace", tasks: savedTasks });
        setMode(repository.mode);
        setLoadState("ready");
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(toMessage(cause));
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function addTask(draft: TaskDraft) {
    const task: Task = {
      ...draft,
      id: getNextTaskId(tasks),
      assignees: [{ name: "Alex Rivera", initials: "AR", color: "bg-slate-200 text-slate-800" }],
      comments: 0,
    };
    await commit({ type: "add", task }, () => repositoryRef.current?.create(task));
  }

  async function updateTask(task: Task) {
    await commit({ type: "update", task }, () => repositoryRef.current?.update(task));
  }

  async function moveTask(taskId: string, status: TaskStatus) {
    const task = tasks.find((current) => current.id === taskId);
    if (task) await updateTask({ ...task, status });
  }

  async function removeTask(taskId: string) {
    await commit({ type: "remove", taskId }, () => repositoryRef.current?.remove(taskId));
  }

  async function resetDemo() {
    const reset = repositoryRef.current?.reset;
    if (!reset) return;
    const resetTasks = await reset.call(repositoryRef.current);
    dispatch({ type: "replace", tasks: resetTasks });
  }

  async function commit(
    action: Parameters<typeof taskReducer>[1],
    persist: () => Promise<unknown> | undefined,
  ) {
    const previousTasks = tasks;
    setError(null);
    dispatch(action);
    try {
      await persist();
    } catch (cause) {
      dispatch({ type: "replace", tasks: previousTasks });
      setError(toMessage(cause));
    }
  }

  return {
    tasks,
    loadState,
    error,
    mode,
    addTask,
    updateTask,
    moveTask,
    removeTask,
    resetDemo,
    clearError: () => setError(null),
  };
}

function toMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : "Something went wrong. Please try again.";
}

function getNextTaskId(tasks: Task[]): string {
  const highestId = Math.max(
    0,
    ...tasks.map((task) => Number.parseInt(task.id.replace("FS-", ""), 10) || 0),
  );
  return `FS-${highestId + 1}`;
}
