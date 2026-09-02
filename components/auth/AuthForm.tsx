"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

function getCallbackURL(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isRegistration = mode === "register";
  const callbackURL = getCallbackURL(searchParams.get("callbackURL"));
  const alternateAuthURL = `${isRegistration ? "/login" : "/register"}?callbackURL=${encodeURIComponent(callbackURL)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const result = isRegistration
      ? await authClient.signUp.email({
          name: String(formData.get("name")),
          email,
          password,
          callbackURL,
        })
      : await authClient.signIn.email({
          email,
          password,
          callbackURL,
        });

    setIsSubmitting(false);

    if (result.error) {
      setMessage(result.error.message || "Unable to continue. Please try again.");
      return;
    }

    if (isRegistration) {
      router.push(`/login?registered=1&callbackURL=${encodeURIComponent(callbackURL)}`);
      return;
    }

    router.push(callbackURL);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setMessage(null);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL,
      disableRedirect: true,
      requestSignUp: isRegistration,
    });

    if (result.error) {
      setMessage(
        result.error.message ||
          "Google sign-in is unavailable. Check the server OAuth configuration.",
      );
      setIsSubmitting(false);
      return;
    }

    const googleURL = result.data?.url;

    if (!googleURL || new URL(googleURL).origin !== "https://accounts.google.com") {
      setMessage("Google sign-in returned an invalid authorization URL. Please try again.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign(googleURL);
  }

  return (
    <main className="flex min-h-[calc(100svh-300px)] items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-primary">Cyber Safe BD</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {isRegistration ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isRegistration
            ? "Register to access trusted support and keep track of your requests."
            : "Sign in to continue to your account."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegistration ? (
            <label className="block space-y-1.5 text-sm font-medium">
              Full name
              <Input name="name" autoComplete="name" required />
            </label>
          ) : null}
          <label className="block space-y-1.5 text-sm font-medium">
            Email address
            <Input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            Password
            <Input
              name="password"
              type="password"
              autoComplete={isRegistration ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </label>

          {message ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {message}
            </p>
          ) : null}

          <Button className="w-full" type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : isRegistration
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          OR
        </div>

        <Button
          className="w-full"
          variant="outline"
          size="lg"
          type="button"
          disabled={isSubmitting}
          onClick={handleGoogleSignIn}
        >
          <span className="font-semibold text-[#4285F4]" aria-hidden="true">G</span>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isRegistration ? "Already have an account?" : "Need an account?"}{" "}
          <Link className="font-medium text-primary hover:underline" href={alternateAuthURL}>
            {isRegistration ? "Sign in" : "Register"}
          </Link>
        </p>
      </section>
    </main>
  );
}
