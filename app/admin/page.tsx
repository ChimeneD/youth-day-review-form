import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminSurveyDashboard } from "@/components/admin-survey-dashboard";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminSurveySubmissions } from "@/lib/admin-submissions";

export const metadata: Metadata = {
  title: "Admin | Youth Day 2026 Feedback",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await getAdminSession();

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_30%),linear-gradient(160deg,#101735_0%,#241a36_38%,#5a2c82_72%,#1e2a66_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
          <div className="w-full">
            <AdminLoginForm />
          </div>
        </div>
      </main>
    );
  }

  const submissions = await getAdminSurveySubmissions();

  return <AdminSurveyDashboard submissions={submissions} />;
}
