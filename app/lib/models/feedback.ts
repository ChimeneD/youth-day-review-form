import mongoose, { Schema } from "mongoose";

import {
  futureAttendOptions,
  impactOptions,
  inclusiveOptions,
  overallRatingOptions,
  pacedOptions,
} from "@/lib/survey";

const feedbackSubmissionSchema = new Schema(
  {
    overallRating: {
      type: String,
      required: true,
      enum: overallRatingOptions,
    },
    overallRatingComments: {
      type: String,
      default: "",
      trim: true,
    },
    attendAgain: {
      type: String,
      required: true,
      enum: futureAttendOptions,
    },
    impact: {
      type: String,
      required: true,
      enum: impactOptions,
    },
    impactOtherDetail: {
      type: String,
      default: "",
      trim: true,
    },
    activitiesInclusive: {
      type: String,
      required: true,
      enum: inclusiveOptions,
    },
    activitiesInclusiveComments: {
      type: String,
      default: "",
      trim: true,
    },
    challenges: {
      type: String,
      default: "",
      trim: true,
    },
    schedulePaced: {
      type: String,
      required: true,
      enum: pacedOptions,
    },
    scheduleComments: {
      type: String,
      default: "",
      trim: true,
    },
    suggestions: {
      type: String,
      default: "",
      trim: true,
    },
    spiritualGrowth: {
      type: String,
      default: "",
      trim: true,
    },
    source: {
      type: String,
      default: "Youth Day 2026 Feedback Survey",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "feedback_submissions",
  }
);

export type FeedbackSubmissionDocument = mongoose.InferSchemaType<
  typeof feedbackSubmissionSchema
>;

export const FeedbackSubmission =
  mongoose.models.FeedbackSubmission ||
  mongoose.model<FeedbackSubmissionDocument>(
    "FeedbackSubmission",
    feedbackSubmissionSchema
  );
