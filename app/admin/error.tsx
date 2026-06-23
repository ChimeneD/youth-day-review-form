"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_30%),linear-gradient(160deg,#101735_0%,#241a36_38%,#5a2c82_72%,#1e2a66_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center">
        <section className="w-full rounded-[2rem] border border-white/15 bg-white/10 p-6 text-white shadow-[0_32px_100px_rgba(8,10,18,0.35)] backdrop-blur-xl sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            Admin error
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The admin page could not load
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
            {error.message}
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#241a36] transition-transform hover:-translate-y-0.5"
          >
            Try again
          </button>
        </section>
      </div>
    </main>
  );
}
