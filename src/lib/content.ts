import { promises as fs } from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src", "content");

export async function readContent(name: string): Promise<string> {
  return fs.readFile(path.join(contentDir, name), "utf-8");
}

// Split a markdown file by `---` horizontal rules, keeping each section's
// heading and body as a single block. Useful for the FAQ which uses `---`
// between its three sections.
export function splitByHr(md: string): string[] {
  return md
    .split(/^---\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean);
}
