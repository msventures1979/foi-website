"use client";

import { useActionState } from "react";
import { requestLogin, type LoginState } from "./actions";

const idle: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLogin, idle);
  if (state.status === "sent") {
    return (
      <p role="status" className="border-l-2 border-gold bg-card px-5 py-4">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="lbl">
          E-Mail-Adresse
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      {state.message ? (
        <p role="alert" className="text-sm text-gold-light">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="btn-gold w-full" disabled={pending}>
        {pending ? "Wird gesendet …" : "Anmeldelink senden"}
      </button>
    </form>
  );
}
