"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <div dir="rtl" className="grid min-h-screen place-items-center bg-bg px-4">
      <form action={action} className="w-full max-w-sm space-y-4 border border-line bg-surface p-8">
        <h1 className="font-display text-2xl">أوان | AWAN Admin</h1>
        <input name="email" type="email" required placeholder="Email" autoComplete="username" className="input" dir="ltr" />
        <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className="input" dir="ltr" />
        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
        <button disabled={pending} className="btn w-full">{pending ? "..." : "دخول / Sign in"}</button>
      </form>
    </div>
  );
}
