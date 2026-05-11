import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Privacy · Hantavirus tracker",
  description:
    "What this site collects, what it stores, and what it does not — including third-party services and cookies.",
};

export default async function PrivacyPage() {
  const md = await readContent("privacy.md");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-h1 font-semibold text-text-primary md:text-display">
        Privacy
      </h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        How this site handles data. Short version: it doesn&apos;t collect any.
      </p>

      <div className="mt-8">
        <Prose markdown={md} />
      </div>
    </div>
  );
}
