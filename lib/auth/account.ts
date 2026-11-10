import type { User } from "@supabase/supabase-js";

export type Account = {
  id: string;
  email: string | null;
  isAnonymous: boolean;
};

export function toAccount(user: Pick<User, "id" | "email" | "is_anonymous">): Account {
  return {
    id: user.id,
    email: user.email ?? null,
    isAnonymous: user.is_anonymous ?? !user.email,
  };
}

export function getAccountLabel(account: Account | null): string {
  if (!account || account.isAnonymous) return "Guest";
  return account.email?.split("@")[0] || "Account";
}

export function getAccountInitials(account: Account | null): string {
  const label = getAccountLabel(account).replace(/[^a-z0-9]+/gi, " ").trim();
  if (!label) return "?";
  return label
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
