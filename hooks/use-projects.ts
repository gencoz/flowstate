"use client";

import { useEffect, useRef, useState } from "react";
import { initialProjects } from "@/lib/mock-data";
import { createProjectId } from "@/lib/projects/project-id";
import { createProjectRepository } from "@/lib/projects/create-project-repository";
import type { ProjectRepository } from "@/lib/projects/project-repository";
import type { Project, ProjectDraft } from "@/lib/types";

const ACTIVE_PROJECT_KEY = "flowstate.active-project.v1";

export function useProjects(enabled: boolean) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProjectId, setActiveProjectIdState] = useState(initialProjects[0].id);
  const [error, setError] = useState<string | null>(null);
  const repositoryRef = useRef<ProjectRepository | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const repository = createProjectRepository(window.localStorage, initialProjects);
    repositoryRef.current = repository;
    repository.list().then((savedProjects) => {
      if (!active) return;
      const nextProjects = savedProjects.length ? savedProjects : initialProjects;
      setProjects(nextProjects);
      const savedId = window.localStorage.getItem(ACTIVE_PROJECT_KEY);
      setActiveProjectIdState(nextProjects.some((project) => project.id === savedId) ? savedId! : nextProjects[0].id);
    }).catch((cause: unknown) => {
      if (!active) return;
      setError(cause instanceof Error ? cause.message : "Unable to load projects.");
    });
    return () => { active = false; };
  }, [enabled]);

  function setActiveProjectId(projectId: string) {
    setActiveProjectIdState(projectId);
    window.localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
  }

  async function addProject(draft: ProjectDraft) {
    const project: Project = { ...draft, id: createProjectId(draft.name, projects.map((item) => item.id)) };
    setError(null);
    try {
      await repositoryRef.current?.create(project);
      setProjects((current) => [...current, project]);
      setActiveProjectId(project.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create the project.");
      throw cause;
    }
  }

  return { projects, activeProjectId, activeProject: projects.find((project) => project.id === activeProjectId) ?? projects[0], error, setActiveProjectId, addProject, clearError: () => setError(null) };
}
