import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccountDialog } from "./account-dialog";

describe("AccountDialog", () => {
  it("links a guest board to an email", async () => {
    const user = userEvent.setup();
    const linkGuestEmail = vi.fn().mockResolvedValue(undefined);

    render(<AccountDialog account={{ id: "guest-1", email: null, isAnonymous: true }} authError={null} onClose={vi.fn()} onLinkGuestEmail={linkGuestEmail} onSendSignInLink={vi.fn()} onSignOut={vi.fn()} />);

    await user.type(screen.getByLabelText("Email address"), "alex@example.com");
    await user.click(screen.getByRole("button", { name: "Save with email" }));

    await waitFor(() => expect(linkGuestEmail).toHaveBeenCalledWith("alex@example.com"));
    expect(screen.getByRole("status")).toHaveTextContent("Confirmation sent");
  });

  it("shows permanent account details and sign out", async () => {
    const user = userEvent.setup();
    const signOut = vi.fn().mockResolvedValue(undefined);

    render(<AccountDialog account={{ id: "user-1", email: "alex@example.com", isAnonymous: false }} authError={null} onClose={vi.fn()} onLinkGuestEmail={vi.fn()} onSendSignInLink={vi.fn()} onSignOut={signOut} />);

    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
  });
});
