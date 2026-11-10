import { describe, expect, it } from "vitest";
import { getAccountInitials, getAccountLabel, toAccount } from "./account";

describe("account presentation", () => {
  it("presents anonymous sessions as guests", () => {
    const account = toAccount({ id: "guest-1", is_anonymous: true });

    expect(account).toEqual({ id: "guest-1", email: null, isAnonymous: true });
    expect(getAccountLabel(account)).toBe("Guest");
    expect(getAccountInitials(account)).toBe("G");
  });

  it("uses the email name for permanent accounts", () => {
    const account = toAccount({ id: "user-1", email: "alex.rivera@example.com", is_anonymous: false });

    expect(getAccountLabel(account)).toBe("alex.rivera");
    expect(getAccountInitials(account)).toBe("AR");
  });
});
