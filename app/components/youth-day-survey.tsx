/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import { useFormik } from "formik";

import {
  futureAttendOptions,
  impactOptions,
  inclusiveOptions,
  overallRatingOptions,
  pacedOptions,
} from "@/lib/survey";

type YouthDaySurveyProps = {
  pageStyles: string;
  logoSrc: string;
  watermarkSrc: string;
};

type SurveyValues = {
  overall_rating: string;
  overall_rating_comments: string;
  attend_again: string;
  impact: string;
  impact_other_detail: string;
  activities_inclusive: string;
  activities_inclusive_comments: string;
  challenges: string;
  schedule_paced: string;
  schedule_comments: string;
  suggestions: string;
  spiritual_growth: string;
  _gotcha: string;
  _subject: string;
};

const initialValues: SurveyValues = {
  overall_rating: "",
  overall_rating_comments: "",
  attend_again: "",
  impact: "",
  impact_other_detail: "",
  activities_inclusive: "",
  activities_inclusive_comments: "",
  challenges: "",
  schedule_paced: "",
  schedule_comments: "",
  suggestions: "",
  spiritual_growth: "",
  _gotcha: "",
  _subject: "Youth Day 2026 — Feedback Survey Response",
};

function QuestionIcon({
  background,
  children,
}: {
  background: string;
  children: ReactNode;
}) {
  return (
    <span className="q-icon" style={{ background }}>
      {children}
    </span>
  );
}

function Squiggle({ stroke }: { stroke: string }) {
  return (
    <svg className="squiggle" viewBox="0 0 280 14" preserveAspectRatio="none">
      <path
        d="M0 7 Q 17.5 0 35 7 T 70 7 T 105 7 T 140 7 T 175 7 T 210 7 T 245 7 T 280 7"
        stroke={stroke}
        strokeWidth="3"
      />
    </svg>
  );
}

