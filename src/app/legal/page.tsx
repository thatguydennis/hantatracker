import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Legal · Hantavirus tracker",
  description:
    "Health-information disclaimer, source attribution, accuracy notice, and terms of use.",
};

export default async function LegalPage() {
  const md = await readContent("legal.md");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-h1 font-semibold text-text-primary md:text-display">
        Legal
      </h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Health-information disclaimer, source attribution, and terms of use.
      </p>

      <div className="mt-8">
        <Prose markdown={md} />
      </div>
    </div>
  );
}
