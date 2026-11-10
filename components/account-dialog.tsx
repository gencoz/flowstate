"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LogIn, Mail, ShieldCheck, X } from "lucide-react";
import type { Account } from "@/lib/auth/account";

type Props = {
  account: Account | null;
  authError: string | null;
  onClose: () => void;
  onLinkGuestEmail: (email: string) => Promise<void>;
  onSendSignInLink: (email: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

type FormMode = "upgrade" | "signin";

export function AccountDialog({ account, authError, onClose, onLinkGuestEmail, onSendSignInLink, onSignOut }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<FormMode>("upgrade");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const isPermanent = Boolean(account && !account.isAnonymous);

  useEffect(() => {
    if (!isPermanent) inputRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isPermanent, onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setPending(true);
    setSent(false);
    setLocalError(null);
    try {
      if (mode === "upgrade") await onLinkGuestEmail(email.trim());
      else await onSendSignInLink(email.trim());
      setSent(true);
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : "Unable to send the email. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function signOut() {
    setPending(true);
    setLocalError(null);
    try {
      await onSignOut();
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : "Unable to sign out.");
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" className="w-full max-w-md rounded-2xl border border-white/50 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">Account</p>
            <h2 id="account-dialog-title" className="mt-1 font-display text-xl font-extrabold">{isPermanent ? "Your Flowstate account" : "Keep your board"}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{isPermanent ? "Your session can be restored on another visit." : "The demo stays instant, while an email can make this workspace recoverable."}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close account dialog"><X size={19} /></button>
        </div>

        {isPermanent ? (
          <div className="mt-6">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={20} />
              <div><strong className="text-sm text-emerald-950">Permanent account</strong><p className="mt-1 break-all text-xs text-emerald-800">{account?.email}</p></div>
            </div>
            {(localError || authError) && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{localError || authError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100">Close</button>
              <button type="button" disabled={pending} onClick={() => void signOut()} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{pending ? "Signing out…" : "Sign out"}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button type="button" onClick={() => { setMode("upgrade"); setSent(false); setLocalError(null); }} className={`rounded-lg px-3 py-2.5 ${mode === "upgrade" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Save guest board</button>
              <button type="button" onClick={() => { setMode("signin"); setSent(false); setLocalError(null); }} className={`rounded-lg px-3 py-2.5 ${mode === "signin" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Existing account</button>
            </div>

            <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/70 p-3 text-xs leading-5 text-violet-900">
              {mode === "upgrade" ? "Linking a new email keeps the same user ID, so the tasks already on this guest board stay with you." : "Signing in opens the board already connected to that email. Unsaved guest tasks are not merged."}
            </div>

            <form onSubmit={submit}>
              <label className="mt-4 block text-xs font-bold text-slate-700">Email address
                <div className="relative mt-2"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input ref={inputRef} type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm font-normal outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /></div>
              </label>

              {sent && <div role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={16} /><span>{mode === "upgrade" ? "Confirmation sent. Open the email on this device to keep the current board." : "Magic link sent. Open it on this device to sign in."}</span></div>}
              {(localError || authError) && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{localError || authError}</p>}

              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={pending || !email.trim()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"><LogIn size={16} />{pending ? "Sending…" : mode === "upgrade" ? "Save with email" : "Send magic link"}</button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
