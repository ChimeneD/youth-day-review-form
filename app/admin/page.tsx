import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminSurveyDashboard } from "@/components/admin-survey-dashboard";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth";
import {
  getAdminSurveySubmissions,
  type AdminSurveySubmission,
} from "@/lib/admin-submissions";

export const metadata: Metadata = {
  title: "Admin | Youth Day 2026 Feedback",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminAuthConfigured = isAdminAuthConfigured();
  const isAdmin = adminAuthConfigured ? await getAdminSession() : false;

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_30%),linear-gradient(160deg,#101735_0%,#241a36_38%,#5a2c82_72%,#1e2a66_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
          <div className="w-full">
            <AdminLoginForm
              notice={
                adminAuthConfigured
                  ? null
                  : "Admin access is not configured on this server yet. Set ADMIN_PASSWORD and restart the app."
              }
            />
          </div>
        </div>
      </main>
    );
  }

  let submissions: AdminSurveySubmission[] = [];
  let loadError: string | null = null;

  try {
    submissions = await getAdminSurveySubmissions();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load survey responses right now.";
  }

  return <AdminSurveyDashboard submissions={submissions} loadError={loadError} />;
}
