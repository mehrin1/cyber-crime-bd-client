"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type SurveyQuestion = {
  id: string;
  key: string;
  prompt: string;
  description: string | null;
  type: "SHORT_TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SCALE";
  isRequired: boolean;
  options: { value: string; label: string }[];
};

type Survey = {
  title: string;
  sections: { id: string; title: string; description: string | null; questions: SurveyQuestion[] }[];
};

const surveySlug = "cyberbullying-resilience-legal-awareness-bd";

export function SurveyForm() {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [anonymousChoice, setAnonymousChoice] = useState<boolean | null>(null);
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const isAnonymous = anonymousChoice ?? !session?.user;
  const emailValue = isAnonymous ? "" : answers.email?.[0] ?? session?.user.email ?? "";

  useEffect(() => {
    void fetch(`/api/surveys/${surveySlug}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load the survey.");
        const payload = await response.json();
        setSurvey(payload.data);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load the survey.");
      });
  }, []);

  function setSingleValue(questionKey: string, value: string) {
    setAnswers((current) => ({ ...current, [questionKey]: [value] }));
  }

  function toggleValue(questionKey: string, value: string) {
    setAnswers((current) => {
      const values = current[questionKey] || [];
      return {
        ...current,
        [questionKey]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
      };
    });
  }

  function toggleAnonymousMode() {
    const nextIsAnonymous = !isAnonymous;
    setAnonymousChoice(nextIsAnonymous);
    if (nextIsAnonymous) {
      setAnswers((current) => {
        const answersWithoutEmail = { ...current };
        delete answersWithoutEmail.email;
        return answersWithoutEmail;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!survey) return;

    setError(null);
    const missingQuestion = survey.sections
      .flatMap((section) => section.questions)
      .find((question) => question.isRequired && !(answers[question.key] || []).some((value) => value.trim()));

    if (missingQuestion) {
      setError(`Please answer: ${missingQuestion.prompt}`);
      return;
    }

    setIsSubmitting(true);
    const submittedAnswers = Object.entries(answers)
      .filter(([questionKey]) => questionKey !== "email")
      .map(([questionKey, values]) => ({ questionKey, values }));
    if (!isAnonymous && emailValue.trim()) {
      submittedAnswers.push({ questionKey: "email", values: [emailValue.trim()] });
    }
    const response = await fetch(`/api/surveys/${surveySlug}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        answers: submittedAnswers,
        isAnonymous,
      }),
    });
    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.message || "Unable to submit the survey. Please try again.");
      return;
    }

    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl border bg-background text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Your response has been recorded</CardTitle>
          <CardDescription>Thank you for contributing to this research.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!survey) {
    return <p className="text-sm text-muted-foreground">{error || "Loading survey..."}</p>;
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <Card className="border bg-background">
        <CardHeader className="border-b">
          <CardTitle>Submission identity</CardTitle>
          <CardDescription>Choose whether to attach an email to this response.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Submit anonymously</p>
              <p className="mt-1 text-sm text-muted-foreground">{isAnonymous ? "No email or signed-in account will be attached." : "An email will be attached to this response."}</p>
            </div>
            <Button type="button" variant={isAnonymous ? "default" : "outline"} aria-pressed={isAnonymous} disabled={isSessionPending} onClick={toggleAnonymousMode}>
              {isSessionPending ? "Checking account..." : isAnonymous ? "Anonymous mode on" : "Anonymous mode off"}
            </Button>
          </div>

          {isAnonymous ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
              Anonymous submission is enabled. You will not be able to see a personal survey report after submitting anonymously because this response cannot be connected to an email or account.
            </p>
          ) : (
            <label className="grid max-w-xl gap-2 text-sm font-medium">
              Email for your personal survey report
              <Input type="email" value={emailValue} onChange={(event) => setSingleValue("email", event.target.value)} placeholder="name@example.com" />
              <span className="font-normal text-muted-foreground">{session?.user ? "Prefilled from your signed-in account. You can replace it with a different email." : "Enter an email if you want your response connected to a personal report."}</span>
            </label>
          )}
        </CardContent>
      </Card>
      {survey.sections.map((section) => (
        <Card key={section.id} className="border bg-background">
          <CardHeader className="border-b">
            <CardTitle>{section.title}</CardTitle>
            {section.description ? <CardDescription className="whitespace-pre-line leading-6">{section.description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {section.questions.filter((question) => question.key !== "email").map((question) => (
              <fieldset key={question.id} className="space-y-3">
                <legend className="text-sm leading-6 font-medium">
                  {question.prompt} {question.isRequired ? <span className="text-destructive">*</span> : null}
                </legend>
                {question.description ? <p className="text-sm text-muted-foreground">{question.description}</p> : null}
                {question.type === "SHORT_TEXT" ? (
                  <Input
                    type={question.key === "email" ? "email" : "text"}
                    value={answers[question.key]?.[0] || ""}
                    onChange={(event) => setSingleValue(question.key, event.target.value)}
                  />
                ) : question.type === "MULTIPLE_CHOICE" ? (
                  <div className="grid gap-2">
                    {question.options.map((option) => (
                      <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm hover:bg-muted/50">
                        <input type="checkbox" checked={(answers[question.key] || []).includes(option.value)} onChange={() => toggleValue(question.key, option.value)} className="mt-0.5 size-4" />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className={question.type === "SCALE" ? "grid grid-cols-5 gap-2" : "grid gap-2"}>
                    {question.options.map((option) => (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted/50">
                        <input type="radio" name={question.key} value={option.value} checked={answers[question.key]?.[0] === option.value} onChange={() => setSingleValue(question.key, option.value)} className="size-4" />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
            ))}
          </CardContent>
        </Card>
      ))}
      {error ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p> : null}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
