import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActivityPanel } from "./activity-panel";

describe("ActivityPanel", () => {
  it("shows only events from the selected project", () => {
    render(<ActivityPanel projectId="project-a" onClose={vi.fn()} events={[
      { id: "1", projectId: "project-a", taskId: "FS-1", taskTitle: "Launch board", action: "created", createdAt: "2026-11-10T10:00:00Z" },
      { id: "2", projectId: "project-b", taskId: "FS-2", taskTitle: "Hidden task", action: "updated", createdAt: "2026-11-10T11:00:00Z" },
    ]} />);

    expect(screen.getByText("Launch board")).toBeInTheDocument();
    expect(screen.queryByText("Hidden task")).not.toBeInTheDocument();
  });
});
