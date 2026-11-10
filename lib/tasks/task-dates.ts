export type DueFilter = "all" | "overdue" | "today" | "upcoming" | "none";
export type DueState = Exclude<DueFilter, "all"> | "invalid";

export type DueDateMeta = {
  state: DueState;
  label: string;
  isoDate: string | null;
};

export function getDueDateMeta(value: string, now = new Date()): DueDateMeta {
  if (!value || value === "No date") return { state: "none", label: "No date", isoDate: null };
  if (value === "Today") return { state: "today", label: "Today", isoDate: toLocalIsoDate(now) };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return { state: "invalid", label: value, isoDate: null };

  const due = parseLocalDate(value);
  if (!due) return { state: "invalid", label: value, isoDate: null };
  const today = parseLocalDate(toLocalIsoDate(now))!;
  const state: DueState = due.getTime() < today.getTime() ? "overdue" : due.getTime() === today.getTime() ? "today" : "upcoming";
  const label = state === "today" ? "Today" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(due);
  return { state, label, isoDate: value };
}

export function matchesDueFilter(value: string, filter: DueFilter, now = new Date()): boolean {
  if (filter === "all") return true;
  return getDueDateMeta(value, now).state === filter;
}

export function toDateInputValue(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

export function normalizeStoredDueDate(value: string, now = new Date()): string {
  if (!value || value === "No date" || /^\d{4}-\d{2}-\d{2}$/.test(value)) return value || "No date";
  if (value === "Today") return toLocalIsoDate(now);
  const match = value.match(/^([A-Z][a-z]{2})\s(\d{1,2})$/);
  if (!match) return value;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[1]);
  if (month < 0) return value;
  const candidate = new Date(now.getFullYear(), month, Number(match[2]));
  return candidate.getMonth() === month ? toLocalIsoDate(candidate) : value;
}

function parseLocalDate(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
