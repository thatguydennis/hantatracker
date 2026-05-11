import { readContent, splitByHr } from "@/lib/content";
import { FaqTabs } from "@/components/Faq/FaqTabs";

interface FaqSection {
  title: string;
  body: string;
}

function parseSections(md: string): FaqSection[] {
  const chunks = splitByHr(md);
  const sections: FaqSection[] = [];
  for (const chunk of chunks) {
    const match = chunk.match(/^##\s+Section\s+\d+\s*[—-]\s*(.+?)\s*\n([\s\S]*)$/m);
    if (match) {
      sections.push({ title: match[1].trim(), body: match[2].trim() });
    }
  }
  return sections;
}

export default async function FaqPage() {
  const md = await readContent("faq.md");
  const sections = parseSections(md);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-h1 font-semibold text-text-primary md:text-display">
        FAQ
      </h1>
      <p className="mt-2 max-w-2xl text-body text-text-secondary">
        Answers about this site, the virus, and the MV Hondius outbreak.
      </p>

      <div className="mt-8">
        {sections.length > 0 ? (
          <FaqTabs sections={sections} />
        ) : (
          <p className="text-body text-text-secondary">
            FAQ content not available.
          </p>
        )}
      </div>
    </div>
  );
}
