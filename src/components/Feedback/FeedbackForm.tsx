"use client";

import { useEffect, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function FeedbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Read window.location after mount only — avoids a hydration mismatch
  // when the form is rendered on the server with an empty value and the
  // client immediately patches it in.
  const [sourcePath, setSourcePath] = useState("");
  useEffect(() => {
    // Reading client-only state (window.location) on mount. Lazy useState
    // initialisers run during SSR where `window` is undefined, so this has
    // to be in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSourcePath(window.location.pathname);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          source: data.get("source"),
          hp: data.get("hp"),
        }),
      });

      if (!response.ok) {
        const json = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(json.error ?? "Something went wrong.");
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6"
    >
      {/* Honeypot — hidden field for bot detection */}
      <div aria-hidden className="hidden">
        <label>
          Don&apos;t fill this in
          <input
            type="text"
            name="hp"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="fb-message"
          className="text-body-sm font-medium text-text-primary"
        >
          Message
          <span aria-hidden className="ml-1 text-alert">
            *
          </span>
        </label>
        <textarea
          id="fb-message"
          name="message"
          required
          minLength={3}
          maxLength={5000}
          rows={6}
          placeholder="Bug report, correction, source we should add, or anything else."
          className="rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="fb-name"
            className="text-body-sm font-medium text-text-primary"
          >
            Name <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="fb-name"
            name="name"
            type="text"
            maxLength={120}
            autoComplete="name"
            className="rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="fb-email"
            className="text-body-sm font-medium text-text-primary"
          >
            Email <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="fb-email"
            name="email"
            type="email"
            maxLength={200}
            autoComplete="email"
            placeholder="If you want a reply"
            className="rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary placeholder:text-text-tertiary focus:border-brand-primary focus:outline-none"
          />
        </div>
      </div>

      <input type="hidden" name="source" value={sourcePath} readOnly />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-brand-primary px-4 py-2 text-body-sm font-medium text-text-inverse hover:bg-brand-deep disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>
        {status === "success" && (
          <p
            role="status"
            className="text-body-sm text-brand-deep"
          >
            Thanks — your feedback was received.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-body-sm text-alert">
            {errorMessage}
          </p>
        )}
      </div>

      <p className="text-meta text-text-tertiary">
        Submissions are stored on this site&apos;s database and reviewed by the
        site owner. We never share or sell your information. Email is optional
        and only used to reply if you ask for one.
      </p>
    </form>
  );
}
