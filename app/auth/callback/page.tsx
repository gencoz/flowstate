"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type CallbackState = "loading" | "success" | "error";

export default function AuthCallbackPage() {
  const [state, setState] = useState<CallbackState>("loading");
  const [message, setMessage] = useState("Completing your secure sign-in…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const flowId = params.get("sb_flow_id");

    if (!code) {
      queueMicrotask(() => {
        setState("error");
        setMessage("This sign-in link is invalid or has expired. Return to Flowstate and request a new one.");
      });
      return;
    }

    createClient().auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined).then(({ error }) => {
      if (error) {
        setState("error");
        setMessage(error.message);
        return;
      }
      setState("success");
      setMessage("You are signed in. Opening your board…");
      window.setTimeout(() => window.location.replace("/"), 700);
    });
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7fb] p-4 text-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-100 text-violet-700">
          {state === "loading" && <LoaderCircle className="animate-spin" size={26} />}
          {state === "success" && <CheckCircle2 size={26} />}
          {state === "error" && <XCircle className="text-rose-600" size={26} />}
        </span>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">Flowstate account</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold">{state === "error" ? "Sign-in failed" : state === "success" ? "Account restored" : "Checking your link"}</h1>
        <p role={state === "error" ? "alert" : "status"} className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
        {state === "error" && <Link href="/" className="mt-6 inline-flex h-10 items-center rounded-xl bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-700">Return to Flowstate</Link>}
      </section>
    </main>
  );
}
