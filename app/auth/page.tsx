"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthPage() {
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error } = await authClient.signUp.email({ name, email, password });
      if (error) setMessage(error.message ?? "Sign up failed");
    } else {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) setMessage(error.message ?? "Sign in failed");
    }

    setLoading(false);
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-400";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-widest text-purple-400">
          Galaxy Workers Music
        </p>
        <h1 className="mt-1 text-3xl font-bold">MixGPT</h1>
        <p className="mb-6 text-sm text-gray-400">Virtual AI DJ Assistant</p>

        {isPending ? (
          <p className="text-gray-400">Loading...</p>
        ) : session ? (
          <div className="space-y-4">
            <p className="text-green-400">Logged in successfully!</p>
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <button
              onClick={() => authClient.signOut()}
              className="w-full rounded-lg bg-red-500 py-3 font-semibold hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                className={inputClass}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={inputClass}
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 py-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
            </button>
            {message && <p className="text-sm text-red-400">{message}</p>}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "No account yet? Sign up"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
