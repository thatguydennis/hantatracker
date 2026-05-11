import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import { Prose } from "@/components/Prose";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site collects, what it stores, and what it does not — including third-party services and cookies.",
};

export default async function PrivacyPage() {
  const md = await readContent("privacy.md");

  return (
    <PageShell
      title="Privacy"
      subtitle="How this site handles data. Short version: it doesn't collect any."
    >
      <Prose markdown={md} />
    </PageShell>
  );
}
