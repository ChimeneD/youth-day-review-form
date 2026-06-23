"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  LogOut,
  MessageSquareText,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminSurveySubmission } from "@/lib/admin-submissions";

type AdminSurveyDashboardProps = {
  submissions: AdminSurveySubmission[];
  loadError?: string | null;
};

type DetailItem = {
  label: string;
  value: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function pickTone(value: string) {
  switch (value) {
    case "Excellent":
      return "bg-[#dff7e8] text-[#16714b] ring-[#7bd4a1]/30";
    case "Good":
      return "bg-[#e6f3ff] text-[#245b9d] ring-[#7cb7ff]/30";
    case "Average":
      return "bg-[#fff0d8] text-[#9a5d00] ring-[#f5c56c]/30";
    case "Needs Improvement":
      return "bg-[#fde9ef] text-[#b11d49] ring-[#f084a2]/30";
    default:
      return "bg-white/10 text-white/80 ring-white/10";
  }
}

function valueOrDash(value: string) {
  return value.trim() ? value : "—";
}

function DetailRow({ label, value }: DetailItem) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/90">
        {valueOrDash(value)}
      </p>
    </div>
  );
}

export function AdminSurveyDashboard({ submissions, loadError }: AdminSurveyDashboardProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<AdminSurveySubmission | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
      }
    }

    if (selected) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }

    return undefined;
  }, [selected]);

  function openSubmission(submission: AdminSurveySubmission) {
    setDeleteError(null);
    setSelected(submission);
  }

  function closeSubmission() {
    setDeleteError(null);
    setSelected(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    router.refresh();
  }

  async function handleDeleteSelectedSubmission() {
    if (!selected || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this response? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/submissions/${selected.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload?.message || "We could not delete this response right now."
        );
      }

      closeSubmission();
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "We could not delete this response right now."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const total = submissions.length;
  const excellentCount = submissions.filter((submission) => submission.overallRating === "Excellent").length;
  const maybeCount = submissions.filter((submission) => submission.attendAgain === "Maybe").length;
  const hasLoadError = Boolean(loadError);

  const details: DetailItem[] = selected
    ? [
        { label: "Overall rating", value: selected.overallRating },
        { label: "Rating notes", value: selected.overallRatingComments },
        { label: "Attend again", value: selected.attendAgain },
        { label: "Greatest impact", value: selected.impact },
        { label: "Impact detail", value: selected.impactOtherDetail },
        { label: "Activities inclusive", value: selected.activitiesInclusive },
        { label: "Inclusion notes", value: selected.activitiesInclusiveComments },
        { label: "Challenges", value: selected.challenges },
        { label: "Schedule paced", value: selected.schedulePaced },
        { label: "Schedule notes", value: selected.scheduleComments },
        { label: "Suggestions", value: selected.suggestions },
        { label: "Spiritual growth", value: selected.spiritualGrowth },
        { label: "Source", value: selected.source },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_28%),linear-gradient(160deg,#101735_0%,#241a36_36%,#5a2c82_70%,#1e2a66_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-[0_32px_100px_rgba(8,10,18,0.35)] backdrop-blur-xl sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(35,214,214,0.18),transparent_26%)]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                <Sparkles className="size-3.5" />
                Admin view
              </div>
              <h1 className="font-['Anton'] text-5xl leading-none tracking-[0.02em] sm:text-6xl">
                Survey responses
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                Review each submission in a compact card, then open the full
                response whenever you need the details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="h-11 rounded-full border-white/15 bg-white/8 px-5 text-white hover:bg-white/15 hover:text-white"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          </div>
        </header>

        {hasLoadError ? (
          <section className="rounded-[1.75rem] border border-amber-300/30 bg-amber-50/95 p-5 text-amber-950 shadow-[0_24px_60px_rgba(8,10,18,0.16)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
                  Response load issue
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  We could not load the survey responses
                </h2>
                <p className="mt-2 text-sm leading-6 text-amber-900/80">
                  {loadError}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => router.refresh()}
                className="h-11 rounded-full bg-amber-950 px-5 text-amber-50 hover:bg-amber-900"
              >
                Reload
              </Button>
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-white/10 text-white shadow-[0_24px_60px_rgba(8,10,18,0.24)] backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardDescription className="text-white/55">Total responses</CardDescription>
              <CardTitle className="flex items-end gap-2 text-4xl text-white">
                {total}
                <span className="text-sm font-medium text-white/55">entries</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/10 text-white shadow-[0_24px_60px_rgba(8,10,18,0.24)] backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardDescription className="text-white/55">Excellent ratings</CardDescription>
              <CardTitle className="flex items-end gap-2 text-4xl text-white">
                {excellentCount}
                <Star className="mb-1 size-5 text-[#ffc93c]" />
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-white/10 bg-white/10 text-white shadow-[0_24px_60px_rgba(8,10,18,0.24)] backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardDescription className="text-white/55">Maybe returning</CardDescription>
              <CardTitle className="flex items-end gap-2 text-4xl text-white">
                {maybeCount}
                <BadgeCheck className="mb-1 size-5 text-[#23d6d6]" />
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        {submissions.length ? (
          <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission, index) => (
              <button
                key={submission.id}
                type="button"
                onClick={() => openSubmission(submission)}
                className="group text-left"
              >
                <Card className="h-full border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.82))] text-[#241a36] transition-transform duration-200 hover:-translate-y-1">
                  <CardHeader className="gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5c5270]">
                          Submission {String(index + 1).padStart(2, "0")}
                        </p>
                        <CardTitle className="mt-2 text-2xl text-[#241a36]">
                          {submission.overallRating}
                        </CardTitle>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ring-1 ${pickTone(
                          submission.overallRating
                        )}`}
                      >
                        {submission.overallRating}
                      </span>
                    </div>

                    <CardDescription className="flex items-center gap-2 text-[#5c5270]">
                      <CalendarDays className="size-4" />
                      {formatDateTime(submission.createdAt)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#f7f2ea] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6e85]">
                          Attend again
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#241a36]">
                          {valueOrDash(submission.attendAgain)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f7f2ea] p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6e85]">
                          Top impact
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#241a36]">
                          {valueOrDash(submission.impact)}
                        </p>
                      </div>
                    </div>

                    <p className="max-h-24 overflow-hidden text-sm leading-6 text-[#5c5270]">
                      {submission.overallRatingComments ||
                        submission.suggestions ||
                        submission.challenges ||
                        "Tap to open the full response."}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#ece3d5] pt-4 text-sm font-semibold text-[#241a36]">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-4 text-[#e8266f]" />
                        {submission.schedulePaced || "Unspecified"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#e8266f]">
                        Open
                        <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </section>
        ) : (
          <Card className="border-white/15 bg-white/10 text-white shadow-[0_24px_60px_rgba(8,10,18,0.24)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {hasLoadError ? "Responses are temporarily unavailable" : "No survey responses yet"}
              </CardTitle>
              <CardDescription className="text-white/68">
                {hasLoadError
                  ? "Try reloading the page after checking the database connection."
                  : "Once people start submitting feedback, each response will appear here as a card."}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1020]/75 px-4 py-6 backdrop-blur-md"
          onClick={closeSubmission}
          role="presentation"
        >
          <div
            className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(15,19,36,0.98),rgba(25,31,59,0.98))] text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-survey-dialog-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Detailed view
                </p>
                <h2
                  id="admin-survey-dialog-title"
                  className="mt-2 text-3xl font-semibold tracking-tight text-white"
                >
                  {selected.overallRating}
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Submitted {formatDateTime(selected.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelectedSubmission}
                  disabled={isDeleting}
                  className="rounded-full border border-white/10 bg-[#ff4d6d]/15 text-[#ffb0bf] hover:bg-[#ff4d6d]/25 hover:text-white"
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? "Deleting..." : "Delete response"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={closeSubmission}
                  className="rounded-full bg-white/8 text-white hover:bg-white/15 hover:text-white"
                  aria-label="Close dialog"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-5 sm:p-6">
              {deleteError ? (
                <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-50">
                  {deleteError}
                </div>
              ) : null}

              <div className="mb-5 flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ring-1 ${pickTone(
                    selected.overallRating
                  )}`}
                >
                  {selected.overallRating}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  <MessageSquareText className="size-3.5" />
                  {selected.impact || "No impact selected"}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {details.map((item) => (
                  <DetailRow key={item.label} {...item} />
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                  Metadata
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DetailRow label="Submission ID" value={selected.id} />
                  <DetailRow label="Updated at" value={formatDateTime(selected.updatedAt)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
