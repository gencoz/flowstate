import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskDialog } from "./task-dialog";

describe("TaskDialog", () => {
  it("creates a typed task draft from the form", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<TaskDialog task={null} onClose={vi.fn()} onCreate={onCreate} onUpdate={vi.fn()} onDelete={vi.fn()} />);

    await user.type(screen.getByLabelText("Task name"), "Add keyboard shortcuts");
    await user.type(screen.getByLabelText("Description"), "Speed up navigation for power users");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    await user.type(screen.getByLabelText("Tags"), "Frontend, Accessibility");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({
      title: "Add keyboard shortcuts",
      priority: "high",
      tags: ["Frontend", "Accessibility"],
    }));
  });
});
