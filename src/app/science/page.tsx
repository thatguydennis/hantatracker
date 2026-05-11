import { readContent } from "@/lib/content";
import { Prose } from "@/components/Prose";
import { PageShell } from "@/components/PageShell";

export default async function SciencePage() {
  const md = await readContent("science.md");
  // Drop the first h1 from the markdown — PageShell provides our page title.
  const body = md.replace(/^#\s+.+\n+/, "");

  return (
    <PageShell
      title="Science explainer"
      subtitle="Plain-language background on hantavirus, how it spreads, and why the Andes strain behaves differently."
    >
      <Prose markdown={body} />
    </PageShell>
  );
}
