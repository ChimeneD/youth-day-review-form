import { isAdminPassword, setAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as Record<string, unknown>).password ?? "")
      : "";

  if (!password || !isAdminPassword(password)) {
    return Response.json(
      { message: "The password is incorrect." },
      { status: 401 }
    );
  }

  await setAdminSessionCookie();

  return Response.json({ message: "Welcome back." }, { status: 200 });
}
