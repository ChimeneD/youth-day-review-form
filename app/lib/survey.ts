export const surveyMeta = {
  churchName: "Bellville Baptist Church",
  title: "Youth Day 2026 Feedback — Bellville Baptist Church",
} as const;

export const overallRatingOptions = [
  "Excellent",
  "Good",
  "Average",
  "Needs Improvement",
] as const;

export const futureAttendOptions = ["Yes", "Maybe", "No"] as const;

export const impactOptions = [
  "Worship",
  "Message",
  "Fellowship Time",
  "Games & Activities",
  "Food & Refreshments",
  "Other",
] as const;

export const inclusiveOptions = ["Yes", "Mostly", "No"] as const;
export const pacedOptions = ["Yes", "Mostly", "No"] as const;

export type OverallRating = (typeof overallRatingOptions)[number] | "";
export type FutureAttend = (typeof futureAttendOptions)[number] | "";
export type Impact = (typeof impactOptions)[number] | "";
export type Inclusive = (typeof inclusiveOptions)[number] | "";
export type Paced = (typeof pacedOptions)[number] | "";

export interface SurveyFormState {
  overallRating: OverallRating;
  overallRatingComments: string;
  attendAgain: FutureAttend;
  impact: Impact;
  impactOtherDetail: string;
  activitiesInclusive: Inclusive;
  activitiesInclusiveComments: string;
  challenges: string;
  schedulePaced: Paced;
  scheduleComments: string;
  suggestions: string;
  spiritualGrowth: string;
  _gotcha: string;
}

export const initialSurveyState: SurveyFormState = {
  overallRating: "",
  overallRatingComments: "",
  attendAgain: "",
  impact: "",
  impactOtherDetail: "",
  activitiesInclusive: "",
  activitiesInclusiveComments: "",
  challenges: "",
  schedulePaced: "",
  scheduleComments: "",
  suggestions: "",
  spiritualGrowth: "",
  _gotcha: "",
};

export function isOption<T extends readonly string[]>(
  value: unknown,
  options: T
): value is T[number] {
  return typeof value === "string" && options.includes(value as T[number]);
}
