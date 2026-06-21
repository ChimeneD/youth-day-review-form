import { clearAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  await clearAdminSessionCookie();

  return Response.json({ message: "Signed out." }, { status: 200 });
}

export async function DELETE() {
  await clearAdminSessionCookie();

  return Response.json({ message: "Signed out." }, { status: 200 });
}
