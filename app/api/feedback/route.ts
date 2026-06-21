import { connectToDatabase } from "@/lib/mongodb";
import { FeedbackSubmission } from "@/lib/models/feedback";
import {
  futureAttendOptions,
  impactOptions,
  inclusiveOptions,
  initialSurveyState,
  overallRatingOptions,
  pacedOptions,
  type SurveyFormState,
  isOption,
} from "@/lib/survey";

export const runtime = "nodejs";

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readValue(candidate: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (key in candidate) {
      return candidate[key];
    }
  }

  return undefined;
}

function parsePayload(payload: unknown): SurveyFormState | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const parsed: SurveyFormState = {
    overallRating: isOption(
      readValue(candidate, "overall_rating", "overallRating"),
      overallRatingOptions
    )
      ? (readValue(candidate, "overall_rating", "overallRating") as SurveyFormState["overallRating"])
      : "",
    overallRatingComments: getString(
      readValue(candidate, "overall_rating_comments", "overallRatingComments")
    ),
    attendAgain: isOption(
      readValue(candidate, "attend_again", "attendAgain"),
      futureAttendOptions
    )
      ? (readValue(candidate, "attend_again", "attendAgain") as SurveyFormState["attendAgain"])
      : "",
    impact: isOption(readValue(candidate, "impact"), impactOptions)
      ? (readValue(candidate, "impact") as SurveyFormState["impact"])
      : "",
    impactOtherDetail: getString(
      readValue(candidate, "impact_other_detail", "impactOtherDetail")
    ),
    activitiesInclusive: isOption(
      readValue(candidate, "activities_inclusive", "activitiesInclusive"),
      inclusiveOptions
    )
      ? (readValue(
          candidate,
          "activities_inclusive",
          "activitiesInclusive"
        ) as SurveyFormState["activitiesInclusive"])
      : "",
    activitiesInclusiveComments: getString(
      readValue(
        candidate,
        "activities_inclusive_comments",
        "activitiesInclusiveComments"
      )
    ),
    challenges: getString(readValue(candidate, "challenges")),
    schedulePaced: isOption(
      readValue(candidate, "schedule_paced", "schedulePaced"),
      pacedOptions
    )
      ? (readValue(candidate, "schedule_paced", "schedulePaced") as SurveyFormState["schedulePaced"])
      : "",
    scheduleComments: getString(
      readValue(candidate, "schedule_comments", "scheduleComments")
    ),
    suggestions: getString(readValue(candidate, "suggestions")),
    spiritualGrowth: getString(
      readValue(candidate, "spiritual_growth", "spiritualGrowth")
    ),
    _gotcha: getString(readValue(candidate, "_gotcha")),
  };

  if (
    !parsed.overallRating ||
    !parsed.attendAgain ||
    !parsed.impact ||
    !parsed.activitiesInclusive ||
    !parsed.schedulePaced
  ) {
    return null;
  }

  if (parsed.impact === "Other" && !parsed.impactOtherDetail) {
    return null;
  }

  return parsed;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Please send the survey data as JSON." },
      { status: 400 }
    );
  }

  const parsed = parsePayload(body);

  if (!parsed) {
    return Response.json(
      { message: "The survey submission is missing required answers." },
      { status: 400 }
    );
  }

  if (parsed._gotcha) {
    return Response.json({ message: "Submission rejected." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const submission = await FeedbackSubmission.create({
      ...initialSurveyState,
      ...parsed,
      source: "Youth Day 2026 Feedback Survey",
    });

    return Response.json(
      {
        message: "Feedback saved successfully.",
        id: submission._id.toString(),
        createdAt: submission.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save feedback submission:", error);

    return Response.json(
      { message: "We could not save your response right now." },
      { status: 500 }
    );
  }
}
