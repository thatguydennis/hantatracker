import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { FeedbackForm } from "@/components/Feedback/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Send feedback, corrections, or source suggestions to the site maintainers.",
};

export default function FeedbackPage() {
  return (
    <PageShell
      title="Feedback"
      subtitle="Report a factual error, suggest a source, or send anything else. Email and name are optional."
    >
      <FeedbackForm />
    </PageShell>
  );
}
