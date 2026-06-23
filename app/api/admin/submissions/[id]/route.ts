import mongoose from "mongoose";

import { getAdminSession } from "@/lib/admin-auth";
import { deleteAdminSurveySubmission } from "@/lib/admin-submissions";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/submissions/[id]">
) {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ message: "Invalid response id." }, { status: 400 });
  }

  try {
    const deleted = await deleteAdminSurveySubmission(id);

    if (!deleted) {
      return Response.json({ message: "Response not found." }, { status: 404 });
    }

    return Response.json({ message: "Response deleted." });
  } catch (error) {
    console.error("Failed to delete feedback submission:", error);

    return Response.json(
      { message: "We could not delete this response right now." },
      { status: 500 }
    );
  }
}
