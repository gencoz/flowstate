import { describe, expect, it } from "vitest";
import { getDueDateMeta, matchesDueFilter, normalizeStoredDueDate, toDateInputValue } from "./task-dates";

const now = new Date(2026, 10, 10, 15, 30);

describe("task date helpers", () => {
  it("classifies ISO dates in local time", () => {
    expect(getDueDateMeta("2026-11-09", now).state).toBe("overdue");
    expect(getDueDateMeta("2026-11-10", now)).toMatchObject({ state: "today", label: "Today" });
    expect(getDueDateMeta("2026-11-14", now)).toMatchObject({ state: "upcoming", label: "Nov 14" });
  });

  it("handles missing and legacy values without crashing", () => {
    expect(getDueDateMeta("No date", now).state).toBe("none");
    expect(getDueDateMeta("Nov 14", now)).toMatchObject({ state: "invalid", label: "Nov 14" });
    expect(toDateInputValue("Nov 14")).toBe("");
    expect(normalizeStoredDueDate("Nov 14", now)).toBe("2026-11-14");
    expect(normalizeStoredDueDate("Today", now)).toBe("2026-11-10");
  });

  it("matches operational filters", () => {
    expect(matchesDueFilter("2026-11-09", "overdue", now)).toBe(true);
    expect(matchesDueFilter("2026-11-14", "today", now)).toBe(false);
  });
});
