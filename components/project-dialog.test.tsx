import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProjectDialog } from "./project-dialog";

describe("ProjectDialog", () => {
  it("creates a project from the form", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);
    render(<ProjectDialog onClose={vi.fn()} onCreate={onCreate} />);

    await user.type(screen.getByLabelText("Project name"), "Mobile launch");
    await user.type(screen.getByLabelText("Description"), "Ship the first mobile workflow");
    await user.click(screen.getByRole("radio", { name: "sky" }));
    await user.click(screen.getByRole("button", { name: "Create project" }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({
      name: "Mobile launch",
      description: "Ship the first mobile workflow",
      color: "sky",
    }));
  });
});
