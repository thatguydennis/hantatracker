import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import { Prose } from "@/components/Prose";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Health-information disclaimer, source attribution, accuracy notice, and terms of use.",
};

export default async function LegalPage() {
  const md = await readContent("legal.md");

  return (
    <PageShell
      title="Legal"
      subtitle="Health-information disclaimer, source attribution, and terms of use."
    >
      <Prose markdown={md} />
    </PageShell>
  );
}
