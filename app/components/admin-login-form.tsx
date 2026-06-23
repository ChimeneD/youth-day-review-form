"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminLoginFormProps = {
  notice?: string | null;
};

export function AdminLoginForm({ notice }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof payload?.message === "string"
            ? payload.message
            : "That password did not work."
        );
      }

      setPassword("");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "That password did not work."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_52%),linear-gradient(180deg,_rgba(23,31,72,0.96),_rgba(16,20,44,0.98))] p-6 shadow-[0_40px_120px_rgba(7,10,22,0.45)] backdrop-blur-xl sm:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.05))]" />
      <div className="relative z-10 mx-auto grid max-w-lg gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
          <LockKeyhole className="size-3.5" />
          Admin access
        </div>

        {notice ? (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-50/95 px-4 py-3 text-sm leading-6 text-amber-950 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            {notice}
          </div>
        ) : null}

        <Card className="border-white/10 bg-white/92 shadow-[0_24px_80px_rgba(10,12,24,0.35)]">
          <CardHeader className="gap-3">
            <CardTitle className="text-2xl text-[#241a36]">Sign in</CardTitle>
            <CardDescription className="text-sm text-[#5c5270]">
              Enter the admin password to view the survey responses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-2xl border border-[#e8266f]/15 bg-[#fdeaf1] px-4 py-3 text-sm font-medium text-[#e8266f]">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-full bg-[linear-gradient(135deg,#ff6a1a,#e8266f)] text-base shadow-[0_16px_30px_rgba(232,38,111,0.34)] hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(232,38,111,0.42)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Checking
                  </>
                ) : (
                  "Unlock admin"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
