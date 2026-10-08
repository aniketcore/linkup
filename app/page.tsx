"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithGoogle, signOutUser, type User } from "./lib/firebase";

async function syncUserWithDatabase(user: User) {
  const payload = {
    id: user.uid,
    email: user.email,
    name: user.displayName ?? "User",
    avatar: user.photoURL ?? null,
    role: "member",
  };

  // Prefer same-origin API route for normal dev/prod, then fall back to Wrangler's default port.
  const endpoints = ["/api/users/sync", "http://localhost:8787/api/users/sync"];
  let response: Response | null = null;

  for (const endpoint of endpoints) {
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) break;
    } catch {
      // Try the next endpoint when the first one isn't reachable.
    }
  }

  if (!response) {
    throw new Error("Failed to reach the sync API. Start npm run dev (or npm run start for Wrangler).");
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Failed to sync user.");
  }
}

const links = [
  {
    href: "https://github.com/cloudflare/vinext",
    label: "vinext",
  },
  {
    href: "https://developers.cloudflare.com/workers/",
    label: "Workers",
  },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        try {
          await syncUserWithDatabase(nextUser);
        } catch (err) {
          console.error("Failed to sync user to D1:", err);
          setError(
            err instanceof Error ? err.message : "Failed to save the user to the database."
          );
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleGoogleLogin() {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  }

  async function handleLogout() {
    try {
      setError(null);
      await signOutUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            vinext + Cloudflare Workers + Firebase
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            LinkUp with Google sign-in.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            This app now includes Firebase Auth with Google login and a simple signed-in user state.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <p className="text-slate-600">Loading auth state...</p>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    alt={user.displayName ?? "User avatar"}
                    className="h-12 w-12 rounded-full border border-slate-200"
                    src={user.photoURL}
                  />
                ) : null}
                <div>
                  <p className="text-lg font-semibold">Signed in as {user.displayName ?? "User"}</p>
                  <p className="text-sm text-slate-600">{user.email ?? "No email available"}</p>
                </div>
              </div>

              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                onClick={handleLogout}
                type="button"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-700">You are not signed in yet.</p>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                onClick={handleGoogleLogin}
                type="button"
              >
                Continue with Google
              </button>
            </div>
          )}

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Develop</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Run the vinext dev server locally.</p>
            <code className="mt-4 block rounded bg-slate-100 px-3 py-2 text-sm">npm run dev -- --host 0.0.0.0</code>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Build</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create Worker-ready production output.</p>
            <code className="mt-4 block rounded bg-slate-100 px-3 py-2 text-sm">npm run build</code>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Deploy</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Ship the generated Worker with Wrangler.</p>
            <code className="mt-4 block rounded bg-slate-100 px-3 py-2 text-sm">npm run deploy</code>
          </div>
        </div>

        <nav className="flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
          <a
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
            href="/api/hello"
          >
            API route
          </a>
        </nav>
      </section>
    </main>
  );
}
