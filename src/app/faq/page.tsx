import { readContent, splitByHr } from "@/lib/content";
import { FaqTabs } from "@/components/Faq/FaqTabs";
import { PageShell } from "@/components/PageShell";

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
    <PageShell
      title="FAQ"
      subtitle="Answers about this site, the virus, and the MV Hondius outbreak."
    >
      {sections.length > 0 ? (
        <FaqTabs sections={sections} />
      ) : (
        <p className="text-body text-text-secondary">
          FAQ content not available.
        </p>
      )}
    </PageShell>
  );
}
