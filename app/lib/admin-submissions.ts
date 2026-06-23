import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { FeedbackSubmission } from "@/lib/models/feedback";

export type AdminSurveySubmission = {
  id: string;
  createdAt: string;
  updatedAt: string;
  overallRating: string;
  overallRatingComments: string;
  attendAgain: string;
  impact: string;
  impactOtherDetail: string;
  activitiesInclusive: string;
  activitiesInclusiveComments: string;
  challenges: string;
  schedulePaced: string;
  scheduleComments: string;
  suggestions: string;
  spiritualGrowth: string;
  source: string;
};

function toDateString(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return typeof value === "string" ? value : "";
}

export async function getAdminSurveySubmissions() {
  await connectToDatabase();

  const submissions = await FeedbackSubmission.find({})
    .sort({ createdAt: -1 })
    .lean();

  return submissions.map((submission) => ({
    id: submission._id.toString(),
    createdAt: toDateString(submission.createdAt),
    updatedAt: toDateString(submission.updatedAt),
    overallRating: submission.overallRating ?? "",
    overallRatingComments: submission.overallRatingComments ?? "",
    attendAgain: submission.attendAgain ?? "",
    impact: submission.impact ?? "",
    impactOtherDetail: submission.impactOtherDetail ?? "",
    activitiesInclusive: submission.activitiesInclusive ?? "",
    activitiesInclusiveComments: submission.activitiesInclusiveComments ?? "",
    challenges: submission.challenges ?? "",
    schedulePaced: submission.schedulePaced ?? "",
    scheduleComments: submission.scheduleComments ?? "",
    suggestions: submission.suggestions ?? "",
    spiritualGrowth: submission.spiritualGrowth ?? "",
    source: submission.source ?? "",
  }));
}

export async function deleteAdminSurveySubmission(id: string) {
  await connectToDatabase();

  const deletedSubmission = await FeedbackSubmission.findByIdAndDelete(id);

  return Boolean(deletedSubmission);
}