export function YouthDaySurvey({
  pageStyles,
  logoSrc,
  watermarkSrc,
}: YouthDaySurveyProps) {
  const [showError, setShowError] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const thanksPanelRef = useRef<HTMLDivElement>(null);

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, helpers) => {
      setShowError(false);

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        helpers.resetForm();
        setShowThanks(true);
        thanksPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } catch {
        setShowError(true);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const showOtherDetail = formik.values.impact === "Other";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />

      <header className="hero">
        <div className="logo-row">
          <span className="logo-mark">
            <img src={logoSrc} alt="Bellville Baptist Church logo" />
          </span>
          <span className="logo-text">Bellville<br />Baptist Church</span>
        </div>

        <h1 className="headline">
          YOUTH DAY<span className="year">2026</span>
        </h1>

        <Squiggle stroke="var(--gold)" />

        <p className="hero-copy">
          Thank you for showing up on June 16th and making it one to remember.
          We poured a lot into that day; worship, the word, games, food, and
          time together. Now we want to hear from <strong>you</strong>, your
          feedback matters. Two minutes, total honesty, no names required.
        </p>
      </header>

      <main>
        <form id="feedbackForm" className="survey-card" onSubmit={formik.handleSubmit}>
          <p className={`error-note${showError ? " show" : ""}`} id="errorNote">
            Something didn&apos;t send. Please check your connection and try
            again.
          </p>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">Question 1 of 8</p>
            <div className="q-head">
              <QuestionIcon background="var(--orange)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                Overall, how would you rate the Youth Day Event?
              </legend>
            </div>
            <div className="q-body">
              <div className="pill-group" style={{ marginBottom: 14 }}>
                {overallRatingOptions.map((option, index) => {
                  const id = `r${index + 1}`;

                  return (
                    <Fragment key={option}>
                      <input
                        type="radio"
                        name="overall_rating"
                        id={id}
                        value={option}
                        required={index === 0}
                        checked={formik.values.overall_rating === option}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label htmlFor={id}>{option}</label>
                    </Fragment>
                  );
                })}
              </div>
              <textarea
                name="overall_rating_comments"
                rows={2}
                placeholder="Tell us why, especially if there's room to improve (optional)"
                value={formik.values.overall_rating_comments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">
              Question 2 of 8 · <span className="optional-tag">optional</span>
            </p>
            <div className="q-head">
              <QuestionIcon background="var(--teal)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.3a2 2 0 002-1.6l1.4-7A2 2 0 0019.7 9H14z" />
                  <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">Would you come to a future event like this?</legend>
            </div>
            <div className="q-body pill-group">
              {futureAttendOptions.map((option, index) => {
                const id = `a${index + 1}`;

                return (
                  <Fragment key={option}>
                    <input
                      type="radio"
                      name="attend_again"
                      id={id}
                      value={option}
                      checked={formik.values.attend_again === option}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor={id}>{option}</label>
                  </Fragment>
                );
              })}
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">Question 3 of 8</p>
            <div className="q-head">
              <QuestionIcon background="var(--pink)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                What aspect of the event had the greatest impact on you?
              </legend>
            </div>
            <div className="q-body radio-list">
              {impactOptions.map((option) => {
                const id =
                  option === "Worship"
                    ? "impWorship"
                    : option === "Message"
                      ? "impMessage"
                      : option === "Fellowship Time"
                        ? "impFellowship"
                        : option === "Games & Activities"
                          ? "impGames"
                          : option === "Food & Refreshments"
                            ? "impFood"
                            : "impactOther";

                return (
                  <div className="radio-row" key={option}>
                    <input
                      type="radio"
                      name="impact"
                      id={id}
                      value={option}
                      required={option === "Worship"}
                      checked={formik.values.impact === option}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor={id}>{option}</label>
                  </div>
                );
              })}
              <div
                className="other-field"
                style={{ display: showOtherDetail ? "block" : "none" }}
              >
                <input
                  type="text"
                  name="impact_other_detail"
                  id="impactOtherDetail"
                  placeholder="Tell us what that was (required)"
                  required={showOtherDetail}
                  value={formik.values.impact_other_detail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">Question 4 of 8</p>
            <div className="q-head">
              <QuestionIcon background="var(--gold)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="5" r="2.2" />
                  <circle cx="5" cy="18" r="2.2" />
                  <circle cx="19" cy="18" r="2.2" />
                  <path d="M12 7.2L6.5 16M12 7.2L17.5 16M7 18h10" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                Did you feel the games and activities included everyone?
              </legend>
            </div>
            <div className="q-body">
              <div className="pill-group" style={{ marginBottom: 14 }}>
                {inclusiveOptions.map((option, index) => {
                  const id = `i${index + 1}`;

                  return (
                    <Fragment key={option}>
                      <input
                        type="radio"
                        name="activities_inclusive"
                        id={id}
                        value={option}
                        required={index === 0}
                        checked={formik.values.activities_inclusive === option}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label htmlFor={id}>{option}</label>
                    </Fragment>
                  );
                })}
              </div>
              <textarea
                name="activities_inclusive_comments"
                rows={2}
                placeholder="Anyone who felt left out, or ideas to make it more inclusive (optional)"
                value={formik.values.activities_inclusive_comments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">
              Question 5 of 8 · <span className="optional-tag">optional</span>
            </p>
            <div className="q-head">
              <QuestionIcon background="var(--purple)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 21V4M4 4h13l-2.5 4L17 12H4" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                What challenges or difficulties did you observe during the event?
              </legend>
            </div>
            <div className="q-body">
              <textarea
                name="challenges"
                rows={3}
                placeholder="Logistics, timing, supplies, anything that got in the way..."
                value={formik.values.challenges}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">Question 6 of 8</p>
            <div className="q-head">
              <QuestionIcon background="var(--navy)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3.5 2" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                Was the programme schedule realistic and well-paced?
              </legend>
            </div>
            <div className="q-body">
              <div className="pill-group" style={{ marginBottom: 14 }}>
                {pacedOptions.map((option, index) => {
                  const id = `s${index + 1}`;

                  return (
                    <Fragment key={option}>
                      <input
                        type="radio"
                        name="schedule_paced"
                        id={id}
                        value={option}
                        required={index === 0}
                        checked={formik.values.schedule_paced === option}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label htmlFor={id}>{option}</label>
                    </Fragment>
                  );
                })}
              </div>
              <textarea
                name="schedule_comments"
                rows={2}
                placeholder="Comments (optional)"
                value={formik.values.schedule_comments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">
              Question 7 of 8 · <span className="optional-tag">optional</span>
            </p>
            <div className="q-head">
              <QuestionIcon background="var(--teal)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.43 1 1.15 1 1.93V16h5v-.17c0-.78.4-1.5 1-1.93A6 6 0 0012 3z" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                Any other suggestions, observations, or ideas for future youth events?
              </legend>
            </div>
            <div className="q-body">
              <textarea
                name="suggestions"
                rows={3}
                placeholder="We're all ears..."
                value={formik.values.suggestions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </fieldset>

          <fieldset style={showThanks ? { display: "none" } : undefined}>
            <p className="q-eyebrow">
              Question 8 of 8 · <span className="optional-tag">optional</span>
            </p>
            <div className="q-head">
              <QuestionIcon background="var(--gold)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z" />
                </svg>
              </QuestionIcon>
              <legend className="q-text">
                How can we help you as teenagers and young adults grow spiritually
                after this event?
              </legend>
            </div>
            <div className="q-body">
              <textarea
                name="spiritual_growth"
                rows={3}
                placeholder="Follow-up ideas, small groups, mentoring..."
                value={formik.values.spiritual_growth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </fieldset>

          <input
            type="text"
            name="_gotcha"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            value={formik.values._gotcha}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <input type="hidden" name="_subject" value={formik.values._subject} />

          <button
            type="submit"
            className="submit-btn"
            id="submitBtn"
            disabled={formik.isSubmitting || showThanks}
            style={showThanks ? { display: "none" } : undefined}
          >
            {formik.isSubmitting ? "Sending..." : "Send my feedback"}
          </button>
          <p className="privacy-note" style={showThanks ? { display: "none" } : undefined}>
            Your answers go straight to the planning team. No name required, just
            your honest thoughts.
          </p>

          <div
            className={`thanks${showThanks ? " show" : ""}`}
            id="thanksPanel"
            ref={thanksPanelRef}
          >
            <QuestionIcon
              background="linear-gradient(135deg, var(--orange), var(--pink))"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </QuestionIcon>
            <h2>Got it — thank you!</h2>
            <Squiggle stroke="var(--teal)" />
            <p>
              Your feedback was sent to the Youth Day planning team. It&apos;s more
              than a day, your voice helps shape the next one.
            </p>
            <span className="thanks-watermark">
              <img src={watermarkSrc} alt="" />
            </span>
          </div>
        </form>
      </main>

      <footer>
        Bellville Baptist Church · Youth Day 2026 · Faith · Purpose · Unity ·
        Impact
      </footer>
    </>
  );
}
