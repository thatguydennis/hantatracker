import { readContent } from "@/lib/content";
import { Prose } from "@/components/Prose";

export default async function SciencePage() {
  const md = await readContent("science.md");

  // Drop the first h1 from the markdown — we render our own page title.
  const body = md.replace(/^#\s+.+\n+/, "");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-h1 font-semibold text-text-primary md:text-display">
        Science explainer
      </h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Plain-language background on hantavirus, how it spreads, and why the
        Andes strain behaves differently.
      </p>

      <div className="mt-8">
        <Prose markdown={body} />
      </div>
    </div>
  );
}
